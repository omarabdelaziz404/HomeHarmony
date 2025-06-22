import ProductList from '@/components/shared/product/product-list';
import {
  getLatestProducts,
  getFeaturedProducts,
} from '@/lib/actions/product.actions';
import ProductCarousel from '@/components/shared/product/product-carousel';
import ViewAllProductsButton from '@/components/view-all-products-button';


const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel
          data={featuredProducts.map((product) => ({
            ...product,
            brand: product.brand ?? undefined,         // convert null to undefined
            stock: product.stock ?? undefined,         // convert null to undefined
            isFeatured: product.isFeatured ?? undefined, // convert null to undefined
          }))}
        />
      )}
      <ProductList
        data={latestProducts.map((product) => ({
          ...product,
          brand: product.brand ?? undefined,
          stock: product.stock ?? undefined,
          isFeatured: product.isFeatured ?? undefined,
        }))}
        title='Newest Arrivals'
        limit={4}
      />
      <ViewAllProductsButton />
    </>
  );
};

export default Homepage;
