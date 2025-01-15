import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Education from '@/components/education/Education';


export default function edukasi() {
  return (
    <main className="pt-16"> {/* Add padding-top equal to navbar height */}
      <Navbar />
        <Education />
      <Footer />
    </main>
  );
}