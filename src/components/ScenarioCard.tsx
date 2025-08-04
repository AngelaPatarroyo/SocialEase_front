'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export interface ScenarioCardProps {
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Basic';
  xp: number;
  imageUrl: string;
  isVR?: boolean;
  slug?: string;
}

export default function ScenarioCard({
  title,
  level,
  xp,
  imageUrl,
  isVR,
  slug = '#',
}: ScenarioCardProps) {
  const levelBadgeClasses = {
    Beginner: 'bg-blue-100 text-blue-600',
    Intermediate: 'bg-yellow-100 text-yellow-700',
    Advanced: 'bg-red-100 text-red-600',
    Basic: 'bg-green-100 text-green-600',
  };

  return (
    <Link href={`/scenarios/${slug}`} passHref>
      <motion.div
        whileHover={{ scale: 1.05, boxShadow: '0 0 12px rgba(0,0,0,0.2)' }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-[280px] md:max-w-[300px] rounded-2xl bg-white shadow-xl border border-gray-200 overflow-hidden cursor-pointer hover:border-indigo-300 hover:shadow-indigo-100 transition-all"
      >
        {/* Image container */}
        <div className="px-3 pt-3">
          <div className="relative w-full h-44 md:h-48 rounded-xl overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 90vw, 300px"
              className="rounded-xl object-cover"
              quality={90}
            />
            {isVR && (
              <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full shadow-sm z-10">
                VR
              </span>
            )}
          </div>
        </div>

        {/* Text */}
        <div className="p-4 flex flex-col gap-1">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
            <span className={`px-2 py-1 rounded-md font-medium ${levelBadgeClasses[level]}`}>
              {level}
            </span>
            <span className="text-orange-500 font-semibold">⚡ +{xp} XP</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
