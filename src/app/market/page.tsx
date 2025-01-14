import Navbar from '@/components/common/Navbar';
import Market from '@/components/market/Pasar';
import Footer from '@/components/common/Footer';


export default function pasar() {
  return (
    <main className="pt-16"> {/* Add padding-top equal to navbar height */}
      <Navbar />
      <Market />
      <Footer />
    </main>
  );
}