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
      await connect(this.ENV.mongodb.host + '/' + this.ENV.mongodb.database, this.ENV.mongodb.opts)
      console.log(`MongoDB connect to ${this.ENV.mongodb.database} successfully!`)
    }
    catch (err) {
      console.log('MongoDB connect failure: ', err)
    }
  }
}

export default Connect