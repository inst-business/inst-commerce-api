
class Token {
  static getAccessToken () {
    return localStorage.accessToken
  }
  
  static setAccessToken (accessToken) {
    if (accessToken == null) return
    localStorage.setItem('accessToken', accessToken)
  }

  static getRefreshToken () {
    return localStorage.refreshToken
  }

  // static setRefreshToken (refreshToken) {
  //   if (refreshToken == null) return
  //   localStorage.setItem('accessToken', refreshToken)
  // }

  static clear () {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

export default Token