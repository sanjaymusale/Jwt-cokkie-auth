const mongoose = require('mongoose')
// DB CONFIGURATION
// telling mongoose to use es6's promise library
mongoose.Promise = global.Promise
const CONNECTION_URI = 'mongodb+srv://JwtAuth:JwtAuth@cluster0.9ohm8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(CONNECTION_URI, { useNewUrlParser: true })
    .then(() => {
        console.log('connected to db')
    })
    .catch((err) => {
        console.log('Error connecting to DB', err)
    })

module.exports = {
    mongoose
}