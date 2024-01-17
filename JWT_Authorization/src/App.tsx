import { useEffect } from 'react'
import { useAppDispatch } from './hooks/storeHooks.ts'
import AppRouter from './router/AppRouter.tsx'
import { checkAuth } from './store/UserSlice.ts'

function App() {
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (localStorage.getItem('token')) {
			dispatch(checkAuth())
		}
	}, [])

	return <AppRouter></AppRouter>
}

export default App
