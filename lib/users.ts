export interface User {
	id: number;
	name: string;
	email: string;
	role: string;
}

const users: User[] = [
	{ id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
	{ id: 2, name: "Bob Smith", email: "bob@example.com", role: "Editor" },
	{ id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Viewer" },
	{ id: 4, name: "Diana Prince", email: "diana@example.com", role: "Editor" },
	{ id: 5, name: "Eve Davis", email: "eve@example.com", role: "Viewer" },
];

let nextId = 6;

export function getUsers(): User[] {
	return users;
}

export function getUserById(id: number): User | undefined {
	return users.find((u) => u.id === id);
}

export function createUser(data: Omit<User, "id">): User {
	const user: User = { id: nextId++, ...data };
	users.push(user);
	return user;
}

export function updateUser(id: number, data: Partial<Omit<User, "id">>): User | undefined {
	const user = users.find((u) => u.id === id);
	if (!user) return undefined;
	Object.assign(user, data);
	return user;
}

export function deleteUser(id: number): boolean {
	const index = users.findIndex((u) => u.id === id);
	if (index === -1) return false;
	users.splice(index, 1);
	return true;
}
