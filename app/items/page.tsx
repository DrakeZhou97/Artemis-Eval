import type { Metadata } from "next";
import { getItems } from "@/lib/items";

export const metadata: Metadata = {
	title: "Items",
	description: "Browse all available items",
};

export default function ItemsPage() {
	const items = getItems();

	return (
		<main className="min-h-screen bg-base-200 p-8">
			<div className="mx-auto max-w-3xl space-y-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-base-content">Items</h1>
					<p className="mt-2 text-base-content/70">Browse all available items.</p>
				</div>

				<div className="card bg-base-100 shadow-xl">
					<div className="card-body">
						<div className="overflow-x-auto">
							<table className="table">
								<thead>
									<tr>
										<th>Name</th>
										<th>Category</th>
										<th>Price</th>
										<th>Stock</th>
									</tr>
								</thead>
								<tbody>
									{items.map((item) => (
										<tr key={item.id} className="hover:bg-base-200">
											<td>
												<a href={`/items/${item.id}`} className="link link-primary">
													{item.name}
												</a>
											</td>
											<td>
												<span className="badge badge-outline">{item.category}</span>
											</td>
											<td>${item.price.toFixed(2)}</td>
											<td>
												{item.inStock ? (
													<span className="badge badge-success">In Stock</span>
												) : (
													<span className="badge badge-error">Out of Stock</span>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<div className="flex justify-center">
					<a href="/" className="btn btn-ghost">
						Back to Home
					</a>
				</div>
			</div>
		</main>
	);
}
