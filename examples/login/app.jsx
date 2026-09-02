import { mount } from '../../index.js';
import { useState } from '../../hooks.js';
import { Btn } from '../../ui/btn.js';
import { Field } from '../../ui/field.js';
import { Text } from '../../ui/text.js';

export function Login({ onSubmit, pending, error }) {
	const [email, setEmail] = useState('');
	const [pw, setPw] = useState('');

	return (
		<form
			class="strike-stack login"
			style={{ gap: 12 }}
			onSubmit={e => {
				e.preventDefault();
				onSubmit({ email, pw });
			}}
		>
			<Text as="h1" tone="title">
				Sign in
			</Text>
			<Field
				label="Email"
				value={email}
				onInput={e => setEmail(e.target.value)}
			/>
			<Field
				label="Password"
				type="password"
				value={pw}
				onInput={e => setPw(e.target.value)}
			/>
			{error && (
				<Text tone="danger" class="strike-err">
					{error}
				</Text>
			)}
			<Btn type="submit" state={pending ? 'busy' : 'rest'} disabled={pending}>
				Sign in
			</Btn>
		</form>
	);
}

function App() {
	const [pending, setPending] = useState(false);
	const [error, setError] = useState('');

	return (
		<Login
			pending={pending}
			error={error}
			onSubmit={({ email, pw }) => {
				setError('');
				setPending(true);
				setTimeout(() => {
					setPending(false);
					if (!email || !pw) setError('Email and password required');
					else setError('');
				}, 400);
			}}
		/>
	);
}

if (typeof document !== 'undefined' && document.getElementById('app')) {
	mount('#app', App);
}
