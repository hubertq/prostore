'use client'

import { productDefaultValues } from '@/lib/constants'
import { insertProductSchema, updateProductSchema } from '@/lib/validators'
import { Product } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import slugify from 'slugify'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { createProduct, updateProduct } from '@/lib/actions/product.actions'
import { UploadButton } from '@/lib/uploadthing'
import { Card, CardContent } from '../ui/card'
import Image from 'next/image'
import { Checkbox } from '../ui/checkbox'
import { Trash } from 'lucide-react'
import { deleteImages } from '@/lib/actions/image.actions'
import { useState } from 'react'

type Props = {
	type: 'Create' | 'Update'
	product?: Product
	productId?: string
}
const ProductForm = ({ type, product, productId }: Props) => {
	const router = useRouter()
	const form = useForm<z.infer<typeof insertProductSchema>>({
		resolver: zodResolver(type === 'Create' ? insertProductSchema : updateProductSchema),
		defaultValues: product && type === 'Update' ? product : productDefaultValues,
	})

	const [imagesToBeDeleted, setImagesToBeDeleted] = useState<string[]>([])

	const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async values => {
		// On Create
		if (type === 'Create') {
			const res = await createProduct(values)

			if (!res.success) {
				toast.error('Operation failed', { description: res.message })
			} else {
				// Delete removed images
				await deleteImages(imagesToBeDeleted)
				toast.success('Operation success', { description: res.message })
				router.push('/admin/products')
			}
		}

		// On Update
		if (type === 'Update') {
			if (!productId) {
				router.push('/admin/products')
				return
			}

			const res = await updateProduct({ ...values, id: productId })

			if (!res.success) {
				toast.error('Operation failed', { description: res.message })
			} else {
				// Delete removed images
				await deleteImages(imagesToBeDeleted)
				toast.success('Operation success', { description: res.message })
				router.push('/admin/products')
			}
		}

		// Delete images to be deleted upon submission
	}

	const images = form.watch('images')
	const isFeatured = form.watch('isFeatured')
	const banner = form.watch('banner')

	const handleImageRemove = async (removedImage: string) => {
		// Add removed image to array of images to be deleted on submit
		const imageKey = removedImage.split('/').pop() as string
		setImagesToBeDeleted(prev => [...prev, imageKey])

		// Filter out removed images and update images form value
		const filteredImages = images.filter(image => image !== removedImage)
		form.setValue('images', filteredImages)
	}

	return (
		<Form {...form}>
			<form
				className='space-y-8'
				method='POST'
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className='flex flex-col items-start md:flex-row gap-5'>
					{/* Name */}
					<FormField
						control={form.control}
						name='name'
						render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'name'> }) => (
							<FormItem className='w-full'>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter product name'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* Slug */}
					<FormField
						control={form.control}
						name='slug'
						render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'slug'> }) => (
							<FormItem className='w-full'>
								<FormLabel>Slug</FormLabel>
								<FormControl>
									<div className='relative'>
										<Input
											placeholder='Enter product slug'
											{...field}
										/>
										<Button
											type='button'
											className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2'
											onClick={() => {
												form.setValue('slug', slugify(form.getValues('name'), { lower: true }))
											}}
										>
											Generate
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className='flex flex-col md:flex-row gap-5'>
					{/* Category */}
					<FormField
						control={form.control}
						name='category'
						render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'category'> }) => (
							<FormItem className='w-full'>
								<FormLabel>Category</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter product category'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* Brand */}
					<FormField
						control={form.control}
						name='brand'
						render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'brand'> }) => (
							<FormItem className='w-full'>
								<FormLabel>Brand</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter product brand'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className='flex flex-col md:flex-row gap-5'>
					{/* Price */}
					<FormField
						control={form.control}
						name='price'
						render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'price'> }) => (
							<FormItem className='w-full'>
								<FormLabel>Price</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter product price'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* Stock */}
					<FormField
						control={form.control}
						name='stock'
						render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'stock'> }) => (
							<FormItem className='w-full'>
								<FormLabel>Stock</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter product stock'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className='upload-field flex flex-col md:flex-row gap-5'>
					{/* Images */}
					<FormField
						control={form.control}
						name='images'
						render={() => (
							<FormItem className='w-full'>
								<FormLabel>Images</FormLabel>
								<Card className='p-0 pt-2'>
									<CardContent className='space-y-2 min-h-48'>
										{/* <UploadDropzone
											endpoint={'imageUploader'}
											onClientUploadComplete={(res: { url: string }[]) => {
												form.setValue('images', [...images, res[0].url])
											}}
											onUploadError={(error: Error) => {
												toast.error('Operation failed', { description: `Error! ${error.message}` })
											}}
										/> */}
										<div className='flex-start space-x-2'>
											{images.map((image: string) => (
												<div
													key={image}
													className='border relative rounded-md'
												>
													<Image
														src={image}
														alt='product image'
														className='w-20 h-20 object-cover object-center rounded-sm'
														width={100}
														height={100}
													/>
													<Button
														variant={'destructive'}
														className='absolute top-1 right-1 w-7 h-7 rounded-full'
														onClick={() => handleImageRemove(image)}
													>
														<Trash
															className='w-5 h-5'
															style={{ color: 'white' }}
														/>
													</Button>
												</div>
											))}
											<FormControl>
												<UploadButton
													endpoint={'imageUploader'}
													onClientUploadComplete={(res: { url: string }[]) => {
														const uploadedImages: string[] = res.map(image => image.url)
														form.setValue('images', [...images, ...uploadedImages])
													}}
													onUploadError={(error: Error) => {
														toast.error('Operation failed', { description: `Error! ${error.message}` })
													}}
												/>
											</FormControl>
										</div>
									</CardContent>
								</Card>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className='upload-field'>
					{/* isFeatured */}
					Featured Product
					<Card>
						<CardContent className='space-y-2'>
							<FormField
								control={form.control}
								name='isFeatured'
								render={({ field }) => (
									<FormItem className='flex space-x-1 items-center'>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<FormLabel>Is Featured?</FormLabel>
									</FormItem>
								)}
							/>
							{isFeatured && banner && (
								<Image
									src={banner}
									alt='banner image'
									className='w-full object-cover object-center rounded-sm'
									width={1920}
									height={680}
								/>
							)}

							{isFeatured && !banner && (
								<UploadButton
									endpoint={'imageUploader'}
									onClientUploadComplete={(res: { url: string }[]) => {
										form.setValue('banner', res[0].url)
									}}
									onUploadError={(error: Error) => {
										toast.error('Operation failed', { description: `Error! ${error.message}` })
									}}
								/>
							)}
						</CardContent>
					</Card>
				</div>
				<div>
					{/* Description */}
					<FormField
						control={form.control}
						name='description'
						render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'description'> }) => (
							<FormItem className='w-full'>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										placeholder='Enter product description'
										className='resize-none'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div>
					<Button
						type='submit'
						size={'lg'}
						disabled={form.formState.isSubmitting}
						className='button col-span-2 w-full'
					>
						{form.formState.isSubmitting ? 'Submitting' : `${type} Product`}
					</Button>
				</div>
			</form>
		</Form>
	)
}
export default ProductForm
