import { connect } from "mongoose"

class Connect {

  private ENV: any
  public static DB: any
  public static NODEMAILER: any

  constructor (env: any) {
    this.ENV = env
    this.configureConnections()
  }

  public async configureConnections () {
    try {
      const connectionString = this.ENV.mongodb.connectionString
      const db = this.ENV.mongodb.database
      const opts = this.ENV.mongodb.opts
      await connect(`${connectionString}/${db}`, opts)
      console.log(`MongoDB connect to ${this.ENV.mongodb.database} successfully!`)
    }
    catch (err) {
      console.log('MongoDB connect failure: ', err)
    }
  }
}

export default Connect