
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-primary/80 backdrop-blur-sm sticky top-0 z-10 border-b border-brand-secondary">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="text-2xl font-bold tracking-wider">
            FashionTech<span className="text-brand-accent">X</span>
          </div>
          <div className="text-sm text-brand-text-secondary tracking-widest">
            BENGALURU INT'L FASHION WEEK
          </div>
        </div>
      </div>
    </header>
  );
};
