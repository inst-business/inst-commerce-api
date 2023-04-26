const mongoosesToObj = (mongooses) => 
  mongooses.map(mongoose => mongoose.toObject())

const mongooseToObj = (mongoose) => 
  mongoose ? mongoose.toObject() : mongoose

export {
  mongoosesToObj,
  mongooseToObj
}