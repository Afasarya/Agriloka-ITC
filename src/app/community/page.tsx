import Navbar from '@/components/common/Navbar';
import Community from '@/components/community/Community';
import Footer from '@/components/common/Footer';


export default function community() {
  return (
    <main className="pt-16"> {/* Add padding-top equal to navbar height */}
      <Navbar />
      <Community />
      <Footer />
    </main>
  );
}