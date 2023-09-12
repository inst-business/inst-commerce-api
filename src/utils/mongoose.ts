import _ from '@/utils/utils'
import mongoose, {
  Schema, Document, Query, Model, ObjectId, MongooseError,
  QueryWithHelpers, HydratedDocument, MongooseDefaultQueryMiddleware,
  Types
} from 'mongoose'
import ERR from '@/config/global/error'


// Handle errors
export const mongoError = (err: MongooseError, stackAllowed?: boolean) => {
  const { name, message, stack } = err
  const pars = (<any>err).errors
  const error = (stackAllowed ? _.stackError : _.logicError)
    (name, message, 500, ERR.INVALID_DATA, pars)
  throw error
}

// Handle querying
export const handleQuery = <T>(res: Promise<T>, cb?: (data: T) => void): Promise<T> => 
  res.then(data => {
    cb && cb(data)
    // structuredClone() doesnt clone non-built-in classes => ObjectId crashed
    return JSON.parse(JSON.stringify(data))
  }).catch(e => mongoError(e))


// edited details plugin
export const withEditedDetails = (schema: Schema, ref: string) => {
  schema.add({
    editedBy: { type: Schema.Types.ObjectId, ref },
    editedAt: { type: Date },
  })
}


// Soft delete
export type TWithSoftDeleted = {
  isDeleted: boolean
  deletedBy?: ObjectId
  deletedAt?: Date
}
export type TDocument = Document & TWithSoftDeleted
type TQueryWithHelpers = QueryWithHelpers<Boolean, TDocument | TDocument[]>
export interface ISoftDeleteQueryHelpers<T> extends Model<T> {
  softDelete(deletedBy: ObjectId): TQueryWithHelpers,
  restoreDeleted(): TQueryWithHelpers,
}
export type TSuspendableDocument<T> = Model<T, ISoftDeleteQueryHelpers<T>>

// soft delete plugin
export const withSoftDelete = (schema: Schema, ref: string) => {
  schema.add({
    isDeleted: { type: Boolean, required: true, default: false },
    deletedBy: { type: Schema.Types.ObjectId, ref },
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
        this.where({ isDeleted: false })
      }
      next()
    })
  })

  // Delete queries for available document(s)
  deleteQueries.forEach((method) => {
    schema.pre(<MongooseDefaultQueryMiddleware>method, function (next) {
      this.where({ isDeleted: true })
      next()
    })
  })

  const setDocumentDeletion = (doc: TDocument, isDeleted: boolean, deletedBy?: ObjectId) => {
    doc.isDeleted = isDeleted
    doc.deletedBy = isDeleted ? deletedBy : undefined
    doc.deletedAt = isDeleted ? new Date() : undefined
    doc.$isDeleted(isDeleted)
    return doc.save().then(res => [true, res.toObject()]).catch(err => false)
  }
  type TDocumentWithQueryHelpers = QueryWithHelpers<
    TDocument | TDocument[],
    HydratedDocument<TDocument | TDocument[]>,
    ISoftDeleteQueryHelpers<TDocument | TDocument[]>
  >

  const QueryHelpers = {
    // Remove (soft deletes) document
    softDelete: async function (this: TDocumentWithQueryHelpers, deletedBy: ObjectId) {
      this.where({ isDeleted: false })
      const doc = await this
      if (_.isNull(doc)) return false
      if (_.isArray(doc)) {
        return doc.reduce((prev, cur) =>
          [...prev, setDocumentDeletion(cur, true, deletedBy)]
        , <Promise<unknown>[]>[])
      }
      return setDocumentDeletion(doc, true)
    },
    restoreDeleted: async function (this: TDocumentWithQueryHelpers) {
      this.where({ isDeleted: true })
      const doc = await this
      if (_.isNull(doc)) return false
      if (_.isArray(doc)) {
        return doc.reduce((prev, cur) =>
          [...prev, setDocumentDeletion(cur, false)]
        , <Promise<unknown>[]>[])
      }
      return setDocumentDeletion(doc, false)
    }
  }
  
  // Query Helpers
  schema.query = QueryHelpers
}