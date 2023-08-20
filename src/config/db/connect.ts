import { connect } from 'mongoose'
import { GV } from '@/config/global/const'
import _ from '@/utils/utils'
import ERR from '@/config/global/error'
import { mongoError } from '@/utils/mongoose'

class Connect {

  private ENV: any
  public static DB: any
  public static NODEMAILER: any

  constructor () {
    this.ENV = process.env
    this.configureConnections()
  }

  public async configureConnections () {
    const connectionString = this.ENV.DB_CONNSTR
    const dbname = this.ENV.DB_NAME
    const timeOut = GV.CONNECT_TIMEOUT
    const opts = {
      retryWrites: true,
      socketTimeoutMS: timeOut,
      connectTimeoutMS: timeOut,
      serverSelectionTimeoutMS: timeOut,
      heartbeatFrequencyMS: timeOut,
    }
    await connect(`${connectionString}/${dbname}`, opts)
      .then(res => console.log(`MongoDB connect to ${dbname} successfully!`))
      // .catch(err => console.dir(err))
      .catch(err => mongoError(err))
  }
}

export default Connect