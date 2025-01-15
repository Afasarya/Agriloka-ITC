import Navbar from '@/components/common/Navbar';
import Cart from '@/components/market/Cart';
import Footer from '@/components/common/Footer';


export default function cart() {
  return (
    <main className="pt-16"> {/* Add padding-top equal to navbar height */}
      <Navbar />
        <Cart />
      <Footer />
    </main>
  );
}