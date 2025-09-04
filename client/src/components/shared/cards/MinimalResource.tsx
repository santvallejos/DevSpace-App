import { Globe, Code2, FileText, MoreVertical, ExternalLink, Edit3, Move, Trash2, Star, Copy } from "lucide-react";
import { useState, useEffect } from "react";
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
import MoveResourceModal from "@/components/shared/modals/MoveResourceModal";
import { Resource, UpdateResourceModel, MoveResourceModel } from "@/models/resourceModel";
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
    const { deleteResource, updateResourceFavorite, updateResource, moveResource } = useResourceStore();
    const { id, name, description, type, codeType, value, favorite } = props;
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showMoveDialog, setShowMoveDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFavorite, setIsFavorite] = useState(favorite);

    // Sincronizar estado local con prop cuando cambie
    useEffect(() => {
        setIsFavorite(favorite);
    }, [favorite]);

    // Crear objeto Resource para el dialog de detalles
    const resourceForDialog: Resource = {
        id,
        name,
        description,
        type,
        codeType,
        value,
        favorite: isFavorite,
        folderId: null, // Asumimos null por defecto
        createdOn: new Date() // Fecha actual por defecto, podrías pasarla como prop si la tienes
    };

    // Función para obtener el icono según el tipo de recurso
    const getResourceIcon = () => {
        switch (type) {
            case 0: return <Globe className="w-6 h-6 text-blue-500" />;
            case 1: return <Code2 className="w-6 h-6 text-green-500" />;
            case 2: return <FileText className="w-6 h-6 text-purple-500" />;
            default: return <FileText className="w-6 h-6 text-gray-500" />;
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
            console.error("❌ Resource: Error deleting resource:", error);
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
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("❌ Error updating favorite:", error);
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
                    console.log('Text copied to clipboard:', value);
                })
                .catch((error) => {
                    console.error('Error copying text:', error);
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
            console.error("❌ Error updating resource:", error);
            throw error; // Re-lanzar para que el dialog pueda manejarlo
        }
    };

    const handleMove = () => {
        setShowDetailDialog(false); // Cerrar dialog de detalles si está abierto
        setShowMoveDialog(true);     // Abrir modal de mover
    };

    const handleSaveMove = async (resourceId: string, moveData: MoveResourceModel) => {
        try {
            await moveResource(resourceId, moveData);
        } catch (error) {
            console.error("❌ Error moving resource:", error);
            throw error; // Re-lanzar para que el modal pueda manejarlo
        }
    };

    return (
        <>
            <div 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                onClick={handleCardClick}
            >
                {/* Header Card: Icon, Name, Type and Options */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {/* Resource Icon */}
                        <div className="flex-shrink-0">
                            {getResourceIcon()}
                        </div>
                        
                        {/* Resource Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-semibold truncate text-black dark:text-white" title={name}>
                                    {name}
                                </h3>
                                {isFavorite && (
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                                )}
                            </div>
                            {type === 1 && getCodeLanguage() && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {getCodeLanguage()}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Options Menu */}
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
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite();
                            }}>
                                <Star className="mr-2 h-4 w-4" />
                                {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleEdit();
                            }}>
                                <Edit3 className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleMove();
                            }}>
                                <Move className="mr-2 h-4 w-4" />
                                Move
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick();
                                }}
                                className="text-red-600 focus:text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Quick Actions for URL */}
                {type === 0 && (
                    <div className="flex items-center space-x-2 mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopy();
                            }}
                            className="flex-1"
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy URL
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOpenLink();
                            }}
                            className="flex-1"
                        >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open
                        </Button>
                    </div>
                )}
            </div>

            {/* Dialog de confirmación para eliminar */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDeleteResource}
                title="Delete resource"
                description={`Are you sure you want to delete "${name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
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

            {/* Modal de mover del recurso */}
            <MoveResourceModal
                isOpen={showMoveDialog}
                onClose={() => setShowMoveDialog(false)}
                resource={resourceForDialog}
                onMove={handleSaveMove}
            />
        </>
    );
}

export default MinimalCardResource;
