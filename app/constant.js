const COOKIE_NAME = 'session'
const JWT_SIGN = 'auth$123'
const ORIGIN = /3000|3001$/
// const ORIGIN = /example\.com$/, //request that is coming from an origin ending with “example.com”

module.exports = {
  COOKIE_NAME,
  JWT_SIGN,
  ORIGIN
}