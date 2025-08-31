import { Globe, Code2, FileText, Trash2 } from "lucide-react";
import { useResourceStore } from '@/stores/ResourceStore';

interface ResourceProps {
    id: string
    name: string;
    description?: string;
    type: number;
    value: string;
    favorite: boolean;
}

function MinimalCardResource(props: ResourceProps) {
    console.log('🔄 MINIMAL CARD: Renderizando:', props.id);
    
    const { deleteResource } = useResourceStore();
    const { id, name, description, type, value } = props;

    // Función para obtener el icono según el tipo de recurso
    const getResourceIcon = () => {
        switch (type) {
            case 0: return <Globe className="w-6 h-6 text-blue-500" />;
            case 1: return <Code2 className="w-6 h-6 text-green-500" />;
            case 2: return <FileText className="w-6 h-6 text-purple-500" />;
            default: return <FileText className="w-6 h-6 text-gray-500" />;
        }
    };

    const handleDeleteResource = async () => {
        try {
            console.log('🚀 MINIMAL: Iniciando eliminación...');
            await deleteResource(id);
            console.log('✅ MINIMAL: Eliminación completada');
        } catch (error) {
            console.error("❌ MINIMAL: Error al eliminar el recurso:", error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {getResourceIcon()}
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
                        {description && (
                            <p className="text-sm text-gray-600 mt-1">{description}</p>
                        )}
                    </div>
                </div>
                
                <button 
                    onClick={handleDeleteResource}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar recurso"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            
            <div className="text-sm text-gray-500 truncate">
                {value}
            </div>
        </div>
    );
}

export default MinimalCardResource;
