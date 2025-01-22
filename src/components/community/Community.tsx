// src/components/community/Community.tsx
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Sprout, MessageSquare, Leaf } from 'lucide-react';
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
    thumbnail: '/images/community1.jpg',
    isJoined: false,
  },
  {
    id: '2',
    name: 'Sayuran Organik',
    description: 'Berbagi tips dan trik bertani sayuran organik',
    members: 189,
    thumbnail: '/images/community3.jpg',
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
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent py-16"> {/* Reduced from py-24 to py-16 */}
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            
            {/* Animated Gradient Blobs */}
            <motion.div
              className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/15 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            />
          </div>

          {/* Floating Icons */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-20 right-[20%]"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Users className="w-12 h-12 text-primary/20" />
            </motion.div>
            <motion.div
              className="absolute bottom-20 left-[15%]"
              animate={{
                y: [0, 10, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sprout className="w-16 h-16 text-primary/15" />
            </motion.div>
            <motion.div
              className="absolute top-32 left-[25%]"
              animate={{
                y: [0, -15, 0],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <MessageSquare className="w-10 h-10 text-primary/20" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 relative pt-8"> {/* Added pt-8 for fine-tuning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-block mb-6"
              >
                <div className="p-3 bg-primary/10 rounded-2xl backdrop-blur-sm">
                  <Users className="w-12 h-12 text-primary" />
                </div>
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Komunitas Petani
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Bergabung dengan komunitas petani untuk berbagi pengalaman dan pengetahuan
              </p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
              >
                <Users className="w-4 h-4 text-primary" />
                <span>Berbagi Pengalaman</span>
                <span className="mx-2">•</span>
                <MessageSquare className="w-4 h-4 text-primary" />
                <span>Diskusi</span>
                <span className="mx-2">•</span>
                <Leaf className="w-4 h-4 text-primary" />
                <span>Tips Bertani</span>
              </motion.div>
            </motion.div>
          </div>
        </div>

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