'use client'

import { Button } from '@/components/ui/button'
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions'
import { Cart, CartItem } from '@/types'
import { Plus, Minus, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

type Props = {
	cart?: Cart
	item: CartItem
}
const AddToCart = ({ cart, item }: Props) => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleAddToCart = async () => {
		startTransition(async () => {
			const res = await addItemToCart(item)

			if (!res.success) {
				toast.error('Failed to update cart', {
					description: res.message,
				})
				return
			}

			// Handle success add to cart
			toast.success('Cart updated', {
				description: res.message,
				action: {
					label: 'Go To Cart',
					onClick: () => router.push('/cart'),
				},
			})
		})
	}

	const handleRemoveFromCart = async () => {
		startTransition(async () => {
			const res = await removeItemFromCart(item.productId)
			if (res.success) {
				toast.success('Cart updated', {
					description: res.message,
					action: {
						label: 'Go To Cart',
						onClick: () => router.push('/cart'),
					},
				})
				return
			} else {
				toast.error('Failed to update cart', {
					description: res.message,
				})
			}
		})
	}

	// Check if item is in cart
	const existItem = cart && cart.items.find(x => x.productId === item.productId)

	return existItem ? (
		<div>
			<Button
				type='button'
				variant={'outline'}
				onClick={handleRemoveFromCart}
			>
				{isPending ? <Loader className='w-4 h-4 animate-spin' /> : <Minus className='h-4 w-4' />}
			</Button>
			<span className='px-2'>{existItem.qty}</span>
			<Button
				type='button'
				variant={'outline'}
				onClick={handleAddToCart}
			>
				{isPending ? <Loader className='w-4 h-4 animate-spin' /> : <Plus className='h-4 w-4' />}
			</Button>
		</div>
	) : (
		<Button
			className='w-full'
			type='button'
			onClick={handleAddToCart}
		>
			{isPending ? <Loader className='w-4 h-4 animate-spin' /> : <Plus className='h-4 w-4' />} Add To Cart
		</Button>
	)
}
export default AddToCart
