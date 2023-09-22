import { connect } from 'mongoose'
import { createClient } from 'redis'
import { GV } from '@/config/global/const'
import _ from '@/utils/utils'
import ERR from '@/config/global/error'
import { mongooseError } from '@/utils/mongoose'

class Connect {

  static DB: any
  static NODEMAILER: any

  constructor () {
    this.configureConnections()
    this.configureCache()
  }

  private async configureConnections () {
    const connectionString = _.env('DB_CONNSTR')
    const dbname = _.env('DB_NAME')
    const timeOut = GV.CONNECT_TIMEOUT
    const opts = {
      retryWrites: true,
      socketTimeoutMS: timeOut,
      connectTimeoutMS: timeOut,
      serverSelectionTimeoutMS: timeOut,
      heartbeatFrequencyMS: timeOut,
    }
    await connect(`${connectionString}/${dbname}`, opts)
      .then(() => console.log(`MongoDB connect to ${dbname} successfully!`))
      // .catch(e => console.log(e))
      .catch(e => mongooseError(e))
  }

  private async configureCache () {
    const client = createClient()
    client.on('error', e => console.error('Redis Client Error', e))
  }

}

export default Connect