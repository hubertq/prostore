'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '../ui/button'

type Props = {
	page: number | string
	totalPages: number
	urlParamName?: string
}

const Pagination = ({ page, totalPages }: Props) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()

	const handlePagination = (btnType: 'next' | 'prev') => {
		const currPage = btnType === 'next' ? Number(page) + 1 : Number(page) - 1

		const params = new URLSearchParams(searchParams)
		params.set('page', currPage.toString())
		router.replace(`${pathname}?${params.toString()}`)
	}
	return (
		<div className='flex gap-2'>
			<Button
				size={'lg'}
				variant={'outline'}
				className='w-28'
				disabled={Number(page) <= 1}
				onClick={() => handlePagination('prev')}
			>
				Previous
			</Button>
			<Button
				size={'lg'}
				variant={'outline'}
				className='w-28'
				disabled={Number(page) >= totalPages}
				onClick={() => handlePagination('next')}
			>
				Next
			</Button>
		</div>
	)
}
export default Pagination
