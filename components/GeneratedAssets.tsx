import React, { useState } from 'react';
import type { GeneratedAssetData } from '../types';
import { MintNFTModal } from './MintNFTModal';
import { 
  CopyIcon, 
  CheckIcon, 
  DownloadIcon, 
  TagIcon,
  TwitterIcon,
  FacebookIcon,
  PinterestIcon,
  InstagramIcon,
  BookmarkIcon
} from './Icons';

const MarketingCopyCard: React.FC<{ title: string; text: string }> = ({ title, text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-brand-primary p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-brand-accent">{title}</h4>
        <button
          onClick={handleCopy}
          className="text-brand-text-secondary hover:text-white transition-colors"
          aria-label={`Copy ${title}`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
      <p className="text-sm text-brand-text-secondary">{text}</p>
    </div>
  );
};

interface GeneratedAssetsProps {
  data: GeneratedAssetData;
  onSaveRequest?: () => void;
}

export const GeneratedAssets: React.FC<GeneratedAssetsProps> = ({ data, onSaveRequest }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImage = data.images[selectedImageIndex];
  const imageUrl = `data:image/png;base64,${selectedImage}`;

  const [instagramCopied, setInstagramCopied] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);

  const handleInstagramCopy = () => {
    navigator.clipboard.writeText(data.marketingCopy.instagramCaption);
    setInstagramCopied(true);
    setTimeout(() => setInstagramCopied(false), 3000);
  };

  const appUrl = window.location.href;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.marketingCopy.instagramCaption)}&url=${encodeURIComponent(appUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(data.marketingCopy.lookbookDescription)}`;
  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(appUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(data.marketingCopy.lookbookDescription)}`;

  return (
    <>
      <div className="w-full animate-fade-in space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Generated Lookbook</h3>
          <div className="relative group mb-4">
            <img
              src={imageUrl}
              alt="AI generated fashion lookbook"
              className="w-full rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 md:gap-4">
              <a
                href={imageUrl}
                download={`fashiontechx-design-${selectedImageIndex + 1}.png`}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white py-2 px-3 md:px-4 rounded-lg hover:bg-white/30 text-sm"
              >
                <DownloadIcon /> Download
              </a>
              {onSaveRequest && (
                <button
                  onClick={onSaveRequest}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white py-2 px-3 md:px-4 rounded-lg hover:bg-white/30 text-sm"
                >
                  <BookmarkIcon /> Save
                </button>
              )}
              <button
                onClick={() => setIsMintModalOpen(true)}
                className="flex items-center gap-2 bg-brand-accent/80 backdrop-blur-sm text-brand-primary font-bold py-2 px-3 md:px-4 rounded-lg hover:bg-brand-accent text-sm"
              >
                <TagIcon /> Mint NFT
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {data.images.map((img, index) => (
              <button key={index} onClick={() => setSelectedImageIndex(index)} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-brand-accent rounded-md">
                <img
                  src={`data:image/png;base64,${img}`}
                  alt={`Lookbook image ${index + 1}`}
                  className={`w-full h-24 object-cover rounded-md cursor-pointer transition-all ${selectedImageIndex === index ? 'border-2 border-brand-accent scale-105' : 'border-2 border-transparent hover:border-brand-text-secondary'}`}
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Social Share Section */}
        <div className="border-t border-brand-secondary pt-4">
          <div className="flex items-center justify-center gap-4">
              <span className="text-sm font-medium text-brand-text-secondary">Share on:</span>
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" title="Share on Twitter" className="text-brand-text-secondary hover:text-white transition-colors">
                  <TwitterIcon />
              </a>
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" title="Share on Facebook" className="text-brand-text-secondary hover:text-white transition-colors">
                  <FacebookIcon />
              </a>
              <a href={pinterestUrl} target="_blank" rel="noopener noreferrer" title="Share on Pinterest" className="text-brand-text-secondary hover:text-white transition-colors">
                  <PinterestIcon />
              </a>
              <div className="relative">
                  <button onClick={handleInstagramCopy} title="Copy caption for Instagram" className="text-brand-text-secondary hover:text-white transition-colors">
                      <InstagramIcon />
                  </button>
                  {instagramCopied && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-brand-accent text-brand-primary text-xs rounded-md whitespace-nowrap shadow-lg">
                          Caption Copied!
                      </div>
                  )}
              </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Marketing Kit</h3>
          <div className="space-y-4">
            <MarketingCopyCard title="Instagram Caption" text={data.marketingCopy.instagramCaption} />
            <MarketingCopyCard title="Lookbook Description" text={data.marketingCopy.lookbookDescription} />
            <MarketingCopyCard title="PR Pitch" text={data.marketingCopy.prPitch} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Mood Board</h3>
           <div className="relative group">
            <img
              src={`data:image/png;base64,${data.moodboardImage}`}
              alt="AI generated mood board"
              className="w-full rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <a
                href={`data:image/png;base64,${data.moodboardImage}`}
                download="fashiontechx-moodboard.png"
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white py-2 px-4 rounded-lg hover:bg-white/30"
              >
                <DownloadIcon /> Download
              </a>
            </div>
          </div>
        </div>
      </div>
      {isMintModalOpen && <MintNFTModal image={selectedImage} marketingCopy={data.marketingCopy} onClose={() => setIsMintModalOpen(false)} />}
    </>
  );
};
