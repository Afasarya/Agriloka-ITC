import Navbar from '@/components/common/Navbar';

import Footer from '@/components/common/Footer';


export default function Community() {
  return (
    <main className="pt-16"> {/* Add padding-top equal to navbar height */}
      <Navbar />

      <Footer />
    </main>
  );
}