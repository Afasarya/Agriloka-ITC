import Navbar from '../components/common/Navbar';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Footer from '../components/common/Footer';
import Faq from '../components/home/Faq';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Faq />
      <Footer />
    </main>
  );
}