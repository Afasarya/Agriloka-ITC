import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Analyze from '@/components/agrilokaai/Analyze';

export default function AgrilokaAI() {
  return (
    <main className="pt-16">
      <Navbar />
      <Analyze />
      <Footer />
    </main>
  );
}