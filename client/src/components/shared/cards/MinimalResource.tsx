import { Globe, Code2, FileText, MoreVertical, ExternalLink, Edit3, Move, Trash2, Star, Copy } from "lucide-react";
import { useState } from "react";
import { useResourceStore } from '@/stores/ResourceStore';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/dialog/ConfirmDialog";
import ResourceDetailDialog from "@/components/shared/dialog/ResourceDetailDialog";
import EditResourceModal from "@/components/shared/modals/EditResourceModal";
import { Resource, UpdateResourceModel } from "@/models/resourceModel";
interface ResourceProps {
    id: string
    name: string;
    description?: string;
    type: number;
    codeType?: number;
    value: string;
    favorite: boolean;
}

function MinimalCardResource(props: ResourceProps) {
    const { deleteResource, updateResourceFavorite, updateResource } = useResourceStore();
    const { id, name, description, type, codeType, value, favorite } = props;
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Crear objeto Resource para el dialog de detalles
    const resourceForDialog: Resource = {
        id,
        name,
        description,
        type,
        codeType,
        value,
        favorite,
        folderId: null, // Asumimos null por defecto
        createdOn: new Date() // Fecha actual por defecto, podrías pasarla como prop si la tienes
    };

    // Función para obtener el icono según el tipo de recurso
    const getResourceIcon = () => {
        switch (type) {
            case 0: return <Globe className="w-5 h-5 text-blue-500" />;
            case 1: return <Code2 className="w-5 h-5 text-green-500" />;
            case 2: return <FileText className="w-5 h-5 text-purple-500" />;
            default: return <FileText className="w-5 h-5 text-gray-500" />;
        }
    };

    // Función para obtener el nombre del lenguaje de programación
    const getCodeLanguage = () => {
        if (type !== 1 || codeType === undefined) return null;
        
        const codeTypeNames: { [key: number]: string } = {
            0: "HTML",
            1: "CSS", 
            2: "JavaScript",
            3: "TypeScript",
            4: "React",
            5: "Vue",
            6: "Angular",
            7: "Svelte",
            8: "PHP",
            9: "Python",
            10: "Java",
            11: "C#",
            12: "Ruby",
            13: "Go",
            14: "Rust",
            15: "SQL",
            16: "Markdown",
            17: "JSON"
        };
        
        return codeTypeNames[codeType] || "Code";
    };

    const handleDeleteResource = async () => {
        setIsDeleting(true);
        try {
            await deleteResource(id);
            setShowDeleteDialog(false);
        } catch (error) {
            console.error("❌ Resource: Error al eliminar el recurso:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    const handleCardClick = () => {
        setShowDetailDialog(true);
    };

    const handleCloseDetailDialog = () => {
        setShowDetailDialog(false);
    };

    const handleToggleFavorite = async () => {
        try {
            await updateResourceFavorite(id);
        } catch (error) {
            console.error("❌ Error al actualizar favorito:", error);
        }
    };

    const handleOpenLink = () => {
        if (type === 0 && value) {
            // Asegurarse de que la URL tenga protocolo
            const url = value.startsWith('http') ? value : `https://${value}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    const handleCopy = () => {
        if (type === 1 || type === 0 && value) {
            navigator.clipboard.writeText(value)
                .then(() => {
                    console.log('Texto copiado al portapapeles:', value);
                })
                .catch((error) => {
                    console.error('Error al copiar el texto:', error);
                });
        }
    };

    const handleEdit = () => {
        setShowDetailDialog(false); // Cerrar dialog de detalles
        setShowEditDialog(true);    // Abrir dialog de edición
    };

    const handleSaveEdit = async (resourceId: string, updatedResource: UpdateResourceModel) => {
        try {
            await updateResource(resourceId, updatedResource);
            // El store se encargará de actualizar la UI automáticamente
        } catch (error) {
            console.error("❌ Error al actualizar el recurso:", error);
            throw error; // Re-lanzar para que el dialog pueda manejarlo
        }
    };

    const handleMove = () => {
        // TODO: Implementar función de mover
        console.log('Mover recurso:', id);
    };

    return (
        <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all duration-300 group"
        >
            {/* Header con icono, título y menú de opciones */}
            <div className="flex items-start justify-between mb-3">
                <div 
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                    onClick={handleCardClick}
                >
                    <div className="flex-shrink-0">
                        {getResourceIcon()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100 truncate">
                                {name}
                            </h3>
                            {favorite && (
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                            )}
                        </div>
                        {type === 1 && getCodeLanguage() && (
                            <span className="inline-block text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full mt-1">
                                {getCodeLanguage()}
                            </span>
                        )}
                        {description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                
                {/* Menú de opciones */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={handleEdit}>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleMove}>
                            <Move className="mr-2 h-4 w-4" />
                            Mover
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleToggleFavorite}>
                            <Star className={`mr-2 h-4 w-4 ${favorite ? 'fill-current text-yellow-400' : ''}`} />
                            {favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            onClick={handleDeleteClick}
                            className="text-red-600 dark:text-red-400"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            
            {/* Contenido del valor con botón de enlace si es URL */}
            <div className="flex items-center justify-between">
                <div 
                    className="text-sm text-gray-500 dark:text-gray-400 truncate flex-1 mr-2 cursor-pointer"
                    onClick={handleCardClick}
                >
                    {value}
                </div>
                {type === 0 && value && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOpenLink();
                        }}
                        className="h-8 w-8 p-0 flex-shrink-0"
                        title="Abrir enlace"
                    >
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                )}
                {type === 1 || type === 0 && value && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCopy();
                        }}
                        className="h-8 w-8 p-0 flex-shrink-0"
                        title="Copiar"
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Dialog de confirmación para eliminar */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDeleteResource}
                title="Eliminar recurso"
                description={`¿Estás seguro de que deseas eliminar "${name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                isDestructive={true}
                isLoading={isDeleting}
            />

            {/* Dialog de detalles del recurso */}
            <ResourceDetailDialog
                isOpen={showDetailDialog}
                onClose={handleCloseDetailDialog}
                resource={resourceForDialog}
                onEdit={handleEdit}
                onMove={handleMove}
                onDelete={() => {
                    handleCloseDetailDialog();
                    handleDeleteClick();
                }}
                onToggleFavorite={() => {
                    handleToggleFavorite();
                    handleCloseDetailDialog();
                }}
            />

            {/* Modal de edición del recurso */}
            <EditResourceModal
                isOpen={showEditDialog}
                onClose={() => setShowEditDialog(false)}
                resource={resourceForDialog}
                onSave={handleSaveEdit}
            />
        </div>
    );
}

export default MinimalCardResource;
