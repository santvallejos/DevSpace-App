import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MongoDBConfig {
  connectionString: string;
  databaseName: string;
  isEnabled: boolean;
}

interface MongoDBConfigStore {
  config: MongoDBConfig;
  updateConfig: (config: Partial<MongoDBConfig>) => void;
  clearConfig: () => void;
  isConfigured: () => boolean;
}

const defaultConfig: MongoDBConfig = {
  connectionString: '',
  databaseName: 'Unity',
  isEnabled: false,
};

export const useMongoDBConfig = create<MongoDBConfigStore>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      
      updateConfig: (newConfig: Partial<MongoDBConfig>) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),
      
      clearConfig: () =>
        set({ config: defaultConfig }),
      
      isConfigured: () => {
        const { config } = get();
        return config.isEnabled && config.connectionString.trim() !== '';
      },
    }),
    {
      name: 'mongodb-config-storage',
      partialize: (state) => ({ config: state.config }),
    }
  )
);
