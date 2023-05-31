import { isNull } from 'lodash'
import mongoose, { Schema, Document, Query, Model, QueryWithHelpers, HydratedDocument, MongooseDefaultQueryMiddleware } from 'mongoose'

export type TWithSoftDeleted = {
  isDeleted: boolean
  deletedAt: Date | null
}
type TDocument = Document & TWithSoftDeleted

type TQueryWithHelpers = QueryWithHelpers<Boolean, TDocument>
export interface ISoftDeleteQueryHelpers<T> extends Model<T> {
  softDelete(): TQueryWithHelpers
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

  const QueryHelpers = {
    // Remove (soft deletes) document
    softDelete: async function (
      this: QueryWithHelpers<TDocument, HydratedDocument<TDocument>, ISoftDeleteQueryHelpers<TDocument>>
      // this: TDocument
    ) {
      const doc = await this
      if (isNull(doc)) return false
      doc.isDeleted = true
      doc.deletedAt = new Date()
      doc.$isDeleted(true)
      return doc.save().then(res => [true, res.toObject()]).catch(err => false)
    },
  }
  
  const excludeDeletedInAggregateMiddleware = async function (
    this: mongoose.Aggregate<any>,
    next: mongoose.CallbackWithoutResultAndOptionalError
  ) {
    this.pipeline().unshift({ $match: { isDeleted: false } })
    next()
  }

  // Query Helpers
  schema.query = QueryHelpers

  // Exclude deleted document(s)
  findQueries.forEach(method => {
    schema.pre(<MongooseDefaultQueryMiddleware>method, function (next): void {
      this.where({ isDeleted: false })
      next()
    })
  })
  schema.pre('aggregate', excludeDeletedInAggregateMiddleware)

  // Delete queries for available document(s)
  deleteQueries.forEach((type) => {
    schema.pre(<any>type, function (next): void {
      this.where({ isDeleted: true })
      next()
    })
  })
}

export {
  withSoftDeletePlugin,
}