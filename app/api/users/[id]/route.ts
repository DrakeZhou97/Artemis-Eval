import { NextResponse } from "next/server";
import { deleteUser, getUserById, updateUser } from "@/lib/users";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
	const { id } = await params;
	const user = getUserById(Number(id));

	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	return NextResponse.json(user);
}

export async function PUT(request: Request, { params }: Params) {
	const { id } = await params;
	const body = await request.json();
	const user = updateUser(Number(id), body);

	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	return NextResponse.json(user);
}

export async function DELETE(_request: Request, { params }: Params) {
	const { id } = await params;
	const deleted = deleteUser(Number(id));

	if (!deleted) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	return NextResponse.json({ message: `User ${id} deleted` });
}
