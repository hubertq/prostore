import ProductList from '@/components/shared/product/product-list'
import { getLatestProducts } from '@/lib/actions/product.actions'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Home',
}

const HomePage = async () => {
	const latestProducts = await getLatestProducts()
	return (
		<>
			<ProductList
				data={latestProducts}
				limit={4}
				title='Newest Arrivals'
			/>
		</>
	)
}
export default HomePage
