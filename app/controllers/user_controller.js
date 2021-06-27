const express = require('express')
const router = express.Router()
const { COOKIE_NAME } = require('../constant')
const { User } = require('../models/users')

router.get('/', (req, res) => {
	User.find()
		.then((users) => {
			res.send(users)
		})
		.catch((err) => {
			res.send(err)
		})
})

router.post('/register', (req, res) => {
	const body = req.body
	const user = new User(body)
	user.save()
		.then((user) => {
			res.send({
				user,
				notice: "Succesfully Registered"
			})
		})
		.catch((err) => {
			res.send(err)
		})

})

// validate cookie
function validateCookie(req, res, next) {
	const { cookies } = req
	if (COOKIE_NAME in cookies) {
		User.findByToken(cookies[COOKIE_NAME])
			.then(res => {
				next();
			})
			.catch((err) => {
				res.status(403).json({ msg: 'Not Authenticated' })
			})
	} else res.status(403).json({ msg: 'Not Authenticated' })
}

//	to login
router.post('/login', (req, res) => {
	const body = req.body
	User.findByEmailandPassword(body.email, body.password)
		.then((user) => {
			const token = user.generateToken()
			return token
		})
		.then((response) => {
			res.cookie(COOKIE_NAME, response, { httpOnly: true, maxAge: 3600000000 });
			res.status(200).json({ status: 'ok', msg: 'Login success' });
		})
		.catch((err) => {
			res.send(err)
		})
})


router.get('/logout', validateCookie, (req, res) => {
	const { cookies } = req
	if (COOKIE_NAME in cookies) {
		User.removeToken(cookies[COOKIE_NAME])
			.then(data => {
				res.cookie(COOKIE_NAME, '', {
					maxAge: 0
				}).json(data)
			})
			.catch((err) => {
				res.status(403).json({ msg: 'Not Authenticated' })
			})
	}
})

module.exports = {
	userRouter: router
}