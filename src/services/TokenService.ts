
class Token {
  static getAccessToken (): string {
    return localStorage.accessToken
  }
  
  static setAccessToken (accessToken: string) {
    if (accessToken == null) return
    localStorage.setItem('accessToken', accessToken)
  }

  static getRefreshToken (): string {
    return localStorage.refreshToken
  }

  // static setRefreshToken (refreshToken: string) {
  //   if (refreshToken == null) return
  //   localStorage.setItem('accessToken', refreshToken)
  // }

  static clear () {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

export default Token