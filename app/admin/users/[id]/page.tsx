import { getUserById } from '@/lib/actions/user.actions'
import { requiredAdmin } from '@/lib/auth-guard'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import UpdateUserForm from './update-user-form'

export const metadata: Metadata = {
	title: 'Edit User',
}

type Props = {
	params: Promise<{ id: string }>
}
const EditUserPage = async ({ params }: Props) => {
	await requiredAdmin()

	const { id } = await params

	const user = await getUserById(id)

	if (!user) notFound()

	return (
		<div className='space-y-8 max-w-lg mx-auto'>
			<h1 className='h2-bold'>Edit User</h1>
			<UpdateUserForm user={user} />
		</div>
	)
}
export default EditUserPage
