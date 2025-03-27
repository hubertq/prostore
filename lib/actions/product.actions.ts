'use server'

import { convertToPlainObject } from '../utils'
import { LATEST_PRODUCTS_LIMIT } from '../constants'
import { prisma } from '@/db/prisma'

// Get latest products
export const getLatestProducts = async () => {
	const data = await prisma.product.findMany({
		take: LATEST_PRODUCTS_LIMIT,
		orderBy: { createdAt: 'desc' },
	})

	return convertToPlainObject(data)
}

// Get single product by it's slug
export const getProductBySlug = async (slug: string) => {
	return await prisma.product.findFirst({
		where: { slug },
	})
}
