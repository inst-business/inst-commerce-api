import { Schema, model } from 'mongoose'

export interface ICourse {
  name: String;
  desc: String;
  img: String;
  slug: String;
  createdAt?: Date;
  updatedAt?: Date;
}

const courseSchema = new Schema<ICourse>({
  name: { type: Number, maxLength: 255, require: true },
  desc: { type: String, maxLength: 1000 },
  img: { type: String, maxLength: 255, require: true },
  slug: Number
}, { timestamps: true })

const Course = model<ICourse>('Course', courseSchema)

export default Course