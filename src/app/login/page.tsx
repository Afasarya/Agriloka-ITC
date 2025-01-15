import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Loginform from "@/components/forms/Login";


export default function payment() {
  return (
    <main className="pt-16"> {/* Add padding-top equal to navbar height */}
      <Navbar />
        <Loginform/>
      <Footer />
    </main>
  );
}