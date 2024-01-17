import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { Lock, RefreshCcw } from 'lucide-react'
import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '../../components/button/Button.tsx'
import Field from '../../components/field/Field.tsx'
import Loader from '../../components/loader/Loader.tsx'
import useInput from '../../hooks/UseInput.tsx'
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks'
import {
	getAllUsers,
	googleAuth,
	login,
	registration,
} from '../../store/UserSlice.ts'
import './Auth.sass'
const Auth: FC = () => {
	const [isActive, setActive] = useState<boolean>(false)

	const loginOrEmail = useInput('', 'loginOrEmail')

	const userName = useInput('', 'login')
	const email = useInput('', 'email')

	const password = useInput('', 'password')

	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const isAuth = useAppSelector(state => state.userReducer.isAuth)
	const isLoading = useAppSelector(state => state.userReducer.isLoading)
	useEffect(() => {
		if (isAuth) {
			navigate('/home')
		}
	}, [isAuth])

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
		type: string
	) => {
		e.preventDefault()

		if (
			loginOrEmail.error ||
			userName.error ||
			password.error ||
			email.error ||
			!loginOrEmail.value.length ||
			!userName.value.length ||
			!password.value.length ||
			!email.value.length
		) {
			return
		}

		if (type === 'login') {
			try {
				const response = await dispatch(
					login({ loginOrEmail: loginOrEmail.value, password: password.value })
				)
				if (response.payload) {
					navigate('/home')
				}
			} catch (e) {
				console.log(e)
			}
		}
		if (type === 'signUp') {
			try {
				const response = await dispatch(
					registration({
						login: userName.value,
						email: email.value,
						password: password.value,
					})
				)
				if (response.payload) {
					navigate('/home')
					dispatch(getAllUsers())
				}
			} catch (e) {
				console.log(e)
			}
		}
	}

	return (
		<div>
			{isLoading ? (
				<Loader />
			) : (
				<div className={isActive ? 'form active' : 'form'}>
					<div className='login'>
						<div className='controller' onClick={() => setActive(!isActive)}>
							SignUp
							<RefreshCcw strokeWidth={3} />
						</div>
						<div className='recover' onClick={() => navigate('/recover')}>
							Recover
							<Lock strokeWidth={3} />
						</div>
						<form onSubmit={e => handleSubmit(e, 'login')}>
							<h5>Login</h5>
							<Field field={loginOrEmail} type='loginOrEmail'></Field>
							<Field field={password} type='password'></Field>
							<Button width={160}>Login</Button>

							<div className='socialMedia'>
								<GoogleLogin
									type='icon'
									shape='circle'
									onSuccess={CredentialResponse => {
										const CredentialResponseDecoded = jwtDecode(
											CredentialResponse.credential as string
										)
										const user = {
											login: CredentialResponseDecoded.name,
											email: CredentialResponseDecoded.email,
											password: '1',
										}
										dispatch(googleAuth(user))
									}}
									onError={() => {
										console.log('Failed')
									}}
								/>
							</div>
						</form>
					</div>
					<div className='signUp'>
						<div className='controller' onClick={() => setActive(!isActive)}>
							Login
							<RefreshCcw strokeWidth={3} />
						</div>

						<form onSubmit={e => handleSubmit(e, 'signUp')}>
							<h5>SignUp</h5>
							<Field field={userName} type='login'></Field>
							<Field field={email} type='email'></Field>
							<Field field={password} type='password'></Field>
							<Button width={160}>SignUp</Button>
							<div className='socialMedia'>
								<GoogleLogin
									type='icon'
									shape='circle'
									onSuccess={CredentialResponse => {
										const CredentialResponseDecoded = jwtDecode(
											CredentialResponse.credential as string
										)
										const user = {
											login: CredentialResponseDecoded.name,
											email: CredentialResponseDecoded.email,
											password: '1',
										}
										dispatch(googleAuth(user))
									}}
									onError={() => {
										console.log('Failed')
									}}
								/>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	)
}

export default Auth
