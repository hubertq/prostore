import DealCountdown from '@/components/deal-countdown'
import IconBoxes from '@/components/icon-boxes'
import ProductCarousel from '@/components/shared/product/product-carousel'
import ProductList from '@/components/shared/product/product-list'
import ViewAllProductsButton from '@/components/view-all-products-button'
import { getFeaturedProducts, getLatestProducts } from '@/lib/actions/product.actions'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Home',
}

const HomePage = async () => {
	const latestProducts = await getLatestProducts()
	const featuredProducts = await getFeaturedProducts()

	return (
		<>
			{featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
			<ProductList
				data={latestProducts}
				limit={4}
				title='Newest Arrivals'
			/>
			<ViewAllProductsButton />
			<DealCountdown />
			<IconBoxes />
		</>
	)
}
export default HomePage
