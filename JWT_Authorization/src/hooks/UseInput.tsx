import { useEffect, useState } from 'react'

const useValidate = (value: string, validation: string) => {
	const [error, setError] = useState('')

	useEffect(() => {
		if (value && validation) {
			if (!/[a-zа-яё]/i.test(value)) {
				setError('Enter at least 1 letter')
				return
			} else {
				setError('')
			}
		} else {
			setError('')
			return
		}

		if (validation === 'email') {
			value.includes('@')
				? setError('')
				: setError('Enter correct email with @')
		}

		if (validation === 'password') {
			if (/^[^A-ZА-ЯЁ]*$/.test(value)) {
				setError('Enter at Capital letter')
				return
			}

			if (!value.includes('$')) {
				setError('$ character needed')
				return
			}

			value.length > 16 || value.length < 10
				? setError('Enter 8-16 characters')
				: setError('')
		}
	}, [value, validation])

	return error
}

const useInput = (initialState: string, validation: string) => {
	const [value, setValue] = useState(initialState)
	const error = useValidate(value, validation)

	const onChange = (e: React.FormEvent<HTMLInputElement>) => {
		setValue(e.currentTarget.value)
	}

	return { value, onChange, error }
}

export default useInput
