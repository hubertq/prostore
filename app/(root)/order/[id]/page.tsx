import { getOrderById } from '@/lib/actions/order.actions'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import OrderDetailsTable from './order-details-table'
import { ShippingAddress } from '@/types'

export const metadata: Metadata = {
	title: 'Order Details',
}

type Props = {
	params: Promise<{ id: string }>
}
const OrderPage = async ({ params }: Props) => {
	const { id } = await params

	const order = await getOrderById(id)

	if (!order) notFound()

	return (
		<OrderDetailsTable
			order={{
				...order,
				shippingAddress: order.shippingAddress as ShippingAddress,
			}}
			paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
		/>
	)
}
export default OrderPage
