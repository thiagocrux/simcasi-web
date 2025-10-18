'use client';

import { ReactNode } from 'react';

interface DetailsCardProps {
  children: ReactNode;
}

export default function DetailsCard({ children }: DetailsCardProps) {
  return (
    <div className="border-border rounded-lg border-1 px-8 py-4">
      {children}
    </div>
  );
}
