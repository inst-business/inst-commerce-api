import { connect } from "mongoose"

class Connect {

  private ENV: any
  public static DB: any
  public static NODEMAILER: any

  constructor () {
    this.ENV = process.env
    this.configureConnections()
  }

  public async configureConnections () {
    try {
      const connectionString = this.ENV.DB_CONNSTR
      const dbname = this.ENV.DB_NAME
      const opts = {
        retryWrites: true,
        socketTimeoutMS: 5000,
        connectTimeoutMS: 5000
      }
      await connect(`${connectionString}/${dbname}`, opts)
      console.log(`MongoDB connect to ${dbname} successfully!`)
    }
    catch (err) {
      console.log('MongoDB connect failure: ', err)
    }
  }
}

export default Connect