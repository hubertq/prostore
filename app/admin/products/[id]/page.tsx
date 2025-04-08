import ProductForm from '@/components/admin/product-form'
import { getProductById } from '@/lib/actions/product.actions'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
	title: 'Edit Product',
}

type Props = {
	params: Promise<{ id: string }>
}

const EditProductPage = async ({ params }: Props) => {
	const { id } = await params
	const product = await getProductById(id)

	if (!product) return notFound()
	return (
		<div>
			<h2 className='h2-bold'>Edit Product</h2>
			<div className='my-8'>
				<ProductForm
					type='Update'
					product={product}
					productId={product.id}
				/>
			</div>
		</div>
	)
}
export default EditProductPage
