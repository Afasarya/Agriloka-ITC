import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Registerform from "@/components/forms/Register";


export default function register() {
  return (
    <main className="pt-16"> {/* Add padding-top equal to navbar height */}
      <Navbar />
        <Registerform/>
      <Footer />
    </main>
  );
}