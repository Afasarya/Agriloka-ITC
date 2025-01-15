import Navbar from '@/components/common/Navbar';
import DetailProduct from '@/components/market/ProductDetail';
import Footer from '@/components/common/Footer';


export default function ProductDetailPage() {
  return (
    <main className="pt-16"> {/* Add padding-top equal to navbar height */}
      <Navbar />
        <DetailProduct/>
      <Footer />
    </main>
  );
}