export enum CATEGORY {
    CAMISETAS = "Camisetas",
    BERMUDAS = "Bermudas",
    CASACOS = "Casacos"
}

export type TUser = {
    id: string
    email: string
    password: string
}

export type TProduct = {
    id: string
    name: string
    price: number
    category: CATEGORY
}

export type TPurchase = {
    purchaseId: string
    userId: string
    products: {}[]
    totalPrice: number
}
export type TPurchaseProduct = {
    id: string
    name: string | undefined
    price: number | any
    quantity: number
}
export type TProductsToPurchase = {
    productId: string
    quantity: number
}