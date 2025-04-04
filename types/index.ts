import {
	insertProductSchema,
	insertCartSchema,
	cartItemSchema,
	shippingAddressSchema,
	insertorderItemSchema,
	insertOrderSchema,
	paymentResultSchema,
	updateProfileSchema,
} from '@/lib/validators'
import { string, z } from 'zod'

export type Product = z.infer<typeof insertProductSchema> & {
	id: string
	rating: string
	createdAt: Date
}

export type Cart = z.infer<typeof insertCartSchema>
export type CartItem = z.infer<typeof cartItemSchema>
export type ShippingAddress = z.infer<typeof shippingAddressSchema>
export type OrderItem = z.infer<typeof insertorderItemSchema>
export type Order = z.infer<typeof insertOrderSchema> & {
	id: string
	createdAt: Date
	isPaid: Boolean
	paidAt: Date | null
	isDelivered: Boolean
	deliveredAt: Date | null
	orderitems: OrderItem[]
	user: { name: string; email: string }
}

export type PaymentResult = z.infer<typeof paymentResultSchema>
export type Profile = z.infer<typeof updateProfileSchema>
