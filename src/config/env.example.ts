export const env = {
  'development': {
    name: 'development',
    protocol: 'http',
    host: 'localhost:7543',
    port: 7543,
    jwtSecret: 'wefwe53HelloIt"sme',
    bccEmail: "nguyenbaotoan2001@gmail.com",
    iat: {
      host: 'http://localhost:7543',
      reset_pwd_url: 'http://localhost:7543/reset-password', 
      reset_pwd_url_internal: 'http://localhost:7543/internal/reset-password', 
      register_url: 'http://localhost:7543/register/continue',
      AES_passphase: '^%Fhwefwe53hx*^dsdf',
      AES_passphase_internal: '',
    },
    mongodb: {
      connectionString: 'mongodb://127.0.0.1:27017',
      protocol: 'mongodb',
      host: '127.0.0.1',
      port: 27017,
      database: 'my_instances_db',
      user: '',
      password: '',
      opts: {}
    },
    mysql: {
      host: '',
      port: 80,
      database: '',
      user: '',
      password: ''
    },
    kong: {
      adminHost: 'http://127.0.0.1:8001',
      hostRedirect: 'https://admin.aire.com'
    },
    redis: {

    },
    twilio: {
      host: 'https://api.authy.com',
      accountSid: 'ACc04b5d353e8c21bf1b6cd4b94fa9edc4',
      authToken: '1975b33e0665121af61dbc46d93bafff'
    },
    nodemailer: {
      username: "",
      password: "",
      port: 80,
      host: '',
      service: ''
    }
  },
  'staging': {
    name: 'staging',
  },
  'production': {
    name: 'production',
  }
}