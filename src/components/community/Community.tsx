// src/components/community/Community.tsx
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

interface CommunityCard {
  id: string;
  name: string;
  description: string;
  members: number;
  thumbnail: string;
  isJoined: boolean;
}

const communities: CommunityCard[] = [
  {
    id: '1',
    name: 'Petani Padi Modern',
    description: 'Komunitas petani padi yang menggunakan teknologi modern',
    members: 256,
    thumbnail: '/communities/rice-farming.jpg',
    isJoined: false,
  },
  {
    id: '2',
    name: 'Sayuran Organik',
    description: 'Berbagi tips dan trik bertani sayuran organik',
    members: 189,
    thumbnail: '/communities/organic-farming.jpg',
    isJoined: true,
  },
  // Add more communities...
];

export default function Community() {
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);
  
  useGSAP(() => {
    gsap.from(".community-card", {
      scrollTrigger: {
        trigger: ".communities-grid",
        start: "top center+=100",
        toggleActions: "play none none reverse",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
    });
  }, []);

  const handleJoin = (communityId: string) => {
    setJoinedCommunities(prev => 
      prev.includes(communityId) 
        ? prev.filter(id => id !== communityId)
        : [...prev, communityId]
    );
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Komunitas Petani</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Bergabung dengan komunitas petani untuk berbagi pengalaman dan pengetahuan
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 communities-grid">
          {communities.map((community) => (
            <motion.div
              key={community.id}
              className="community-card bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48">
                <Image
                  src={community.thumbnail}
                  alt={community.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{community.name}</h3>
                <p className="text-muted-foreground mb-4">{community.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{community.members} members</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleJoin(community.id)}
                      className={`px-4 py-2 rounded-md ${
                        joinedCommunities.includes(community.id)
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {joinedCommunities.includes(community.id) ? 'Joined' : 'Join'}
                    </motion.button>
                    
                    {joinedCommunities.includes(community.id) && (
                      <Link href="/community/chat">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground"
                        >
                          <MessageSquare className="w-5 h-5" />
                        </motion.button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}