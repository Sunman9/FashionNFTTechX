import React, { useState, useEffect, useCallback } from 'react';
import type { MarketingCopy } from '../types';
import { XCircleIcon, CheckIcon, ExternalLinkIcon } from './Icons';
import { Loader } from './Loader';

interface MintNFTModalProps {
  image: string;
  marketingCopy: MarketingCopy;
  onClose: () => void;
}

type MintingState = 'idle' | 'minting' | 'success';

export const MintNFTModal: React.FC<MintNFTModalProps> = ({ image, marketingCopy, onClose }) => {
  const [blockchain, setBlockchain] = useState('polygon');
  const [listingType, setListingType] = useState('fixed');
  const [price, setPrice] = useState('1.0');
  const [startingBid, setStartingBid] = useState('0.5');
  const [duration, setDuration] = useState(7);
  const [mintingState, setMintingState] = useState<MintingState>('idle');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  
  const currency = blockchain === 'polygon' ? 'MATIC' : 'ETH';

  const handleMint = () => {
    setMintingState('minting');
    const mintDetails = {
      blockchain,
      listingType,
      ...(listingType === 'fixed' ? { price: `${price} ${currency}` } : { startingBid: `${startingBid} ${currency}`, duration: `${duration} days` }),
      itemName: "FashionTechX Look",
      description: marketingCopy.lookbookDescription,
    };
    console.log("Minting with details:", mintDetails);

    // This is a simulation of a blockchain transaction.
    setTimeout(() => {
      const fakeTxHash = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      setTransactionHash(fakeTxHash);
      setMintingState('success');
    }, 2500);
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
  
  const blockExplorerUrl = blockchain === 'polygon'
    ? `https://mumbai.polygonscan.com/tx/${transactionHash}`
    : `https://sepolia.etherscan.io/tx/${transactionHash}`;

  const renderContent = () => {
    if (mintingState === 'success') {
      return (
        <>
          <div className="p-6 text-center">
            <div className="flex justify-center items-center mx-auto w-16 h-16 bg-green-500/20 rounded-full mb-4">
              <CheckIcon className="w-8 h-8 text-green-400" />
            </div>
            <h2 id="modal-title" className="text-2xl font-bold text-brand-accent">Minted Successfully!</h2>
            <p className="text-brand-text-secondary mt-2">Your fashion art is now an NFT on the blockchain.</p>
            <div className="my-6 text-left p-4 bg-brand-primary rounded-lg break-all">
                <span className="text-sm font-medium text-brand-text-secondary">Transaction Hash</span>
                <p className="text-xs text-brand-text">{transactionHash}</p>
            </div>
            <a 
              href={blockExplorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-brand-accent/20 text-brand-accent font-bold py-3 px-4 rounded-lg hover:bg-brand-accent/30 transition-colors"
            >
              View on Block Explorer <ExternalLinkIcon />
            </a>
          </div>
          <div className="bg-brand-primary/50 px-6 py-4 flex justify-end gap-3">
              <button onClick={onClose} className="py-2 px-4 rounded-lg bg-brand-accent hover:bg-yellow-400 text-brand-primary font-bold transition-colors">Done</button>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 id="modal-title" className="text-2xl font-bold text-brand-accent">Mint your Fashion NFT</h2>
                <button onClick={onClose} className="text-brand-text-secondary hover:text-white" disabled={mintingState === 'minting'}>
                    <XCircleIcon />
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Preview */}
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-brand-text-secondary">Artwork Preview</h3>
                    <img src={`data:image/png;base64,${image}`} alt="NFT Preview" className="rounded-lg w-full" />
                </div>
                
                {/* Form */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="blockchain" className="block text-sm font-medium text-brand-text-secondary mb-1">Blockchain</label>
                        <select id="blockchain" value={blockchain} onChange={e => setBlockchain(e.target.value)} className="w-full p-2 bg-brand-primary border border-brand-secondary/50 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent" disabled={mintingState === 'minting'}>
                            <option value="polygon">Polygon (Mumbai Testnet)</option>
                            <option value="ethereum">Ethereum (Sepolia Testnet)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-1">Listing Type</label>
                        <div className="flex gap-2">
                           <button onClick={() => setListingType('fixed')} className={`flex-1 py-2 text-sm rounded-md ${listingType === 'fixed' ? 'bg-brand-accent text-brand-primary font-bold' : 'bg-brand-primary hover:bg-brand-primary/50'}`} disabled={mintingState === 'minting'}>Fixed Price</button>
                           <button onClick={() => setListingType('auction')} className={`flex-1 py-2 text-sm rounded-md ${listingType === 'auction' ? 'bg-brand-accent text-brand-primary font-bold' : 'bg-brand-primary hover:bg-brand-primary/50'}`} disabled={mintingState === 'minting'}>Auction</button>
                        </div>
                    </div>
                    
                    {listingType === 'fixed' && (
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-brand-text-secondary mb-1">Price</label>
                            <div className="relative">
                                <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2 pr-16 bg-brand-primary border border-brand-secondary/50 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent" disabled={mintingState === 'minting'}/>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-text-secondary">{currency}</span>
                            </div>
                        </div>
                    )}

                    {listingType === 'auction' && (
                        <div className="space-y-4">
                           <div>
                                <label htmlFor="startingBid" className="block text-sm font-medium text-brand-text-secondary mb-1">Starting Bid</label>
                                <div className="relative">
                                    <input type="number" id="startingBid" value={startingBid} onChange={e => setStartingBid(e.target.value)} className="w-full p-2 pr-16 bg-brand-primary border border-brand-secondary/50 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent" disabled={mintingState === 'minting'}/>
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-text-secondary">{currency}</span>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-brand-text-secondary mb-1">Auction Duration (days)</label>
                                <input type="number" id="duration" value={duration} onChange={e => setDuration(parseInt(e.target.value, 10))} className="w-full p-2 bg-brand-primary border border-brand-secondary/50 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent" disabled={mintingState === 'minting'}/>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <div className="bg-brand-primary/50 px-6 py-4 flex justify-end gap-3">
            <button onClick={onClose} className="py-2 px-4 rounded-lg bg-brand-secondary/50 hover:bg-brand-secondary text-white transition-colors" disabled={mintingState === 'minting'}>Cancel</button>
            <button onClick={handleMint} className="py-2 px-4 rounded-lg bg-brand-accent hover:bg-yellow-400 text-brand-primary font-bold transition-colors w-36" disabled={mintingState === 'minting'}>
              {mintingState === 'minting' ? <Loader /> : 'Confirm & Mint'}
            </button>
        </div>
      </>
    );
  };


  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={mintingState !== 'minting' ? onClose : undefined}
    >
      <div 
        className="bg-brand-secondary w-full max-w-2xl rounded-2xl border border-brand-secondary/50 shadow-2xl m-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {renderContent()}
      </div>
    </div>
  );
};
