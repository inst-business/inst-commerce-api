import { connect, Schema } from "mongoose"

const DB_NAME = 'my_instances_db'

async function conn () {
  try {
    const opts = {}
    await connect('mongodb://127.0.0.1:27017/' + DB_NAME, opts)
    console.log('connect successfully')
  } catch (error) {
    console.log('connect failure: ', error)
  }
}


export { conn }