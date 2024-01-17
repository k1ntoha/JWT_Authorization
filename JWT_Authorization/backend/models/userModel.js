const { Schema, model } = require('mongoose')

const userSchema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, unique: true },
	login: { type: String, required: true, unique: true },
	isActivated: { type: Boolean, default: false },
	activationLink: { type: String },
	activationCode: { type: String, default: '' },
})

module.exports = model('user', userSchema)
