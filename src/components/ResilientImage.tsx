import React, { useState } from 'react';
import { Cpu, Wind, Laptop } from 'lucide-react';
import { ProductCategory } from '../data/products';

interface ResilientImageProps {
  src: string;
  alt: string;
  category?: ProductCategory;
  title?: string;
  className?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  category = 'computing',
  title,
  className = 'w-full h-full object-cover'
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    const Icon =
      category === 'computing'
        ? Laptop
        : category === 'appliances'
        ? Wind
        : Cpu;

    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#1D1D1F] via-[#2C2C2E] to-[#121214] text-white/80 p-6 text-center ${className}`}
      >
        <Icon className="w-10 h-10 text-[#0071E3] mb-3 stroke-[1.5]" />
        {title && (
          <span className="text-sm font-medium tracking-tight text-white/90 max-w-[20ch] truncate">
            {title}
          </span>
        )}
        <span className="text-xs text-white/50 mt-1">
          AETHER Precision Hardware
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
};
