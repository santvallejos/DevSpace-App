import React, { useState } from 'react';
import { useMongoDBConfig } from '@/stores/MongoDBConfigStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Database, CheckCircle, AlertCircle } from 'lucide-react';

interface MongoDBConfigModalProps {
  trigger?: React.ReactNode;
}

export const MongoDBConfigModal: React.FC<MongoDBConfigModalProps> = ({ trigger }) => {
  const { config, updateConfig, clearConfig, isConfigured } = useMongoDBConfig();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    connectionString: config.connectionString,
    databaseName: config.databaseName,
    isEnabled: config.isEnabled,
  });

  const handleSave = () => {
    updateConfig(formData);
    setOpen(false);
  };

  const handleClear = () => {
    clearConfig();
    setFormData({
      connectionString: '',
      databaseName: 'Unity',
      isEnabled: false,
    });
  };

  const validateConnectionString = (connectionString: string): boolean => {
    if (!connectionString.trim()) return false;
    // Basic validation for MongoDB connection string format
    return /^mongodb(\+srv)?:\/\//.test(connectionString);
  };

  const isValidConnection = validateConnectionString(formData.connectionString);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Database size={16} />
            Configurar MongoDB
            {isConfigured() && <CheckCircle size={14} className="text-green-500" />}
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database size={20} />
            Configuración de MongoDB
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Card */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {isConfigured() ? (
                <>
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-sm font-medium text-green-700">Conexión configurada</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} className="text-orange-500" />
                  <span className="text-sm font-medium text-orange-700">Usando conexión por defecto</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isConfigured() 
                ? 'Tu aplicación se conectará a tu base de datos personal'
                : 'La aplicación usa una base de datos compartida por defecto'
              }
            </p>
          </Card>

          {/* Enable/Disable Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enable-custom"
              checked={formData.isEnabled}
              onChange={(e) => setFormData(prev => ({ ...prev, isEnabled: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="enable-custom" className="text-sm font-medium">
              Usar mi propia base de datos MongoDB
            </Label>
          </div>

          {formData.isEnabled && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="connection-string" className="text-sm font-medium">
                    Connection String *
                  </Label>
                  <Input
                    id="connection-string"
                    type="password"
                    placeholder="mongodb+srv://usuario:password@cluster.mongodb.net/"
                    value={formData.connectionString}
                    onChange={(e) => setFormData(prev => ({ ...prev, connectionString: e.target.value }))}
                    className={`mt-1 ${!isValidConnection && formData.connectionString ? 'border-red-500' : ''}`}
                  />
                  {!isValidConnection && formData.connectionString && (
                    <p className="text-xs text-red-500 mt-1">
                      Formato de connection string inválido
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Tu connection string de MongoDB Atlas, local o cualquier instancia compatible
                  </p>
                </div>

                <div>
                  <Label htmlFor="database-name" className="text-sm font-medium">
                    Nombre de la Base de Datos
                  </Label>
                  <Input
                    id="database-name"
                    placeholder="Unity"
                    value={formData.databaseName}
                    onChange={(e) => setFormData(prev => ({ ...prev, databaseName: e.target.value }))}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Nombre de la base de datos donde se almacenarán tus recursos (por defecto: Unity)
                  </p>
                </div>
              </div>

              <Card className="p-4 bg-blue-50 border-blue-200">
                <h4 className="text-sm font-medium mb-2">💡 Consejos de Configuración</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• <strong>MongoDB Atlas:</strong> mongodb+srv://usuario:password@cluster.mongodb.net/</li>
                  <li>• <strong>MongoDB Local:</strong> mongodb://localhost:27017/</li>
                  <li>• <strong>Con autenticación:</strong> mongodb://usuario:password@host:27017/</li>
                  <li>• Asegúrate de que tu IP esté en la whitelist de MongoDB Atlas</li>
                </ul>
              </Card>
            </>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClear}>
            Limpiar Configuración
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={formData.isEnabled && (!formData.connectionString || !isValidConnection)}
            >
              Guardar Configuración
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
