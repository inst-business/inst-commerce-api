import mongoose, { Schema, model } from 'mongoose'

export interface ICourse {
  name: string;
  desc: string;
  img: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const courseSchema = new Schema<ICourse>({
  name: { type: String, maxLength: 255, required: true },
  desc: { type: String },
  img: { type: String, required: true },
  slug: { type: String, maxLength: 255, required: true },
}, { timestamps: true })

const Course = model<ICourse>('Course', courseSchema)

export default Course