import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '../../components/button/Button'
import Field from '../../components/field/Field'
import useInput from '../../hooks/UseInput'
import AuthService from '../../services/AuthService'
import styles from './Recover.module.sass'
const Recover: FC = () => {
	const recoverEmail = useInput('asadrahmonberdiev@gmail.com', 'email')
	const recoverCode = useInput('', 'recoverCode')
	const newPassword = useInput('', 'password')

	const [step, setStep] = useState<number>(0)

	const navigate = useNavigate()

	const sendCodeToEmail = async () => {
		if (!recoverEmail.value.length || recoverEmail.error) {
			return
		}
		const response = await AuthService.sendRecoverMail(recoverEmail.value)
		if (response.status === 200 || response.status === 204) {
			setStep(1)
		}
	}

	const sendNewPassword = async () => {
		if (!newPassword.value.length || newPassword.error) {
			return
		}
		const response = await AuthService.setNewPassword(
			newPassword.value,
			recoverCode.value,
			recoverEmail.value
		)
		if (response.status === 200 || response.status === 204) {
			setStep(2)
		}
	}

	useEffect(() => {
		step === 2 && navigate('/')
	}, [step])

	return (
		<div className={styles.recover}>
			{step === 0 && (
				<>
					<Field field={recoverEmail} type='email'></Field>
					<Button onClick={() => sendCodeToEmail()} width={220}>
						Send email
					</Button>
				</>
			)}

			{step === 1 && (
				<>
					<Field field={recoverCode} type='recoverCode'></Field>
					<Field field={newPassword} type='password'></Field>
					<Button onClick={() => sendNewPassword()} width={220}>
						setNewPassword
					</Button>
				</>
			)}
		</div>
	)
}

export default Recover
