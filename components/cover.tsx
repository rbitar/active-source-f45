'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CoverButton {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost';
}

interface CoverProps {
  imageUrl: string;
  label?: string;
  title: string;
  description: string;
  buttons?: CoverButton[];
}

export default function Cover({
  imageUrl,
  label,
  title,
  description,
  buttons = [],
}: CoverProps) {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden mb-8">
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        priority
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 py-8 md:py-12">
        <div className="max-w-xl">
          {/* Label */}
          {label && (
            <p className="text-sm md:text-base font-medium text-primary-foreground/80 mb-2 tracking-widest">
              {label}
            </p>
          )}

          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4 leading-tight">
            {title}
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-primary-foreground/90 mb-8 max-w-md leading-relaxed">
            {description}
          </p>

          {/* Buttons */}
          {buttons.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {buttons.map((button, index) =>
                button.href ? (
                  <Link
                    key={index}
                    href={button.href}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium px-8 py-3',
                      'border border-white text-white hover:bg-white/10 transition-colors duration-200'
                    )}
                  >
                    {button.label}
                  </Link>
                ) : (
                  <Button
                    key={index}
                    variant={button.variant ?? 'outline'}
                    onClick={button.onClick}
                    className="rounded-full px-8 py-3 border-white text-white hover:bg-white/10"
                  >
                    {button.label}
                  </Button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
