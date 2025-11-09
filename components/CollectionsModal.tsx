import React, { useState, useEffect, useCallback } from 'react';
import type { Collection, Look } from '../types';
import { XCircleIcon, TrashIcon } from './Icons';
import { GeneratedAssets } from './GeneratedAssets';
import { deleteCollection, deleteLook } from '../services/collectionService';

interface CollectionsModalProps {
  collections: Collection[];
  onClose: () => void;
  onUpdate: () => void;
}

const LookDetailView: React.FC<{ look: Look; onBack: () => void; }> = ({ look, onBack }) => {
  return (
    <div className="p-4 md:p-6 bg-brand-primary rounded-lg h-full overflow-y-auto">
        <button onClick={onBack} className="mb-4 text-sm text-brand-accent hover:underline">
            &larr; Back to Collection
        </button>
        <h3 className="text-xl font-bold mb-1">{look.name}</h3>
        <p className="text-xs text-brand-text-secondary mb-4">Saved on: {new Date(look.createdAt).toLocaleString()}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
                <h4 className="font-semibold text-brand-text-secondary mb-2">Original Sketch</h4>
                <img src={`data:image/png;base64,${look.originalSketch}`} alt="Original sketch" className="w-full rounded-md border border-brand-secondary" />
            </div>
            <div>
                <h4 className="font-semibold text-brand-text-secondary mb-2">Design Keywords</h4>
                <p className="p-3 bg-brand-secondary/30 rounded-md text-sm text-brand-text-secondary italic">"{look.prompt}"</p>
            </div>
        </div>
        <GeneratedAssets data={look} />
    </div>
  );
};


export const CollectionsModal: React.FC<CollectionsModalProps> = ({ collections, onClose, onUpdate }) => {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);

  useEffect(() => {
    if (collections.length > 0 && !selectedCollectionId) {
      setSelectedCollectionId(collections[0].id);
    }
    if (collections.length === 0) {
      setSelectedCollectionId(null);
    }
  }, [collections, selectedCollectionId]);

  const handleDeleteCollection = (id: string) => {
    if (window.confirm("Are you sure you want to delete this entire collection?")) {
        deleteCollection(id);
        onUpdate();
        if (selectedCollectionId === id) {
            setSelectedCollectionId(null);
        }
    }
  };

  const handleDeleteLook = (collectionId: string, lookId: string) => {
    if (window.confirm("Are you sure you want to delete this look?")) {
        deleteLook(collectionId, lookId);
        onUpdate();
    }
  };
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (selectedLook) {
        setSelectedLook(null);
      } else {
        onClose();
      }
    }
  }, [onClose, selectedLook]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const selectedCollection = collections.find(c => c.id === selectedCollectionId);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-brand-secondary w-full h-full max-w-7xl rounded-2xl border border-brand-secondary/50 shadow-2xl m-0 md:m-4 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 border-b border-brand-secondary/50 flex-shrink-0">
          <h2 id="modal-title" className="text-2xl font-bold text-brand-accent">My Collections</h2>
          <button onClick={onClose} className="text-brand-text-secondary hover:text-white">
            <XCircleIcon />
          </button>
        </header>

        <div className="flex-grow flex flex-col md:flex-row min-h-0">
          {/* Sidebar */}
          <aside className="w-full md:w-64 bg-brand-primary/20 p-4 border-r border-brand-secondary/50 overflow-y-auto flex-shrink-0">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-text-secondary mb-3">Collections</h3>
              {collections.length > 0 ? (
                <ul>
                  {collections.map(c => (
                    <li key={c.id} className="mb-1">
                      <div className={`group flex justify-between items-center w-full text-left p-2 rounded-md transition-colors ${selectedCollectionId === c.id ? 'bg-brand-accent text-brand-primary' : 'hover:bg-brand-secondary/50'}`}>
                        <button onClick={() => { setSelectedCollectionId(c.id); setSelectedLook(null); }} className="flex-grow text-left">
                           {c.name} ({c.looks.length})
                        </button>
                        <button onClick={() => handleDeleteCollection(c.id)} className={`ml-2 text-brand-text-secondary/70 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ${selectedCollectionId === c.id ? 'text-brand-primary/70 hover:text-red-900' : ''}`} aria-label={`Delete collection ${c.name}`}>
                           <TrashIcon />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-brand-text-secondary">No collections yet. Save your first look!</p>
              )}
          </aside>
          
          {/* Main Content */}
          <main className="flex-grow p-4 md:p-6 bg-brand-primary overflow-y-auto">
            {selectedLook ? (
                <LookDetailView look={selectedLook} onBack={() => setSelectedLook(null)} />
            ) : selectedCollection ? (
              <div>
                <h3 className="text-2xl font-bold mb-4">{selectedCollection.name}</h3>
                {selectedCollection.looks.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {selectedCollection.looks.map(look => (
                          <div key={look.id} className="group relative">
                              <button onClick={() => setSelectedLook(look)} className="block w-full aspect-square rounded-lg overflow-hidden border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-primary focus:ring-brand-accent">
                                <img src={`data:image/png;base64,${look.images[0]}`} alt={look.name} className="w-full h-full object-cover"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                                  <p className="text-sm font-semibold text-white truncate">{look.name}</p>
                                </div>
                              </button>
                              <button onClick={() => handleDeleteLook(selectedCollection.id, look.id)} className="absolute top-1 right-1 p-1 bg-brand-primary/50 rounded-full text-brand-text-secondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all" aria-label={`Delete look ${look.name}`}>
                                <TrashIcon className="w-4 h-4" />
                              </button>
                          </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center text-brand-text-secondary mt-10">This collection is empty. Generate and save a new look to add it here.</p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                  <p className="text-brand-text-secondary">Select a collection to view its looks.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
