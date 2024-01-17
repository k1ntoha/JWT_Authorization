import { AxiosResponse } from 'axios'
import $api from '../http'
import { AuthResponse } from '../models/response/AuthResponse'

export default class AuthService {
	static async login(
		loginOrEmail: string,
		password: string
	): Promise<AxiosResponse<AuthResponse>> {
		return $api.post<AuthResponse>('/login', { loginOrEmail, password })
	}

	static async googleAuth(
		login: string,
		email: string,
		password: string
	): Promise<AxiosResponse<AuthResponse>> {
		return $api.post<AuthResponse>('/googleAuth', {
			login: login,
			email: email,
			password: password,
		})
	}

	static async registration(
		login: string,
		email: string,
		password: string
	): Promise<AxiosResponse<AuthResponse>> {
		return $api.post<AuthResponse>('/registration', { login, email, password })
	}

	static async sendRecoverMail(email: string): Promise<AxiosResponse> {
		return $api.post<AuthResponse>('/sendRecoverMail', { email: email })
	}

	static async setNewPassword(
		password: string,
		code: string,
		recoverEmail: string
	): Promise<AxiosResponse<AuthResponse>> {
		return await $api.post<AuthResponse>('/setNewPassword', {
			password: password,
			code: code,
			recoverEmail: recoverEmail,
		})
	}

	static async logout(): Promise<void> {
		return $api.get('/logout')
	}
	static async getAllUsers(): Promise<AxiosResponse<AuthResponse[]>> {
		return $api.get('/getAllUsers')
	}
}
