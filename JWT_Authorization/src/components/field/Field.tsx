import { Eye, EyeOff, Mail, UserRound } from 'lucide-react'
import { FC, useState } from 'react'
import styles from './Field.module.sass'
interface FieldProps {
	type: string
	field: any
}

const Field: FC<FieldProps> = ({ field, type }) => {
	const [isVisible, setVisible] = useState<boolean>(false)
	return (
		<div className={styles.field}>
			<input
				className={`${field.value.length !== 0 && styles.notEmptyInput}`}
				value={field.value}
				onChange={field.onChange}
				type={`${
					type === 'password' ? (isVisible ? 'text' : 'password') : 'text'
				}`}
			/>
			<span
				className={`${styles.placeholder} ${
					field.value.length !== 0 && styles.notEmptyPlaceholder
				}`}
			>
				{type}
			</span>
			<div className={styles.icon}>
				{type === 'password' ? (
					isVisible ? (
						<EyeOff onClick={() => setVisible(false)} />
					) : (
						<Eye onClick={() => setVisible(true)} />
					)
				) : type === 'email' ? (
					<Mail></Mail>
				) : (
					<UserRound></UserRound>
				)}
			</div>
			<span className={styles.error}>{field.error}</span>
		</div>
	)
}

export default Field
