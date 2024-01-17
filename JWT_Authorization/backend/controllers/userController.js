const userService = require('../service/userService')
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error')
const { OAuth2Client } = require('google-auth-library')
const { default: axios } = require('axios')
class userController {
	async registration(req, res, next) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return next(
					ApiError.BadRequest('Ошибка валидации полей', errors.array())
				)
			}
			const { email, login, password } = req.body
			const userData = await userService.registration(email, password, login)
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				sameSite: 'None',
				secure: true,
			})
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}
	async login(req, res, next) {
		try {
			let flag = true // if email is email , otherwise email is login instead
			if (!validationResult(req).isEmpty()) {
				flag = false
			}
			const { loginOrEmail, password } = req.body
			const userData = await userService.login(loginOrEmail, password, flag)
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				sameSite: 'None',
				secure: true,
			})
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}
	async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			const token = await userService.logout(refreshToken)
			res.clearCookie('refreshToken')
			return res.status(200).json({ token })
		} catch (e) {
			next(e)
		}
	}
	async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			const userData = await userService.refresh(refreshToken)
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				sameSite: 'None',
				secure: true,
			})
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}
	async getUsers(req, res, next) {
		try {
			const users = await userService.getAllUsers()
			return res.json(users)
		} catch (e) {
			next(e)
		}
	}
	async activate(req, res, next) {
		try {
			const activationLink = req.params.link
			await userService.activate(activationLink)
			return res.redirect(process.env.CLIENT_URL)
		} catch (e) {
			next(e)
		}
	}
	async sendRecoverMail(req, res, next) {
		try {
			const { email } = req.body
			const result = await userService.sendCode(email)
			return res.status(200).json(result)
		} catch (e) {
			next(e)
		}
	}
	async recover(req, res, next) {
		try {
			const { password, code, recoverEmail } = req.body
			await userService.recover(recoverEmail, code, password)
			res.status(200).json({ msg: 'Done' })
		} catch (e) {
			next(e)
		}
	}
	async googleAuth(req, res, next) {
		try {
			const { login, email, password } = req.body
			const userData = await userService.googleAuth(login, email, password)
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				sameSite: 'None',
				secure: true,
			})
			return res.status(200).send(userData)
		} catch (e) {
			next(e)
		}
	}
}

module.exports = new userController()
