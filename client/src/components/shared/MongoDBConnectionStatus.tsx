import React from 'react';
import { useMongoDBConfig } from '@/stores/MongoDBConfigStore';
import { MongoDBConfigModal } from './MongoDBConfigModal';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MongoDBConnectionStatus: React.FC = () => {
  const { isConfigured } = useMongoDBConfig();

  if (!isConfigured()) {
    return (
      <MongoDBConfigModal
        trigger={
          <Button variant="outline" size="sm" className="flex items-center gap-2 text-orange-600 border-orange-200 hover:bg-orange-50">
            <AlertTriangle size={16} />
            <span className="hidden sm:inline">Conexión por defecto</span>
            <span className="sm:hidden">DB</span>
          </Button>
        }
      />
    );
  }

  return (
    <MongoDBConfigModal
      trigger={
        <Button variant="outline" size="sm" className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50">
          <CheckCircle size={16} />
          <span className="hidden sm:inline">Base de datos personal</span>
          <span className="sm:hidden">DB</span>
        </Button>
      }
    />
  );
};
