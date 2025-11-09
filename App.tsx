import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { GeneratedAssets } from './components/GeneratedAssets';
import { Loader } from './components/Loader';
import { generateFashionAssets } from './services/geminiService';
import { getCollections, addCollection, addLookToCollection } from './services/collectionService';
import type { GeneratedAssetData, Collection } from './types';
import { SparklesIcon } from './components/Icons';
import { SaveToCollectionModal } from './components/SaveToCollectionModal';
import { CollectionsModal } from './components/CollectionsModal';


async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = (reader.result as string).split(',')[1];
      if (result) {
        resolve(result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = error => reject(error);
  });
}

export default function App() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [originalSketchBase64, setOriginalSketchBase64] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('Bohemian chic, silk, sunset palette, intricate embroidery');
  const [generatedData, setGeneratedData] = useState<GeneratedAssetData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [collections, setCollections] = useState<Collection[]>([]);
  const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setCollections(getCollections());
  }, []);

  const updateCollections = () => {
    setCollections(getCollections());
  };

  const handleFileSelect = async (file: File) => {
    setUploadedFile(file);
    setGeneratedData(null);
    setError(null);
    try {
      const base64 = await fileToBase64(file);
      setOriginalSketchBase64(base64);
    } catch (e) {
      setError("Failed to read the uploaded file.");
      setOriginalSketchBase64(null);
    }
  };
  
  const handleClear = () => {
    setUploadedFile(null);
    setGeneratedData(null);
    setError(null);
    setOriginalSketchBase64(null);
  };

  const handleGenerate = useCallback(async () => {
    if (!uploadedFile || !prompt || !originalSketchBase64) {
      setError('Please upload a sketch and provide design keywords.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedData(null);

    try {
      const result = await generateFashionAssets(originalSketchBase64, uploadedFile.type, prompt);
      setGeneratedData(result);
    } catch (e: any) {
      console.error(e);
      setError(`Failed to generate assets. ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [uploadedFile, prompt, originalSketchBase64]);

  const handleSaveLook = ({ lookName, collectionId, newCollectionName }: { lookName: string; collectionId: string; newCollectionName?: string; }) => {
    if (!generatedData || !originalSketchBase64) return;
    
    let finalCollectionId = collectionId;
    if (collectionId === 'new' && newCollectionName) {
      try {
        const newColl = addCollection(newCollectionName);
        finalCollectionId = newColl.id;
      } catch (e: any) {
        setError(`Failed to create collection: ${e.message}`);
        return;
      }
    }

    if (!finalCollectionId || finalCollectionId === 'new') {
        setError("Please select or create a collection.");
        return;
    }

    try {
      addLookToCollection(finalCollectionId, generatedData, lookName, originalSketchBase64, prompt);
      updateCollections();
      setIsSaveModalOpen(false);
    } catch (e: any) {
      setError(`Failed to save look: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-brand-primary font-sans">
      <Header onOpenCollections={() => setIsCollectionsModalOpen(true)} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-brand-text-secondary mb-8 text-lg">
            Upload your fashion sketches and moodboards. Our AI Fashion Agent will enhance your vision, generate stunning product imagery, and create compelling marketing copy.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Column */}
            <div className="bg-brand-secondary/20 p-6 rounded-2xl border border-brand-secondary">
              <h2 className="text-2xl font-bold text-brand-accent mb-4">1. Your Vision</h2>
              <div className="space-y-6">
                <FileUpload onFileSelect={handleFileSelect} onClear={handleClear} currentFile={uploadedFile} />
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-brand-text-secondary mb-2">Design Keywords & Moodboard</label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., sustainable silk, sunset palette, geometric prints"
                    className="w-full h-24 p-3 bg-brand-primary border border-brand-secondary rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition"
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={!uploadedFile || isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-brand-accent text-brand-primary font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Generating...' : 'Generate Assets'}
                  {!isLoading && <SparklesIcon />}
                </button>
              </div>
            </div>

            {/* Output Column */}
            <div className="bg-brand-secondary/20 p-6 rounded-2xl border border-brand-secondary min-h-[400px] flex flex-col justify-center items-center">
              <h2 className="text-2xl font-bold text-brand-accent mb-4 w-full">2. AI-Generated Assets</h2>
              {isLoading && <Loader />}
              {error && <div className="text-red-400 text-center">{error}</div>}
              {!isLoading && !error && !generatedData && (
                <div className="text-center text-brand-text-secondary">
                  Your generated lookbook and marketing copy will appear here.
                </div>
              )}
              {generatedData && <GeneratedAssets data={generatedData} onSaveRequest={() => setIsSaveModalOpen(true)} />}
            </div>
          </div>
        </div>
      </main>

      {isSaveModalOpen && (
        <SaveToCollectionModal
          collections={collections}
          onClose={() => setIsSaveModalOpen(false)}
          onSave={handleSaveLook}
        />
      )}
      {isCollectionsModalOpen && (
        <CollectionsModal
          collections={collections}
          onClose={() => setIsCollectionsModalOpen(false)}
          onUpdate={updateCollections}
        />
      )}
    </div>
  );
}
