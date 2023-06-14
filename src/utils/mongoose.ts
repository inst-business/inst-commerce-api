import { isArray, isNull } from 'lodash'
import mongoose, { Schema, Document, Query, Model, QueryWithHelpers, HydratedDocument, MongooseDefaultQueryMiddleware } from 'mongoose'

export type TWithSoftDeleted = {
  isDeleted: boolean
  deletedAt: Date | null
}
type TDocument = Document & TWithSoftDeleted

type TQueryWithHelpers = QueryWithHelpers<Boolean, TDocument | TDocument[]>
export interface ISoftDeleteQueryHelpers<T> extends Model<T> {
  softDelete(): TQueryWithHelpers,
  restoreDeleted(): TQueryWithHelpers,
}
export type TSoftDeleteQueryHelpers<T> = Model<T, ISoftDeleteQueryHelpers<T>>

const withSoftDeletePlugin = (schema: Schema) => {
  schema.add({
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
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
    schema.pre(<MongooseDefaultQueryMiddleware>method, function (next): void {
      const query = this.getQuery()
      if (!('isDeleted' in query && query.isDeleted === true)) {
        this.where({ isDeleted: false })
      }
      next()
    })
  })

  // Delete queries for available document(s)
  deleteQueries.forEach((method) => {
    schema.pre(<MongooseDefaultQueryMiddleware>method, function (next): void {
      this.where({ isDeleted: true })
      next()
    })
  })


  const setDocumentDeletion = (doc: TDocument, isDeleted: boolean) => {
    doc.isDeleted = isDeleted
    doc.deletedAt = isDeleted ? new Date() : null
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
    softDelete: async function (
      this: TDocumentWithQueryHelpers
    ) {
      this.where({ isDeleted: false })
      const doc = await this
      if (isNull(doc)) return false
      if (isArray(doc)) {
        return doc.reduce((prev, cur) => [...prev, setDocumentDeletion(cur, true)], <Object[]>[])
      }
      return setDocumentDeletion(doc, true)
    },
    restoreDeleted: async function (
      this: TDocumentWithQueryHelpers
    ) {
      this.where({ isDeleted: true })
      const doc = await this
      if (isNull(doc)) return false
      if (isArray(doc)) {
        return doc.reduce((prev, cur) => [...prev, setDocumentDeletion(cur, false)], <Object[]>[])
      }
      return setDocumentDeletion(doc, false)
    }
  }
  
  // Query Helpers
  schema.query = QueryHelpers

}

export {
  withSoftDeletePlugin,
}