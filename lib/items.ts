export interface Item {
	id: number;
	name: string;
	description: string;
	price: number;
	category: string;
	inStock: boolean;
}

const items: Item[] = [
	{
		id: 1,
		name: "Wireless Mouse",
		description: "Ergonomic wireless mouse with adjustable DPI",
		price: 29.99,
		category: "Electronics",
		inStock: true,
	},
	{
		id: 2,
		name: "Mechanical Keyboard",
		description: "RGB mechanical keyboard with Cherry MX switches",
		price: 89.99,
		category: "Electronics",
		inStock: true,
	},
	{
		id: 3,
		name: "USB-C Hub",
		description: "7-in-1 USB-C hub with HDMI and ethernet",
		price: 49.99,
		category: "Accessories",
		inStock: false,
	},
	{
		id: 4,
		name: "Monitor Stand",
		description: "Adjustable aluminum monitor stand with storage",
		price: 39.99,
		category: "Furniture",
		inStock: true,
	},
	{
		id: 5,
		name: "Desk Lamp",
		description: "LED desk lamp with touch dimmer and USB charging port",
		price: 34.99,
		category: "Furniture",
		inStock: true,
	},
];

let nextId = 6;

export function getItems(): Item[] {
	return items;
}

export function getItemById(id: number): Item | undefined {
	return items.find((i) => i.id === id);
}

export function createItem(data: Omit<Item, "id">): Item {
	const item: Item = { id: nextId++, ...data };
	items.push(item);
	return item;
}

export function updateItem(id: number, data: Partial<Omit<Item, "id">>): Item | undefined {
	const item = items.find((i) => i.id === id);
	if (!item) return undefined;
	Object.assign(item, data);
	return item;
}

export function deleteItem(id: number): boolean {
	const index = items.findIndex((i) => i.id === id);
	if (index === -1) return false;
	items.splice(index, 1);
	return true;
}
