'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '../ui/alert-dialog'

type Props = {
	id: string
	action: (id: string) => Promise<{ success: boolean; message: string }>
}
const DeleteDialog = ({ id, action }: Props) => {
	const [open, setOpen] = useState(false)
	const [isPending, startTransition] = useTransition()

	const handleDelete = async () => {
		startTransition(async () => {
			const res = await action(id)

			if (!res.success) {
				toast.error('Operation failed', { description: res.message })
			} else {
				setOpen(false)
				toast.success('Operation success', { description: res.message })
			}
		})
	}

	return (
		<AlertDialog
			open={open}
			onOpenChange={setOpen}
		>
			<AlertDialogTrigger asChild>
				<Button
					size={'sm'}
					variant={'destructive'}
				>
					Delete
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>This action can't be undone</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button
						variant={'destructive'}
						size={'sm'}
						disabled={isPending}
						onClick={handleDelete}
					>
						{isPending ? 'Deleting...' : 'Delete'}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
export default DeleteDialog
