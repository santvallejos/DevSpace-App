import { useState } from 'react';
import { Copy, MoreVertical, ExternalLink, Star, Edit, Move, Trash2, Globe, Code2, FileText } from "lucide-react"
import { Button } from "@/components/shared/Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { useResourceStore } from '@/stores/resourceStore';
import { MoveResourceModel, UpdateResourceModel } from '@/models/ResourceModel';
import { useFolderStore } from '@/stores/FolderStore';
import FolderTree from '../FolderTree';

interface ResourceProps {
    id: string
    name: string;
    description?: string;
    type: number;
    value: string;
    favorite: boolean;
    onDelete?: (resourceId: string) => void;
}

function CardResource(props: ResourceProps) {
    const {
        updateResource,
        updateResourceFavorite,
        moveResource,
        deleteResource
    } = useResourceStore();

    const {
        folderSelected
    } = useFolderStore();

    const { id, name, description, type, value, favorite } = props;
    const [isFavorite, setIsFavorite] = useState(favorite);

    // Estados para el formulario de edición
    const [editName, setEditName] = useState(name);
    const [editDescription, setEditDescription] = useState(description || "");
    const [editValue, setEditValue] = useState(value);

    // Estados para controlar los diálogos
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showMoveDialog, setShowMoveDialog] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);

    // Función para obtener el icono según el tipo de recurso
    const getResourceIcon = () => {
        switch (type) {
            case 0: // URL
                return <Globe className="w-6 h-6 text-blue-500" />;
            case 1: // Code
                return <Code2 className="w-6 h-6 text-green-500" />;
            case 2: // Text
                return <FileText className="w-6 h-6 text-purple-500" />;
            default:
                return <FileText className="w-6 h-6 text-gray-500" />;
        }
    };

    // Función para obtener el tipo de código (simplificada)
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
            await deleteResource(id);
            setShowDeleteDialog(false);
            console.log("Recurso eliminado con éxito");
        } catch (error) {
            console.error("Error al eliminar el recurso:", error);
        }
    };

    const handleUpdateResource = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const editResource: UpdateResourceModel = {
                name: editName,
                description: editDescription,
                value: editValue,
            }

            await updateResource(id, editResource);
            setShowEditDialog(false);
            console.log("Recurso actualizado con éxito");
        } catch (error) {
            console.error("Error al actualizar el recurso:", error);
        }
    };

    const handleResourceFavorite = async () => {
        try {
            await updateResourceFavorite(id);
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Error al marcar/desmarcar como favorito:", error);
        }
    }

    const handleMoveResource = async () => {
        try {
            const folderId: MoveResourceModel = {
                folderId: folderSelected[0]?.id || null
            }
            await moveResource(id, folderId);
            setShowMoveDialog(false);
            console.log("Recurso movido con éxito");
        } catch (error) {
            console.error("Error al mover el recurso:", error);
        }
    }

    const handleOpenResource = () => {
        setShowViewDialog(true);
    };

    const handleOpenUrlDirectly = () => {
        if (type === 0) {
            window.open(value, '_blank');
        }
    };

    const renderResourcePreview = () => {
        switch (type) {
            case 0: // URL type
                return (
                    <div className="w-full">
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Input
                                    id="link"
                                    defaultValue={value}
                                    readOnly
                                />
                            </div>
                            <Button
                                type="button"
                                size="sm"
                                className="px-3 hover:bg-blue-500"
                                onClick={() => navigator.clipboard.writeText(value)}
                            >
                                <Copy />
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                className="px-3 hover:bg-green-500"
                                onClick={() => window.open(value, '_blank')}
                            >
                                <ExternalLink />
                            </Button>
                        </div>
                    </div>
                );
            case 1: // Code type
                return (
                    <div>
                        <div className="font-medium mb-2 text-gray-700 dark:text-gray-300">Code Snippet</div>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-sm overflow-x-auto overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                            <pre className="whitespace-pre-wrap break-all">{value}</pre>
                        </div>
                        {value && (
                            <button
                                className="mt-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1"
                                onClick={() => navigator.clipboard.writeText(value)}
                            >
                                <Copy className="w-4 h-4" />
                                Copy Code
                            </button>
                        )}
                    </div>
                );
            case 2: // Text type
                return (
                    <div>
                        <div className="font-medium mb-2 text-gray-700 dark:text-gray-300">Text Content</div>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                            <p className="whitespace-pre-wrap break-all">{value}</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                onClick={handleOpenResource}
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
                                <h3 className="text-lg font-semibold truncate dark:text-white" title={name}>
                                    {name}
                                </h3>
                                {isFavorite && (
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                                )}
                            </div>
                            {type === 1 && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {getCodeType()}
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
                            <DropdownMenuItem onClick={handleOpenResource}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Ver detalles
                            </DropdownMenuItem>
                            {type === 0 && (
                                <DropdownMenuItem onClick={handleOpenUrlDirectly}>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Abrir en nueva pestaña
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={handleResourceFavorite}>
                                <Star className="mr-2 h-4 w-4" />
                                {isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowMoveDialog(true)}>
                                <Move className="mr-2 h-4 w-4" />
                                Mover
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onClick={() => setShowDeleteDialog(true)}
                                className="text-red-600 focus:text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
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
                                navigator.clipboard.writeText(value);
                            }}
                            className="flex-1"
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar URL
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(value, '_blank');
                            }}
                            className="flex-1"
                        >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Abrir
                        </Button>
                    </div>
                )}
            </div>

            {/* View Dialog */}
            <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{name}</DialogTitle>
                        <DialogDescription>
                            <span className="font-medium">Descripción:</span> {description || "No hay descripción disponible."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 mb-4">
                        {renderResourcePreview()}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cerrar
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <AlertDialogContent>
                    <form onSubmit={handleUpdateResource}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Editar Recurso</AlertDialogTitle>
                            <AlertDialogDescription>
                                Modifica la información del recurso.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="edit-name">Nombre</Label>
                                <Input
                                    id="edit-name"
                                    type="text"
                                    placeholder="Nombre"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="edit-description">Descripción</Label>
                                <textarea
                                    id="edit-description"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                                    rows={3}
                                    placeholder="Descripción del recurso"
                                />
                            </div>

                            <div>
                                <Label htmlFor="edit-value">
                                    {type === 0 ? 'URL' : type === 1 ? 'Código' : 'Texto'}
                                </Label>
                                {type === 0 && (
                                    <Input
                                        id="edit-value"
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        placeholder="https://example.com"
                                    />
                                )}

                                {type === 1 && (
                                    <textarea
                                        id="edit-value"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="w-full h-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none font-mono text-sm"
                                        rows={8}
                                        placeholder="// Escribe tu código aquí"
                                    />
                                )}

                                {type === 2 && (
                                    <textarea
                                        id="edit-value"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="w-full h-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                                        rows={8}
                                        placeholder="Escribe tu texto aquí"
                                    />
                                )}
                            </div>
                        </div>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <Button type="submit">Guardar Cambios</Button>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>

            {/* Move Dialog */}
            <AlertDialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Mover Recurso</AlertDialogTitle>
                        <AlertDialogDescription>
                            Selecciona la carpeta de destino para este recurso.
                        </AlertDialogDescription>
                        <div className="py-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Destino: <span className="font-medium">{folderSelected[0]?.name || 'Raíz'}</span>
                            </p>
                            <FolderTree />
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleMoveResource}>Mover</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro de que quieres eliminar este recurso?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Estás a punto de eliminar el recurso <span className="font-bold text-black dark:text-white">{name}</span>.
                            Permanecerá en la papelera por 30 días y luego será eliminado automáticamente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDeleteResource}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default CardResource;
