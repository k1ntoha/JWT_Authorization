import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_URL } from '../http'
import { AuthResponse } from '../models/response/AuthResponse'
import AuthService from '../services/AuthService'
import AuthUser from '../types/UserTypes'

interface UserState {
	authUser: AuthUser
	isLoading: boolean
	isAuth: boolean
	users: AuthUser[]
}

const initialState: UserState = {
	authUser: {} as AuthUser,
	isLoading: false,
	isAuth: false,
	users: [],
}

export const login = createAsyncThunk(
	'users/login',
	async function (user: { loginOrEmail: string; password: string }) {
		const response = await AuthService.login(user.loginOrEmail, user.password)
		return response.data
	}
)

export const googleAuth = createAsyncThunk(
	'users/googleAuth',
	async function (user: { login: string; email: string; password: string }) {
		const response = await AuthService.googleAuth(
			user.login,
			user.email,
			user.password
		)
		return response.data
	}
)

export const registration = createAsyncThunk(
	'users/registration',
	async function (user: { login: string; email: string; password: string }) {
		const response = await AuthService.registration(
			user.login,
			user.email,
			user.password
		)

		return response.data
	}
)

export const getAllUsers = createAsyncThunk(
	'users/getAllUsers',
	async function () {
		const response = await AuthService.getAllUsers()
		return response.data
	}
)

export const logout = createAsyncThunk('users/logout', async function () {
	const response = await AuthService.logout()
})

export const checkAuth = createAsyncThunk('users/checkAuth', async function () {
	const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
		withCredentials: true,
	})
	return response.data
})

export const userSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(login.pending, (state, action) => {
			state.isLoading = true
		})
		builder.addCase(login.fulfilled, (state, action) => {
			state.authUser = action.payload.userData
			localStorage.setItem('token', action.payload.accessToken)
			state.isAuth = true
			state.isLoading = false
		})
		builder.addCase(login.rejected, (state, action) => {
			state.isLoading = false
		})

		builder.addCase(googleAuth.pending, (state, action) => {
			state.isLoading = true
		})
		builder.addCase(googleAuth.fulfilled, (state, action) => {
			state.authUser = action.payload.user
			localStorage.setItem('token', action.payload.accessToken)
			state.isAuth = true
			state.isLoading = false
		})
		builder.addCase(googleAuth.rejected, (state, action) => {
			state.isLoading = false
		})

		builder.addCase(checkAuth.pending, (state, action) => {
			state.isLoading = true
		})
		builder.addCase(checkAuth.fulfilled, (state, action) => {
			localStorage.setItem('token', action.payload.accessToken)
			state.authUser = action.payload.user
			state.isAuth = true
			state.isLoading = false
		})
		builder.addCase(checkAuth.rejected, (state, action) => {
			state.isAuth = false
			state.isLoading = false
		})

		builder.addCase(registration.pending, (state, action) => {
			state.isLoading = true
		})
		builder.addCase(registration.fulfilled, (state, action) => {
			console.log(action.payload)
			state.authUser = action.payload.user
			state.isAuth = true
			state.isLoading = false
		})
		builder.addCase(registration.rejected, (state, action) => {
			state.isLoading = false
		})

		builder.addCase(logout.pending, (state, action) => {
			state.isLoading = true
		})
		builder.addCase(logout.fulfilled, (state, action) => {
			state.isAuth = false
			state.authUser = {} as AuthUser
		})
		builder.addCase(logout.rejected, (state, action) => {
			state.isLoading = false
		})

		builder.addCase(getAllUsers.pending, (state, action) => {
			state.isLoading = true
		})
		builder.addCase(getAllUsers.fulfilled, (state, action) => {
			state.users = action.payload
		})
		builder.addCase(getAllUsers.rejected, (state, action) => {
			state.isLoading = false
		})
	},
})

export const {} = userSlice.actions
export default userSlice.reducer
