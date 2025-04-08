'use server'

import { convertToPlainObject, formatError } from '../utils'
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants'
import { prisma } from '@/db/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { insertProductSchema, updateProductSchema } from '../validators'
import { utapi } from '@/app/api/uploadthing/core'

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
}: {
	query: string
	limit?: number
	page: number
	category?: string
}) => {
	const data = await prisma.product.findMany({
		orderBy: { createdAt: 'desc' },
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

		await utapi.deleteFiles(imageKeys as string[])

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
