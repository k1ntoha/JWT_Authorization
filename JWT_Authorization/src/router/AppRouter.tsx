import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from '../pages/auth/Auth.tsx'
import Home from '../pages/home/Home.tsx'
import Recover from '../pages/recover/Recover.tsx'
const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Auth />} path='/' />
				<Route element={<Home />} path='/home' />
				<Route element={<Recover />} path='/recover' />
				<Route element={<div>404 Not Found</div>} path='*' />
			</Routes>
		</BrowserRouter>
	)
}

export default AppRouter
