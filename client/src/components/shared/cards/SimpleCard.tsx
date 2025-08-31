import { useSimpleResourceStore } from '@/stores/SimpleResourceStore';

interface SimpleCardProps {
    id: string;
    name: string;
    description?: string;
    type: number;
    value: string;
    favorite: boolean;
}

function SimpleCard(props: SimpleCardProps) {
    console.log('🔄 SIMPLE CARD: Renderizando:', props.id);
    
    const { deleteResourceSimple } = useSimpleResourceStore();
    
    const handleDelete = async () => {
        console.log('🚀 SIMPLE: Iniciando eliminación...');
        try {
            await deleteResourceSimple(props.id);
            console.log('✅ SIMPLE: Eliminación completada');
        } catch (error) {
            console.error('❌ SIMPLE: Error:', error);
        }
    };
    
    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-medium text-sm">{props.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{props.description}</p>
            <p className="text-xs text-blue-600 mt-2">{props.value}</p>
            <span className="text-xs text-gray-400">ID: {props.id}</span>
            <button 
                onClick={handleDelete}
                className="mt-2 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
            >
                Eliminar
            </button>
        </div>
    );
}

export default SimpleCard;
