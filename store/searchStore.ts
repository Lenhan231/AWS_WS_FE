import { create } from 'zustand';
import { SearchFilters, SearchResult, Gym, PersonalTrainer, Offer } from '@/types';
import { api } from '@/lib/api';

interface SearchState {
  filters: SearchFilters;
  searchResults: {
    gyms: SearchResult<Gym>;
    trainers: SearchResult<PersonalTrainer>;
    offers: SearchResult<Offer>;
  };
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  searchGyms: (filters?: SearchFilters) => Promise<void>;
  searchTrainers: (filters?: SearchFilters) => Promise<void>;
  searchOffers: (filters?: SearchFilters) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const defaultFilters: SearchFilters = {
  radiusKm: 10,
  minRating: 0,
  offerType: 'GYM_OFFER',
  page: 0,
  size: 20,
  sortBy: 'createdAt',
  sortDirection: 'DESC',
};

const defaultSearchResult: SearchResult<any> = {
  content: [],
  pageNumber: 0,
  pageSize: 20,
  totalElements: 0,
  totalPages: 0,
  last: true,
  first: true,
};

export const useSearchStore = create<SearchState>((set, get) => ({
  filters: defaultFilters,
  searchResults: {
    gyms: defaultSearchResult,
    trainers: defaultSearchResult,
    offers: defaultSearchResult,
  },
  isLoading: false,
  error: null,

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  clearFilters: () => {
    set({ filters: defaultFilters });
  },

  searchGyms: async (filters) => {
    const searchFilters = filters || get().filters;
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.gyms.search(searchFilters);
      
      set({
        searchResults: {
          ...get().searchResults,
          gyms: (response.data as SearchResult<Gym>) || defaultSearchResult
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Search failed',
        isLoading: false,
      });
    }
  },

  searchTrainers: async (filters) => {
    const searchFilters = filters || get().filters;
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.ptUsers.getAll(searchFilters);

      set({
        searchResults: {
          ...get().searchResults,
          trainers: (response.data as SearchResult<PersonalTrainer>) || defaultSearchResult
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Search failed',
        isLoading: false,
      });
    }
  },

  searchOffers: async (filters) => {
    const searchFilters = filters || get().filters;
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.search.searchOffers(searchFilters);

      set({
        searchResults: {
          ...get().searchResults,
          offers: (response.data as SearchResult<Offer>) || defaultSearchResult
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Search failed',
        isLoading: false,
      });
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));
