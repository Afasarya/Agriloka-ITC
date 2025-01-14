// src/app/community/chat/page.tsx
import ChatRoom from '@/components/community/ChatRoom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-16">
        <Navbar/>
      <ChatRoom />
        <Footer />

    </div>
  );
}