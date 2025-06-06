import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item, Category, Location } from '@/types/inventory';

interface InventoryState {
  items: Item[];
  categories: Category[];
  locations: Location[];
  addItem: (item: Item) => void;
  updateItem: (item: Item) => void;
  removeItem: (id: string) => void;
  lendItem: (id: string, borrower: string, location: string, expectedReturn?: string, notes?: string) => void;
  returnItem: (id: string) => void;
  addCategory: (category: Category) => void;
  removeCategory: (id: string) => void;
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  getItemByBarcode: (barcode: string) => Item | undefined;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: [],
      categories: [
        { id: '1', name: 'Electronics' },
        { id: '2', name: 'Office Supplies' },
        { id: '3', name: 'Tools' },
      ],
      locations: [
        { id: '1', name: 'Main Office' },
        { id: '2', name: 'Warehouse' },
        { id: '3', name: 'Storage Room' },
      ],
      
      addItem: (item) => set((state) => ({ 
        items: [...state.items, item] 
      })),
      
      updateItem: (updatedItem) => set((state) => ({
        items: state.items.map((item) => 
          item.id === updatedItem.id ? updatedItem : item
        )
      })),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),
      
      lendItem: (id, borrower, location, expectedReturn, notes) => set((state) => ({
        items: state.items.map((item) => 
          item.id === id 
            ? { 
                ...item, 
                isLent: true, 
                lendingInfo: {
                  borrower,
                  location,
                  dateLent: new Date().toISOString(),
                  expectedReturn,
                  notes
                }
              } 
            : item
        )
      })),
      
      returnItem: (id) => set((state) => ({
        items: state.items.map((item) => 
          item.id === id 
            ? { 
                ...item, 
                isLent: false, 
                lendingInfo: undefined
              } 
            : item
        )
      })),
      
      addCategory: (category) => set((state) => ({
        categories: [...state.categories, category]
      })),
      
      removeCategory: (id) => set((state) => ({
        categories: state.categories.filter((category) => category.id !== id)
      })),
      
      addLocation: (location) => set((state) => ({
        locations: [...state.locations, location]
      })),
      
      removeLocation: (id) => set((state) => ({
        locations: state.locations.filter((location) => location.id !== id)
      })),
      
      getItemByBarcode: (barcode) => {
        return get().items.find((item) => item.barcode === barcode);
      },
    }),
    {
      name: 'inventory-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);