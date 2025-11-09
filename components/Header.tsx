
import React from 'react';
import { BookOpenIcon } from './Icons';

export const Header: React.FC<{ onOpenCollections: () => void }> = ({ onOpenCollections }) => {
  return (
    <header className="bg-brand-primary/80 backdrop-blur-sm sticky top-0 z-10 border-b border-brand-secondary">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-6">
            <div className="text-2xl font-bold tracking-wider">
              FashionTech<span className="text-brand-accent">X</span>
            </div>
             <button 
              onClick={onOpenCollections} 
              className="flex items-center gap-2 text-brand-text-secondary hover:text-white transition-colors"
              aria-label="Open my collections"
            >
              <BookOpenIcon />
              <span className="hidden sm:inline">My Collections</span>
            </button>
          </div>
          <div className="text-sm text-brand-text-secondary tracking-widest">
            BENGALURU INT'L FASHION WEEK
          </div>
        </div>
      </div>
    </header>
  );
};
