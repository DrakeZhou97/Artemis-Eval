import { NextResponse } from "next/server";
import { deleteItem, getItemById, updateItem } from "@/lib/items";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
	const { id } = await params;
	const item = getItemById(Number(id));

	if (!item) {
		return NextResponse.json({ error: "Item not found" }, { status: 404 });
	}

	return NextResponse.json(item);
}

export async function PUT(request: Request, { params }: Params) {
	const { id } = await params;
	const body = await request.json();
	const item = updateItem(Number(id), body);

	if (!item) {
		return NextResponse.json({ error: "Item not found" }, { status: 404 });
	}

	return NextResponse.json(item);
}

export async function DELETE(_request: Request, { params }: Params) {
	const { id } = await params;
	const deleted = deleteItem(Number(id));

	if (!deleted) {
		return NextResponse.json({ error: "Item not found" }, { status: 404 });
	}

	return NextResponse.json({ message: `Item ${id} deleted` });
}
