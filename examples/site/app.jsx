import { mount } from '../../index.js';
import { useState, useLayoutEffect } from '../../hooks.js';
import { Btn } from '../../ui/btn.js';
import { Field } from '../../ui/field.js';
import { Stack } from '../../ui/stack.js';
import { Text } from '../../ui/text.js';

const PAGES = [
	{ path: '/', label: 'Home' },
	{ path: '/about', label: 'About' },
	{ path: '/work', label: 'Work' },
	{ path: '/contact', label: 'Contact' }
];

function pathFromHash() {
	const raw = (typeof location !== 'undefined' && location.hash.slice(1)) || '/';
	return raw.startsWith('/') ? raw : '/' + raw;
}

function useRoute() {
	const [path, setPath] = useState(pathFromHash);
	useLayoutEffect(() => {
		const onHash = () => setPath(pathFromHash());
		window.addEventListener('hashchange', onHash);
		return () => window.removeEventListener('hashchange', onHash);
	}, []);
	return path;
}

function Nav({ path }) {
	return (
		<nav class="site-nav" aria-label="Primary">
			<Stack row gap="1rem" class="site-nav__row">
				<a href="#/" class="site-brand">
					Northline
				</a>
				{PAGES.map(p => (
					<a
						key={p.path}
						href={'#' + p.path}
						class={path === p.path ? 'is-active' : undefined}
						aria-current={path === p.path ? 'page' : undefined}
					>
						{p.label}
					</a>
				))}
			</Stack>
		</nav>
	);
}

function Home() {
	return (
		<Stack gap={16} class="site-page">
			<Text as="h1" tone="title">
				Quiet tools for busy teams
			</Text>
			<Text>
				Northline is a sample multi-page site built with Strike JSX. Hash
				routes swap pages without a full reload.
			</Text>
			<Stack row gap={8}>
				<Btn onClick={() => (location.hash = '#/work')}>See work</Btn>
				<Btn variant="ghost" onClick={() => (location.hash = '#/contact')}>
					Contact
				</Btn>
			</Stack>
		</Stack>
	);
}

function About() {
	return (
		<Stack gap={16} class="site-page">
			<Text as="h1" tone="title">
				About
			</Text>
			<Text>
				We keep the stack small: one VDOM, function components, and JSX that
				compiles to the same vnode tree as hand-written elements.
			</Text>
			<Text tone="muted">
				This About view is a separate page in the same SPA shell.
			</Text>
		</Stack>
	);
}

function Work() {
	const items = [
		{ title: 'Harbor desk', blurb: 'Ops dashboard for a coastal logistics team.' },
		{ title: 'Ledger light', blurb: 'Invoice list with filters and offline drafts.' },
		{ title: 'Studio board', blurb: 'Project board for a three-person studio.' }
	];
	return (
		<Stack gap={16} class="site-page">
			<Text as="h1" tone="title">
				Work
			</Text>
			<ul class="site-work">
				{items.map(item => (
					<li key={item.title}>
						<Text as="strong">{item.title}</Text>
						<Text tone="muted">{item.blurb}</Text>
					</li>
				))}
			</ul>
		</Stack>
	);
}

function Contact() {
	const [name, setName] = useState('');
	const [note, setNote] = useState('');
	const [sent, setSent] = useState(false);

	function submit(e) {
		e.preventDefault();
		if (!name.trim()) return;
		setSent(true);
	}

	return (
		<Stack gap={16} class="site-page">
			<Text as="h1" tone="title">
				Contact
			</Text>
			{sent ? (
				<Text>Thanks, {name}. We will reply soon.</Text>
			) : (
				<form class="site-contact" onSubmit={submit}>
					<Stack gap={12}>
						<Field
							label="Name"
							value={name}
							onInput={e => setName(e.target.value)}
						/>
						<Field
							label="Note"
							value={note}
							onInput={e => setNote(e.target.value)}
							placeholder="What should we know?"
						/>
						<Btn type="submit">Send</Btn>
					</Stack>
				</form>
			)}
		</Stack>
	);
}

function Page({ path }) {
	if (path === '/about') return <About />;
	if (path === '/work') return <Work />;
	if (path === '/contact') return <Contact />;
	return <Home />;
}

export function Site() {
	const path = useRoute();
	return (
		<div class="site">
			<Nav path={path} />
			<main class="site-main">
				<Page path={path} />
			</main>
			<footer class="site-foot">
				<Text tone="muted" as="span">
					Northline sample · Strike JSX
				</Text>
			</footer>
		</div>
	);
}

if (typeof document !== 'undefined' && document.getElementById('app')) {
	if (!location.hash) location.hash = '#/';
	mount('#app', Site);
}
