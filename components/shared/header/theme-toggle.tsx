'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Props = {
	variant?:
		| 'default'
		| 'destructive'
		| 'ghost'
		| 'link'
		| 'outline'
		| 'secondary'
}

export function ThemeToggle({ variant = 'default' }: Props) {
	const { setTheme, theme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={variant} className='cursor-pointer'>
					<Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
					<Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
					<span className='sr-only'>Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuCheckboxItem
					checked={theme === 'light'}
					onClick={() => setTheme('light')}
				>
					Light
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={theme === 'dark'}
					onClick={() => setTheme('dark')}
				>
					Dark
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={theme === 'system'}
					onClick={() => setTheme('system')}
				>
					System
				</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
