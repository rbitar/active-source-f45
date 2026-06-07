'use client';

import React from 'react';
import Link from 'next/link';

interface ErrorMessageProps {
  title?: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
}

const DEFAULT_SUBTITLE = "We couldn't load this content. Please try again.";

export default function ErrorMessage({
  title = 'Something went wrong',
  subtitle = DEFAULT_SUBTITLE,
  action,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <h2 className="text-base font-semibold text-foreground mb-1 tracking-tight">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        {subtitle}
      </p>
      {action && (
        <div className="mt-6">
          {action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
