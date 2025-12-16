export const routes = {
    admin: {
        pages: (q?: { status?: "draft" | "published" }) =>
            q?.status ? `/admin/pages?status=${q.status}` : "/admin/pages",
        products: (q?: { status?: "draft" | "active" | "archived" }) =>
            q?.status ? `/admin/products?status=${q.status}` : "/admin/products",
    },
} as const;
