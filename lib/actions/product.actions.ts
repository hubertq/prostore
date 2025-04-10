'use server'

import { convertToPlainObject, formatError } from '../utils'
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants'
import { prisma } from '@/db/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { insertProductSchema, updateProductSchema } from '../validators'
import { deleteImages } from './image.actions'
import { Prisma } from '@prisma/client'

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

// Get single product by it's ID
export const getProductById = async (productId: string) => {
	const data = await prisma.product.findFirst({
		where: { id: productId },
	})

	return convertToPlainObject(data)
}

// Get all products
export const getAllProducts = async ({
	query,
	limit = PAGE_SIZE,
	page,
	category,
	price,
	rating,
	sort,
}: {
	query: string
	limit?: number
	page: number
	category?: string
	price?: string
	rating?: string
	sort?: string
}) => {
	// Query filter
	const queryFilter: Prisma.ProductWhereInput =
		query && query !== 'all'
			? {
					name: {
						contains: query,
						mode: 'insensitive',
					} as Prisma.StringFilter,
			  }
			: {}

	// Category filter
	const categoryFilter = category && category !== 'all' ? { category } : {}

	// Price filter
	const priceFilter: Prisma.ProductWhereInput =
		price && price !== 'all'
			? {
					price: {
						gte: Number(price.split('-')[0]),
						lte: Number(price.split('-')[1]),
					},
			  }
			: {}

	// Rating filter
	const ratingFilter =
		rating && rating !== 'all'
			? {
					rating: {
						gte: Number(rating),
					},
			  }
			: {}

	const data = await prisma.product.findMany({
		where: {
			...queryFilter,
			...categoryFilter,
			...priceFilter,
			...ratingFilter,
		},
		orderBy:
			sort === 'lowest' ? { price: 'asc' } : sort === 'highest' ? { price: 'desc' } : sort === 'rating' ? { rating: 'desc' } : { createdAt: 'desc' },
		skip: (page - 1) * limit,
		take: limit,
	})

	const dataCount = await prisma.product.count()

	return {
		data,
		totalPages: Math.ceil(dataCount / limit),
	}
}

// Delete product
export const deleteProduct = async (id: string) => {
	try {
		const productExists = await prisma.product.findFirst({
			where: { id },
		})

		if (!productExists) throw new Error('Product not found')
		const imagesToBeDeleted = [...productExists.images]

		if (productExists.isFeatured && productExists.banner) {
			imagesToBeDeleted.push(productExists.banner)
		}
		const imageKeys = imagesToBeDeleted.map(image => image.split('/').pop())

		await deleteImages(imageKeys as string[])

		await prisma.product.delete({ where: { id } })

		revalidatePath('/admin/products')
		return { success: true, message: 'Product deleted successfully' }
	} catch (error) {
		return { success: false, message: formatError(error) }
	}
}

// Create a product
export const createProduct = async (data: z.infer<typeof insertProductSchema>) => {
	try {
		const product = insertProductSchema.parse(data)
		await prisma.product.create({ data: product })

		revalidatePath('/admin/products')
		return { success: true, message: 'Product created successfully' }
	} catch (error) {
		return { success: false, message: formatError(error) }
	}
}

// Update a product
export const updateProduct = async (data: z.infer<typeof updateProductSchema>) => {
	try {
		const product = updateProductSchema.parse(data)
		const productExists = await prisma.product.findFirst({
			where: { id: product.id },
		})

		if (!productExists) throw new Error('Product not found')

		await prisma.product.update({
			where: { id: product.id },
			data: product,
		})

		revalidatePath('/admin/products')
		return { success: true, message: 'Product updated successfully' }
	} catch (error) {
		return { success: false, message: formatError(error) }
	}
}

// Get all categories
export const getAllCategories = async () => {
	const data = await prisma.product.groupBy({
		by: ['category'],
		_count: true,
	})

	return data
}

// Get featured products
export const getFeaturedProducts = async () => {
	const data = await prisma.product.findMany({
		where: { isFeatured: true },
		orderBy: { createdAt: 'desc' },
		take: 4,
	})

	return convertToPlainObject(data)
}
