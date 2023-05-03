const mongoosesToObj = (mongooses: any[]) => 
  mongooses.map(mongoose => mongoose.toObject())

const mongooseToObj = (mongoose: any) => 
  mongoose ? mongoose.toObject() : mongoose

export {
  mongoosesToObj,
  mongooseToObj
}