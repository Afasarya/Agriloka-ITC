import Navbar from '@/components/common/Navbar';
import Ai from '@/components/agrilokaai/Chat';
import Footer from '@/components/common/Footer';


export default function agrilokaai() {
  return (
    <main className="pt-16"> {/* Add padding-top equal to navbar height */}
      <Navbar />
        <Ai />
      <Footer />
    </main>
  );
}