import { FC } from 'react'
import './Button.module.sass'
interface Button {
	children: React.ReactNode | React.ReactChild
	onClick?: () => void
	className?: string
	width: number
}

const Button: FC<Button> = ({ children, onClick, className, width }) => {
	return (
		<button
			onClick={onClick}
			className={`${className}`}
			style={{ width: width }}
		>
			{children}
		</button>
	)
}

export default Button
