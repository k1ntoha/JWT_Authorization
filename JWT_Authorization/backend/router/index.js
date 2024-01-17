const Router = require('express').Router
const router = new Router()
const userController = require('../controllers/userController')
const { body } = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware.js')

router.post(
	'/registration',
	body('email').isEmail(),
	body('password').isLength({ min: 4, max: 36 }),
	userController.registration
)
router.post('/login', body('loginOrEmail').isEmail(), userController.login)
router.get('/logout', userController.logout)

router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)

router.post('/googleAuth', userController.googleAuth)

router.post('/sendRecoverMail', userController.sendRecoverMail)
router.post('/setNewPassword', userController.recover)

router.get('/getAllUsers', authMiddleware, userController.getUsers)

module.exports = router
