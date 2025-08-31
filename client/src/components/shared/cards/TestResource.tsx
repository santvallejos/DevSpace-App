import { Globe, Code2, FileText, MoreVertical, Trash2, Star } from "lucide-react";
import { Button } from "@/components/shared/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';
import { useResourceStore } from '@/stores/ResourceStore';

interface ResourceProps {
    id: string
    name: string;
    description?: string;
    type: number;
    value: string;
    favorite: boolean;
}

function TestCardResource(props: ResourceProps) {
    console.log('🔄 TEST CARD: Renderizando:', props.id);
    
    const { deleteResource } = useResourceStore();
    const { id, name, description, type, value, favorite } = props;

    // ❌ QUITAMOS ESTOS useState PROBLEMÁTICOS:
    // const [isFavorite, setIsFavorite] = useState(favorite);
    // const [editName, setEditName] = useState(name);
    // const [editDescription, setEditDescription] = useState(description || "");
    // const [editValue, setEditValue] = useState(value);

    // ✅ SOLO MANTENEMOS los useState de diálogos (que no dependen de props):
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Función para obtener el icono según el tipo de recurso
    const getResourceIcon = () => {
        switch (type) {
            case 0: return <Globe className="w-6 h-6 text-blue-500" />;
            case 1: return <Code2 className="w-6 h-6 text-green-500" />;
            case 2: return <FileText className="w-6 h-6 text-purple-500" />;
            default: return <FileText className="w-6 h-6 text-gray-500" />;
        }
    };

    const getCodeType = () => {
        if (type !== 1) return "";
        const lowercaseValue = value.toLowerCase();
        if (lowercaseValue.includes('javascript') || lowercaseValue.includes('js')) return 'JavaScript';
        if (lowercaseValue.includes('python') || lowercaseValue.includes('py')) return 'Python';
        if (lowercaseValue.includes('html')) return 'HTML';
        if (lowercaseValue.includes('css')) return 'CSS';
        if (lowercaseValue.includes('typescript') || lowercaseValue.includes('ts')) return 'TypeScript';
        if (lowercaseValue.includes('java')) return 'Java';
        if (lowercaseValue.includes('c#') || lowercaseValue.includes('csharp')) return 'C#';
        if (lowercaseValue.includes('sql')) return 'SQL';
        return 'Code';
    };

    const handleDeleteResource = async () => {
        try {
            console.log('🚀 TEST: Iniciando eliminación...');
            await deleteResource(id);
            console.log('✅ TEST: Eliminación completada');
            setShowDeleteDialog(false);
        } catch (error) {
            console.error("❌ TEST: Error al eliminar el recurso:", error);
        }
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {getResourceIcon()}
                        <div>
                            <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
                            {description && (
                                <p className="text-sm text-gray-600 mt-1">{description}</p>
                            )}
                            {type === 1 && (
                                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md mt-2">
                                    {getCodeType()}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {favorite && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="text-sm text-gray-500 truncate">
                    {value}
                </div>
            </div>

            {/* Diálogo de confirmación para eliminar */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. El recurso "{name}" será eliminado permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteResource} className="bg-red-600 hover:bg-red-700">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default TestCardResource;
