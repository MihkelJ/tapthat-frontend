import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { LocationContext, type DiscoveredLocation, type LocationContextType } from '@/contexts/LocationContext';

const STORAGE_KEY = 'tapthat-location-state';

export function LocationProvider({ children }: { children: ReactNode }) {
  const [discoveredLocations, setDiscoveredLocations] = useState<DiscoveredLocation[]>([]);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setDiscoveredLocations(parsed.discoveredLocations || []);
      }
    } catch (error) {
      console.warn('Failed to load location state from localStorage:', error);
    }
  }, []);

  // Save state to localStorage whenever discoveredLocations changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          discoveredLocations,
        })
      );
    } catch (error) {
      console.warn('Failed to save location state to localStorage:', error);
    }
  }, [discoveredLocations]);

  const addDiscoveredLocation = useCallback((location: string, beerCount: number) => {
    setDiscoveredLocations((prev) => {
      // Check if location already exists
      const existingIndex = prev.findIndex((loc) => loc.name === location);
      
      if (existingIndex >= 0) {
        // Update existing location
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          beerCount,
          discoveredAt: new Date().toISOString(),
        };
        return updated;
      } else {
        // Add new location
        return [
          ...prev,
          {
            name: location,
            beerCount,
            discoveredAt: new Date().toISOString(),
          },
        ];
      }
    });
  }, []);

  const clearDiscoveredLocations = useCallback(() => {
    setDiscoveredLocations([]);
  }, []);

  const isLocationUnlocked = discoveredLocations.length > 0;

  const value: LocationContextType = {
    isLocationUnlocked,
    discoveredLocations,
    addDiscoveredLocation,
    clearDiscoveredLocations,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

