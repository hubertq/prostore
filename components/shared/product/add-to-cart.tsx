'use client'

import { Button } from '@/components/ui/button'
import { addItemToCart } from '@/lib/actions/cart.actions'
import { CartItem } from '@/types'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type Props = {
	item: CartItem
}
const AddToCart = ({ item }: Props) => {
	const router = useRouter()
	const handleAddToCart = async () => {
		const res = await addItemToCart(item)

		if (!res.success) {
			toast.error('Failed to update cart', {
				description: res.message,
			})
			return
		}

		// Handle success add to cart
		toast.success('Cart updated', {
			description: `${item.name} added to cart`,
			action: {
				label: 'Go To Cart',
				onClick: () => router.push('/cart'),
			},
		})
	}
	return (
		<Button
			className='w-full'
			type='button'
			onClick={handleAddToCart}
		>
			<Plus /> Add To Cart
		</Button>
	)
}
export default AddToCart
