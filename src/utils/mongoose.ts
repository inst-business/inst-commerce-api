import mongoose, {
  Schema, Document, Query, Model, ObjectId, MongooseError,
  QueryWithHelpers, HydratedDocument, MongooseDefaultQueryMiddleware,
} from 'mongoose'
import withJsonSchema from 'mongoose-schema-jsonschema'
import _ from '@/utils/utils'
import { IResultWithPars } from '@/config/global/const'
import LogicError from '@/utils/logicError'
import ERR from '@/config/global/error'

export const extendedMongoose = withJsonSchema(mongoose)

// Handle errors
export const mongooseError = <E extends MongooseError>(err: E | LogicError, stackAllowed?: boolean) => {
  if (err instanceof LogicError) throw err
  const _error = stackAllowed ? _.stackError : _.logicError
  if (err instanceof mongoose.Error.CastError) {
    const message = err.reason?.message || err.message
    throw _error(err.name, message, 400, ERR.INVALID_DATA, err.value)
  }
  if (err instanceof mongoose.Error.ValidationError) {
    const pars = Object.keys(err.errors).map(field => {
      const { name, path, kind } = err.errors[field]
      return { field: path, validator: kind, error: name }
    })
    throw _error(err.name, err.message, 400, ERR.INVALID_DATA, ...pars)
  }
  throw _error(err.name, err.message, 500, ERR.SERVER_ERROR)
}

// Handle querying
export const handleQuery = <T>(res: Promise<T>, cb?: (data: T) => void): Promise<T> => 
  res.then(data => {
    // console.log('- handleQuery: ', data)
    cb && cb(data)
    // structuredClone() doesnt clone non-built-in classes => ObjectId crashed
    return JSON.parse(JSON.stringify(data))
  }).catch(e => mongooseError(e))

export type ArgumentId = ObjectId | string

// edited details plugin
export const withEditedDetails = (schema: Schema, ref?: string) => {
  schema.add({
    ...(ref && {
      editedBy: { type: Schema.Types.ObjectId, ref }
    }),
    editedAt: { type: Date },
  })
}
export interface IEditedDetails {
  editedBy?: ObjectId
  editedAt?: Date
}


// Soft delete
export interface ISoftDeleted {
  isDeleted: boolean
  deletedBy?: ObjectId
  deletedAt?: Date
}
export type TDocument = Document & ISoftDeleted
// type TQueryWithHelpers = QueryWithHelpers<Boolean, TDocument | TDocument[]>
export interface ISoftDeleteQueryHelpers<T> extends Model<T> {
  softDelete(deletedBy?: ArgumentId): Promise<IResultWithPars>,
  restoreDeleted(): Promise<IResultWithPars>,
}
export type TSuspendableDocument<T> = Model<T, ISoftDeleteQueryHelpers<T>>

// soft delete plugin
export const withSoftDelete = (schema: Schema, ref?: string) => {
  schema.add({
    isDeleted: { type: Boolean, required: true, default: false },
    ...(ref && {
      deletedBy: { type: Schema.Types.ObjectId, ref }
    }),
    deletedAt: { type: Date },
  })

  const findQueries = [
    'count',
    'find',
    'findOne',
    'findOneAndDelete',
    'findOneAndRemove',
    'findOneAndUpdate',
    'update',
    'updateOne',
    'updateMany',
  ]

  const deleteQueries = [
    'deleteOne',
    'deleteMany'
  ]
  
  const excludeDeletedInAggregateMiddleware = async function (
    this: mongoose.Aggregate<any>,
    next: mongoose.CallbackWithoutResultAndOptionalError
  ) {
    this.pipeline().unshift({ $match: { isDeleted: false } })
    next()
  }
  schema.pre('aggregate', excludeDeletedInAggregateMiddleware)

  // Exclude deleted document(s)
  findQueries.forEach(method => {
    schema.pre(<MongooseDefaultQueryMiddleware>method, function (next) {
      const query = this.getQuery()
      if (!('isDeleted' in query && query.isDeleted === true)) {
        this.where({ isDeleted: { $in: [null, false] } })
      }
      next()
    })
  })

  // Delete queries for available document(s)
  deleteQueries.forEach(method => {
    schema.pre(<MongooseDefaultQueryMiddleware>method, function (next) {
      this.where({ isDeleted: true })
      next()
    })
  })

  const setDocumentDeletion = (doc: TDocument, isDeleted: boolean, deletedBy?: ArgumentId) => {
    doc.isDeleted = isDeleted
    doc.deletedBy = isDeleted ? <ObjectId>deletedBy : undefined
    doc.deletedAt = isDeleted ? new Date() : undefined
    doc.$isDeleted(isDeleted)
    return handleQuery(doc.save()).then(res => true)
  }
  type TDocumentWithQueryHelpers = QueryWithHelpers<
    TDocument | TDocument[],
    HydratedDocument<TDocument | TDocument[]>,
    ISoftDeleteQueryHelpers<TDocument | TDocument[]>
  >

  const QueryHelpers = {
    // Remove (soft deletes) document
    softDelete: async function (this: TDocumentWithQueryHelpers, deletedBy?: ArgumentId): Promise<IResultWithPars> {
      const data = await this.where({ isDeleted: false })
      if (data == null || (Array.isArray(data) && data.length <= 0)) {
        throw _.logicError('Null', 'No data found.', 400, ERR.EMPTY_DATA)
      }
      if (!Array.isArray(data)) {
        const result = await setDocumentDeletion(data, true, deletedBy)
        return { result, ...(result && { pars: [data._id] }) }
      }
      const pars = new Array()
      for (const doc of new Set(data)) {
        const result = await setDocumentDeletion(doc, true, deletedBy)
        if (result) pars.push(doc._id)
      }
      return {
        result: pars.length > 0 ? true : false,
        ...(pars.length > 0 && { pars })
      }
    },
    restoreDeleted: async function (this: TDocumentWithQueryHelpers): Promise<IResultWithPars> {
      const data = await this.where({ isDeleted: true })
      if (data == null || (Array.isArray(data) && data.length <= 0)) {
        throw _.logicError('Null', 'No data found.', 400, ERR.EMPTY_DATA)
      }
      if (!Array.isArray(data)) {
        const result = await setDocumentDeletion(data, false)
        return { result, ...(result && { pars: [data._id] }) }
      }
      const pars = new Array()
      for (const doc of new Set(data)) {
        const result = await setDocumentDeletion(doc, false)
        if (result) pars.push(doc._id)
      }
      return {
        result: pars.length > 0 ? true : false,
        ...(pars.length > 0 && { pars })
      }
    }
  }
  
  // Query Helpers
  schema.query = QueryHelpers
}