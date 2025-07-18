import { createContext } from 'react';

export interface DiscoveredLocation {
  name: string;
  beerCount: number;
  discoveredAt: string;
}

export interface LocationContextType {
  isLocationUnlocked: boolean;
  discoveredLocations: DiscoveredLocation[];
  addDiscoveredLocation: (location: string, beerCount: number) => void;
  clearDiscoveredLocations: () => void;
}

export const LocationContext = createContext<LocationContextType | undefined>(undefined);