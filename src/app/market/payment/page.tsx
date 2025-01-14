import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Paymentsucces from "@/components/market/Payment";


export default function payment() {
  return (
    <main className="pt-16"> {/* Add padding-top equal to navbar height */}
      <Navbar />
        <Paymentsucces />
      <Footer />
    </main>
  );
}