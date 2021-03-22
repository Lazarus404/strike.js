import { h, mount } from '../../index.js';
import { useState } from '../../hooks.js';
import { Btn } from '../../ui/btn.js';
import { Field } from '../../ui/field.js';
import { Stack } from '../../ui/stack.js';

let nextId = 1;

export function Todo() {
	const [text, setText] = useState('');
	const [items, setItems] = useState([]);
	const [filter, setFilter] = useState('all');

	const visible = items.filter(item => {
		if (filter === 'open') return !item.done;
		if (filter === 'done') return item.done;
		return true;
	});

	function add(e) {
		e.preventDefault();
		const value = text.trim();
		if (!value) return;
		setItems(list => [...list, { id: nextId++, text: value, done: false }]);
		setText('');
	}

	return (
		<Stack class="todo">
			<h1>Strike Todo</h1>
			<form class="todo-add" onSubmit={add}>
				<Stack row gap="0.5rem">
					<Field
						label="New item"
						value={text}
						onInput={e => setText(e.target.value)}
						placeholder="What needs doing?"
					/>
					<Btn variant="primary" type="submit">
						Add
					</Btn>
				</Stack>
			</form>
			<Stack row gap="0.5rem" class="todo-filters">
				{['all', 'open', 'done'].map(f => (
					<Btn
						key={f}
						variant={filter === f ? 'primary' : 'ghost'}
						onClick={() => setFilter(f)}
					>
						{f}
					</Btn>
				))}
			</Stack>
			<ul class="todo-list">
				{visible.map(item => (
					<li key={item.id} class={item.done ? 'done' : ''}>
						<Stack row gap="0.5rem">
							<input
								type="checkbox"
								checked={item.done}
								onChange={() =>
									setItems(list =>
										list.map(x =>
											x.id === item.id ? { ...x, done: !x.done } : x
										)
									)
								}
							/>
							<span>{item.text}</span>
							<Btn
								variant="ghost"
								onClick={() =>
									setItems(list => list.filter(x => x.id !== item.id))
								}
							>
								Remove
							</Btn>
						</Stack>
					</li>
				))}
			</ul>
		</Stack>
	);
}

if (typeof document !== 'undefined' && document.getElementById('app')) {
	mount('#app', Todo);
}
