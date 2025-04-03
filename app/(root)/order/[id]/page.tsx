import { getOrderById } from '@/lib/actions/order.actions'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

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

	return <>Details</>
}
export default OrderPage
