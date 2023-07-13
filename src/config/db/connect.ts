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
      const connectionString = this.ENV.mongodb?.connectionString || this.ENV.DB_CONNSTR
      const dbname = this.ENV.mongodb?.database || this.ENV.DB_NAME
      const opts = this.ENV.mongodb?.opts
      await connect(`${connectionString}/${dbname}`, opts)
      console.log(`MongoDB connect to ${dbname} successfully!`)
    }
    catch (err) {
      console.log('MongoDB connect failure: ', err)
    }
  }
}

export default Connect