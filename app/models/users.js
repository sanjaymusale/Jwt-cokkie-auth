const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const { JWT_SIGN } = require('../constant')
const jwt = require('jsonwebtoken')
const { Schema } = mongoose

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
		minlength: 3
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
		maxlength: 128
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	tokens: [
		{
			token: {
				type: String
			}
		}
	]


})

// pre/post hooks - mongoose Middleware
userSchema.pre('save', function (next) {
	if (this.isNew) {
		bcryptjs.genSalt(10)
			.then((salt) => {
				bcryptjs.hash(this.password, salt).then((hashedPassword) => {
					this.password = hashedPassword
					next()
				})
			})
	}
	else {
		next()
	}

})

userSchema.statics.validateUserSession = function (session) {
	const User = this
	return User.findOne({ email })
}

userSchema.statics.findByEmailandPassword = function (email, password) {
	const User = this
	return User.findOne({ email })
		.then((user) => {
			if (user) {
				return bcryptjs.compare(password, user.password)
					.then((result) => {
						if (result) {
							return new Promise((resolve, reject) => {
								resolve(user)
							})
						}
						else {
							return new Promise((resolve, reject) => {
								const err = 'Invalid Email and Password'
								reject({ error: err })
							})
						}
					})
			} else {
				return Promise.reject({ error: 'Invalid Email and Password' })
			}

		})
		.catch((err) => {
			return Promise.reject(err)
		})
}

userSchema.statics.findByToken = function (token) {
	const User = this
	let tokenData
	try {
		tokenData = jwt.verify(token, JWT_SIGN)
	} catch (err) {
		return Promise.reject(err)
	}
	return User.findOne({
		'_id': tokenData.userid
	})
		.then((user) => {
			var found = user.tokens.some(x => x.token === token)
			if (found) {
				return Promise.resolve(user)
			}
			else {
				return Promise.reject({ notice: 'redirect to login page' })
			}
		})
		.catch((err) => {
			return Promise.reject(err)
		})
}

userSchema.statics.removeToken = function (token) {
	const User = this
	let tokenData
	try {
		tokenData = jwt.verify(token, JWT_SIGN)
	} catch (err) {
		return Promise.reject(err)
	}
	return User.findOne({
		'_id': tokenData.userid
	})
		.then((user) => {
			var found = user.tokens.some(x => x.token === token)
			if (found) {
				const removedTokens = user.tokens.filter(x => x.token === token)
				user.tokens = removedTokens
				return user.save()
					.then(() => {
						return Promise.resolve({ message: 'Logout Successfull' })
					})
					.catch((err) => {
						return err
					})
			}
			else {
				return Promise.reject({ notice: 'redirect to login page' })
			}
		})
		.catch((err) => {
			return Promise.reject(err)
		})
}

userSchema.methods.generateToken = function () {
	const user = this
	const tokenData = {
		userid: user._id,
		name: user.name
	}
	const token = jwt.sign(tokenData, JWT_SIGN)
	user.tokens.push({ token })
	return user.save()
		.then(() => {
			return token
		})
		.catch((err) => {
			return err
		})
}

const User = mongoose.model('User', userSchema)

module.exports = {
	User
}