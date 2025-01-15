import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import EducationDetail from '@/components/education/Detail';


export default function edukasi() {
  return (
    <main className="pt-16"> {/* Add padding-top equal to navbar height */}
      <Navbar />
        <EducationDetail />
      <Footer />
    </main>
  );
}