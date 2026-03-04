import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getItemById } from "@/lib/items";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { id } = await params;
	const item = getItemById(Number(id));

	return {
		title: item ? item.name : "Item Not Found",
		description: item ? `Details for ${item.name}` : "The requested item does not exist",
	};
}

export default async function ItemDetailPage({ params }: Params) {
	const { id } = await params;
	const item = getItemById(Number(id));

	if (!item) {
		notFound();
	}

	return (
		<main className="min-h-screen bg-base-200 p-8">
			<div className="mx-auto max-w-3xl space-y-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-base-content">{item.name}</h1>
					<p className="mt-2 text-base-content/70">Item details</p>
				</div>

				<div className="card bg-base-100 shadow-xl">
					<div className="card-body">
						<div className="space-y-4">
							<div className="flex items-center justify-between border-b border-base-300 pb-2">
								<span className="font-medium text-base-content/70">ID</span>
								<span>{item.id}</span>
							</div>
							<div className="flex items-center justify-between border-b border-base-300 pb-2">
								<span className="font-medium text-base-content/70">Name</span>
								<span>{item.name}</span>
							</div>
							<div className="flex items-center justify-between border-b border-base-300 pb-2">
								<span className="font-medium text-base-content/70">Description</span>
								<span>{item.description}</span>
							</div>
							<div className="flex items-center justify-between border-b border-base-300 pb-2">
								<span className="font-medium text-base-content/70">Category</span>
								<span className="badge badge-outline">{item.category}</span>
							</div>
							<div className="flex items-center justify-between border-b border-base-300 pb-2">
								<span className="font-medium text-base-content/70">Price</span>
								<span>${item.price.toFixed(2)}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="font-medium text-base-content/70">Stock Status</span>
								{item.inStock ? (
									<span className="badge badge-success">In Stock</span>
								) : (
									<span className="badge badge-error">Out of Stock</span>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="flex justify-center gap-4">
					<a href="/items" className="btn btn-ghost">
						Back to Items
					</a>
					<a href="/" className="btn btn-ghost">
						Back to Home
					</a>
				</div>
			</div>
		</main>
	);
}
