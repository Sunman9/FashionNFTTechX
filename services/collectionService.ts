import type { Collection, Look, GeneratedAssetData } from '../types';

const COLLECTIONS_KEY = 'fashiontechx_collections';

export function getCollections(): Collection[] {
  try {
    const data = localStorage.getItem(COLLECTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse collections from localStorage", error);
    return [];
  }
}

function saveCollections(collections: Collection[]): void {
  try {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  } catch (error) {
    console.error("Failed to save collections to localStorage", error);
  }
}

export function addCollection(name: string): Collection {
  const collections = getCollections();
  const newCollection: Collection = {
    id: `coll_${Date.now()}`,
    name,
    looks: [],
  };
  collections.push(newCollection);
  saveCollections(collections);
  return newCollection;
}


export function addLookToCollection(
  collectionId: string,
  lookData: GeneratedAssetData,
  lookName: string,
  originalSketch: string,
  prompt: string
): Look {
  const collections = getCollections();
  const collection = collections.find(c => c.id === collectionId);
  if (!collection) {
    throw new Error("Collection not found");
  }

  const newLook: Look = {
    ...lookData,
    id: `look_${Date.now()}`,
    name: lookName,
    createdAt: new Date().toISOString(),
    originalSketch,
    prompt,
  };

  collection.looks.unshift(newLook);
  saveCollections(collections);
  return newLook;
}

export function deleteLook(collectionId: string, lookId: string): void {
    const collections = getCollections();
    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
        collection.looks = collection.looks.filter(l => l.id !== lookId);
        saveCollections(collections);
    }
}

export function deleteCollection(collectionId: string): void {
    let collections = getCollections();
    collections = collections.filter(c => c.id !== collectionId);
    saveCollections(collections);
}
