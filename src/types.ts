export enum CATEGORY {
    CAMISETAS = "Camisetas",
    BERMUDAS = "Bermudas",
    CASACOS = "Casacos"
}

export type TUser = {
    id: string
    name: string
    email: string
    password: string
    created_at: string
}

export type TProduct = {
    id: string
    name: string
    price: number
    description: string
    imageUrl: string
}

export type TPurchase = {
    id: string
    totalPrice: number
    paid: number
    deliveredAt: string
    buyerId: string
}
