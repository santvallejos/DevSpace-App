import { useState } from 'react';
import EditResourceModal from '@/components/shared/modals/EditResourceModal';
import { Resource, UpdateResourceModel } from '@/models/resourceModel';

// Ejemplo de uso del EditResourceModal
function ExampleEditResourceModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Ejemplo de recurso para probar el modal de edición
    const exampleResource: Resource = {
        id: "example-modal-123",
        folderId: null,
        name: "Componente React Personalizado",
        description: "Un botón reutilizable con diferentes variantes",
        type: 1, // Código
        codeType: 4, // React
        value: `import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false
}) => {
  const baseClasses = 'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]} \${disabled ? 'opacity-50 cursor-not-allowed' : ''}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;`,
        favorite: true,
        createdOn: new Date()
    };

    const handleSave = async (id: string, updatedResource: UpdateResourceModel) => {
        console.log('🔄 Guardando recurso:', id);
        console.log('📝 Datos actualizados:', updatedResource);
        
        // Simular una llamada a la API con tiempo de carga realista
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('✅ Recurso actualizado exitosamente');
        alert('¡Recurso actualizado correctamente!');
        setIsModalOpen(false);
    };

    return (
        <div className="p-8 space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Ejemplo de EditResourceModal</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Este es un modal completamente personalizado sin dependencias de componentes UI externos.
                </p>
                
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    🎨 Abrir Modal de Edición
                </button>
            </div>

            <div className="max-w-4xl mx-auto bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    📄 Recurso de Ejemplo:
                </h3>
                
                <div className="space-y-3">
                    <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Nombre:</span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">{exampleResource.name}</span>
                    </div>
                    
                    <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Descripción:</span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">{exampleResource.description}</span>
                    </div>
                    
                    <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Tipo:</span>
                        <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-sm">
                            Código React
                        </span>
                    </div>
                    
                    <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Contenido:</span>
                        <div className="mt-2 bg-white dark:bg-gray-900 p-4 rounded border overflow-x-auto">
                            <pre className="text-xs text-gray-800 dark:text-gray-200">
                                {exampleResource.value}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">✨ Características del Modal:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Completamente personalizado (sin componentes UI externos)</li>
                    <li>• Campos adaptativos según el tipo de recurso</li>
                    <li>• Validaciones y manejo de errores</li>
                    <li>• Estados de carga durante el guardado</li>
                    <li>• Soporte para teclado (Escape para cerrar, Ctrl+Enter para guardar)</li>
                    <li>• Responsive design</li>
                    <li>• Tema claro/oscuro</li>
                </ul>
            </div>

            <EditResourceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                resource={exampleResource}
                onSave={handleSave}
            />
        </div>
    );
}

export default ExampleEditResourceModal;
