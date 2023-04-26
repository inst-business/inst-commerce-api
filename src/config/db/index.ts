import { connect } from "mongoose"

async function conn () {
  try {
    const opts = {}
    await connect('mongodb://127.0.0.1:27017/my_first_mongodb', opts)
    console.log('connect successfully')
  } catch (error) {
    console.log('connect failure: ', error)
  }
}

export { conn }