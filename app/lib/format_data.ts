

export async function getProducts() {
    const res = await fetchProducts();
    const formatted = res.map((p) => ({
        id: p.id,
        productName: p.name || "?"
    }))

    return formatted
}

export async function getCustomers() {
    const res = await fetchCustomers();
    const formatted = res.map((c) => ({
        id: c.id,
        name: c.name || "?"
    }))
    return formatted
}