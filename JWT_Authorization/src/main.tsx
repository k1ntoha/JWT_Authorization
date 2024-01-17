import { GoogleOAuthProvider } from '@react-oauth/google'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.js'
import { setupStore } from './store/store.js'
import './styles/index.sass'

const store = setupStore()

ReactDOM.createRoot(document.getElementById('root')!).render(
	<Provider store={store}>
		<GoogleOAuthProvider clientId='590877704451-vp5ic9me86rag4c9nrn7vlsgvh1oi86r.apps.googleusercontent.com'>
			<App />
		</GoogleOAuthProvider>
	</Provider>
)
