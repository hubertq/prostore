import { getUserById } from '@/lib/actions/user.actions'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
	title: 'Edit User',
}

type Props = {
	params: Promise<{ id: string }>
}
const EditUserPage = async ({ params }: Props) => {
	const { id } = await params
	const user = await getUserById(id)

	if (!user) return notFound()

	return <div>EditUserPage</div>
}
export default EditUserPage
