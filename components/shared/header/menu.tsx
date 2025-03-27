import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import Link from 'next/link'
import {
	EllipsisVertical,
	ShoppingCart,
	UserIcon,
} from 'lucide-react'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'

function Menu() {
	return (
		<div className='flex justify-end gap-3'>
			<nav className='hidden md:flex w-full max-w-xs gap-1'>
				<ThemeToggle variant='ghost' />
				<Button asChild variant={'ghost'}>
					<Link href={'/cart'}>
						<ShoppingCart />
					</Link>
				</Button>
				<Button asChild>
					<Link href={'/sign-in'}>
						Sign In
						{/* <UserIcon /> */}
					</Link>
				</Button>
			</nav>

			<nav className='md:hidden'>
				<Sheet>
					<SheetTrigger className='align-middle'>
						<EllipsisVertical />
					</SheetTrigger>

					<SheetContent>
						<SheetHeader>
							<SheetTitle>Menu</SheetTitle>
							<SheetDescription></SheetDescription>
						</SheetHeader>

						<div className='px-4'>
							<div className='flex flex-col gap-3'>
								<ThemeToggle variant='outline' />
								<Button asChild variant={'outline'}>
									<Link href={'/cart'}>
										<ShoppingCart /> Cart
									</Link>
								</Button>
								<Button asChild>
									<Link href={'/sign-in'}>
										<UserIcon /> Sign in
									</Link>
								</Button>
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</nav>
		</div>
	)
}
export default Menu
