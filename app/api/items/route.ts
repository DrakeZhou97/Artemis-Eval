import { type NextRequest, NextResponse } from "next/server";
import { createItem, getItems } from "@/lib/items";

export function GET() {
	return NextResponse.json(getItems());
}

export async function POST(request: NextRequest) {
	const body = await request.json();
	const { name, description, price, category, inStock } = body;

	if (!name || !description || !price || !category) {
		return NextResponse.json(
			{ error: "Missing required fields: name, description, price, category" },
			{ status: 400 },
		);
	}

	const item = createItem({ name, description, price, category, inStock: inStock ?? true });
	return NextResponse.json(item, { status: 201 });
}
