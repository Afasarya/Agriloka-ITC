import Navbar from '../components/common/Navbar';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Footer from '../components/common/Footer';
import Faq from '../components/home/Faq';
import  Testimonials from '@/components/home/Testimonials';

export default function Home() {
  return (
    <main className="pt-16"> {/* Add padding-top equal to navbar height */}
      <Navbar />
      <Hero />
      <Features />
      <Faq />
      <Testimonials />
      <Footer />
    </main>
  );
}