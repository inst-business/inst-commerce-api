import mongoose, { Schema, Document, Query, Model, QueryWithHelpers, HydratedDocument } from 'mongoose'

export type TWithSoftDeleted = {
  isDeleted: boolean
  deletedAt: Date | null
}
type TDocument = TWithSoftDeleted & Document

type TQueryWithHelpers = QueryWithHelpers<Boolean, TDocument>
export interface ISoftDeleteQueryHelpers<T> extends Model<T> {
  removeOne(id: string): TQueryWithHelpers
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

  const QueryHelpers = {
    // Remove (soft deletes) document
    removeOne: async function (
      this: QueryWithHelpers<TDocument, HydratedDocument<TDocument>, ISoftDeleteQueryHelpers<TDocument>>,
      id: string
    ): Promise<TQueryWithHelpers> {
      const doc = await this.findById(id)
      const res = await setIsDeleted(<TDocument>doc)
        .then(res => res.toObject())
        .catch(err => false)
      return res
    },
  }

  const setIsDeleted = async (doc: TDocument) => {
    doc.isDeleted = true
    doc.deletedAt = new Date()
    doc.$isDeleted(true)
    return await doc.save()
  }

  const excludeDeletedInQuery = async function (
    this: Query<TWithSoftDeleted, Document>,
    next: mongoose.CallbackWithoutResultAndOptionalError
  ) {
    this.where({ isDeleted: false })
    next()
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

  // Queries for available document(s)
  findQueries.forEach((type) => {
    schema.pre(<any>type, excludeDeletedInQuery)
  })
  schema.pre('aggregate', excludeDeletedInAggregateMiddleware)

}

export {
  withSoftDeletePlugin,
}