import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router'
import Button from '../../components/button/Button'
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks'
import { getAllUsers, logout } from '../../store/UserSlice'
import './Home.sass'

const Home: FC = () => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const isAuth = useAppSelector(state => state.userReducer.isAuth)
	const authUser = useAppSelector(state => state.userReducer.authUser)
	const users = useAppSelector(state => state.userReducer.users)

	useEffect(() => {
		if (!isAuth) {
			navigate('/')
		}

		dispatch(getAllUsers())
	}, [isAuth])

	const exit = async () => {
		try {
			const response = await dispatch(logout())
			console.log(response)
			if (response.meta.requestStatus === 'fulfilled') {
				navigate('/')
			}
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<div>
			{isAuth ? (
				<div>
					<h1>Hello {authUser.login} !</h1>
					<Button onClick={exit} width={260}>
						Exit from Account
					</Button>
				</div>
			) : (
				<Button onClick={() => navigate('/')} width={260}>
					Authorization
				</Button>
			)}
			<div className='users'>
				User List:
				{users.map(user => (
					<div key={user.id} className='item'>
						{user.login}
					</div>
				))}
			</div>
		</div>
	)
}

export default Home
