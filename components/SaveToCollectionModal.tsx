import React, { useState, useCallback, useEffect } from 'react';
import type { Collection } from '../types';
import { XCircleIcon } from './Icons';

interface SaveToCollectionModalProps {
  collections: Collection[];
  onClose: () => void;
  onSave: (details: { lookName: string; collectionId: string; newCollectionName?: string }) => void;
}

export const SaveToCollectionModal: React.FC<SaveToCollectionModalProps> = ({ collections, onClose, onSave }) => {
  const [lookName, setLookName] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(collections.length > 0 ? collections[0].id : 'new');
  const [newCollectionName, setNewCollectionName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookName.trim() || (selectedCollectionId === 'new' && !newCollectionName.trim())) {
      // Basic validation: add user feedback later if needed
      return;
    }
    onSave({ lookName, collectionId: selectedCollectionId, newCollectionName });
  };
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-brand-secondary w-full max-w-lg rounded-2xl border border-brand-secondary/50 shadow-2xl m-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                  <h2 id="modal-title" className="text-2xl font-bold text-brand-accent">Save to Collection</h2>
                  <button type="button" onClick={onClose} className="text-brand-text-secondary hover:text-white">
                      <XCircleIcon />
                  </button>
              </div>
              
              <div className="space-y-4">
                  <div>
                      <label htmlFor="lookName" className="block text-sm font-medium text-brand-text-secondary mb-1">Look Name</label>
                      <input 
                        type="text" 
                        id="lookName" 
                        value={lookName} 
                        onChange={e => setLookName(e.target.value)} 
                        className="w-full p-2 bg-brand-primary border border-brand-secondary/50 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                        placeholder="e.g., Sunset Bohemian Dress"
                        required
                      />
                  </div>
                   <div>
                      <label htmlFor="collection" className="block text-sm font-medium text-brand-text-secondary mb-1">Collection</label>
                      <select 
                        id="collection" 
                        value={selectedCollectionId} 
                        onChange={e => setSelectedCollectionId(e.target.value)} 
                        className="w-full p-2 bg-brand-primary border border-brand-secondary/50 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                      >
                          {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          <option value="new">-- Create a new collection --</option>
                      </select>
                  </div>

                  {selectedCollectionId === 'new' && (
                     <div className="animate-fade-in">
                        <label htmlFor="newCollectionName" className="block text-sm font-medium text-brand-text-secondary mb-1">New Collection Name</label>
                        <input 
                          type="text" 
                          id="newCollectionName" 
                          value={newCollectionName} 
                          onChange={e => setNewCollectionName(e.target.value)} 
                          className="w-full p-2 bg-brand-primary border border-brand-secondary/50 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                          placeholder="e.g., BIFW Spring 2025"
                          required
                        />
                    </div>
                  )}
              </div>
          </div>
          <div className="bg-brand-primary/50 px-6 py-4 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg bg-brand-secondary/50 hover:bg-brand-secondary text-white transition-colors">Cancel</button>
              <button type="submit" className="py-2 px-4 rounded-lg bg-brand-accent hover:bg-yellow-400 text-brand-primary font-bold transition-colors w-36">
                Save Look
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};
