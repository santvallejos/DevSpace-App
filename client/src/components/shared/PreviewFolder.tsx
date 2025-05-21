import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Interfaz que define las propiedades del componente PreviewFolder
 * @property {string} name - Nombre de la carpeta a mostrar
 * @property {Function} onClick - Función a ejecutar cuando se hace clic en la carpeta
 * @property {Function} onDelete - Función para eliminar la carpeta
 * @property {Function} onRename - Función para renombrar la carpeta
 * @property {Function} onMove - Función para mover la carpeta
 * @property {string} id - Identificador único de la carpeta
 */
interface PreviewFolderProps {
    name?: string;
    onClick?: () => void;
    /* onDelete?: (id: string) => void;
    onRename?: (id: string, newName: string) => void;
    onMove?: (id: string, targetFolderId: string) => void;
    id?: string; */
}

/**
 * Componente que muestra una vista previa de una carpeta con opciones para
 * eliminar, renombrar y mover la carpeta.
 * 
 * 
 * onDelete, onRename, onMove, id = "" 
 */
function PreviewFolder({ name = "Carpeta", onClick }: PreviewFolderProps) {
    // Estados para controlar la visibilidad del menú y los diálogos
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showRenameDialog, setShowRenameDialog] = useState(false);
    const [showMoveDialog, setShowMoveDialog] = useState(false);
    const [newFolderName, setNewFolderName] = useState(name);
    const [targetFolderId, setTargetFolderId] = useState("");
    
    // Referencias para el menú desplegable y el botón que lo activa
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    /**
     * Efecto para cerrar el menú cuando se hace clic fuera de él
     * Se activa solo cuando showMenu es true
     */
    useEffect(() => {
        // Función que maneja el clic fuera del menú
        const handleClickOutside = (event: MouseEvent) => {
            // Verifica si el clic fue fuera del menú y del botón
            if (
                menuRef.current && 
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current && 
                !buttonRef.current.contains(event.target as Node)
            ) {
                setShowMenu(false);
            }
        };

        // Solo agrega el event listener si el menú está visible
        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Limpieza del efecto al desmontar o cuando cambia showMenu
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    /**
     * Manejador para mostrar/ocultar el menú de opciones
     * Detiene la propagación para evitar que se active onClick de la carpeta
     */
    const toggleMenu = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    }, [showMenu]);

    /**
     * Manejador para mostrar el diálogo de eliminación
     */
    const handleDeleteClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        setShowDeleteDialog(true);
    }, []);

    /**
     * Manejador para mostrar el diálogo de renombrar
     * Inicializa el campo con el nombre actual
     */
    const handleRenameClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        setNewFolderName(name);
        setShowRenameDialog(true);
    }, [name]);

    /**
     * Manejador para mostrar el diálogo de mover
     */
    const handleMoveClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        setShowMoveDialog(true);
    }, []);

    /**
     * Manejador para eliminar la carpeta
     * Llama a la función onDelete proporcionada por el componente padre
     */
    /* const handleDelete = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (onDelete && id) {
            onDelete(id);
        }
        setShowDeleteDialog(false);
    }, [onDelete, id]); */

    /**
     * Manejador para renombrar la carpeta
     * Llama a la función onRename proporcionada por el componente padre
     */
    /* const handleRename = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (onRename && id && newFolderName.trim() !== "") {
            onRename(id, newFolderName);
        }
        setShowRenameDialog(false);
    }, [onRename, id, newFolderName]); */

    /**
     * Manejador para mover la carpeta
     * Llama a la función onMove proporcionada por el componente padre
     */
    /* const handleMove = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (onMove && id && targetFolderId.trim() !== "") {
            onMove(id, targetFolderId);
        }
        setShowMoveDialog(false);
    }, [onMove, id, targetFolderId]); */

    /**
     * Manejador para controlar la apertura/cierre de diálogos
     * Previene la navegación accidental al cerrar diálogos
     */
    const handleDialogOpenChange = useCallback((
        open: boolean, 
        setDialogState: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        if (!open) {
            // Usamos setTimeout para asegurar que el evento de clic no se propague
            setTimeout(() => {
                setDialogState(false);
            }, 0);
        } else {
            setDialogState(true);
        }
    }, []);

    /**
     * Manejador para cancelar un diálogo
     */
    const handleCancel = useCallback((
        e: React.MouseEvent, 
        setDialogState: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        e.stopPropagation();
        setDialogState(false);
    }, []);

    return (
        <div className="p-4 border rounded-md hover:bg-accent cursor-pointer">
            {/* Contenedor principal de la carpeta */}
            <div className="flex items-center justify-between" onClick={onClick}>
                {/* Icono y nombre de la carpeta */}
                <div className="flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-folder"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
                    </svg>
                    <span>{name}</span>
                </div>
                
                {/* Botón de opciones y menú desplegable */}
                <div className="relative">
                    <button
                        ref={buttonRef}
                        className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                        aria-label="Opciones de carpeta"
                        onClick={toggleMenu}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                        </svg>
                    </button>

                    {/* Menú desplegable con opciones */}
                    {showMenu && (
                        <div
                            ref={menuRef}
                            className="absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-lg z-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ul className="py-1">
                                <li>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={handleRenameClick}
                                    >
                                        Renombrar
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={handleMoveClick}
                                    >
                                        Mover
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        onClick={handleDeleteClick}
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Diálogo de confirmación para eliminar carpeta */}
            <Dialog 
                open={showDeleteDialog} 
                onOpenChange={(open) => handleDialogOpenChange(open, setShowDeleteDialog)}
            >
                <DialogContent onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>Eliminar carpeta</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar la carpeta "{name}"? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={(e) => handleCancel(e, setShowDeleteDialog)}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            variant="destructive"
                        >
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Diálogo para renombrar carpeta */}
            <Dialog 
                open={showRenameDialog} 
                onOpenChange={(open) => handleDialogOpenChange(open, setShowRenameDialog)}
            >
                <DialogContent onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>Renombrar carpeta</DialogTitle>
                        <DialogDescription>
                            Introduce un nuevo nombre para la carpeta.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nombre
                            </Label>
                            <Input
                                id="name"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                className="col-span-3"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={(e) => handleCancel(e, setShowRenameDialog)}
                        >
                            Cancelar
                        </Button>
                        <Button>
                            Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Diálogo para mover carpeta */}
            <Dialog 
                open={showMoveDialog} 
                onOpenChange={(open) => handleDialogOpenChange(open, setShowMoveDialog)}
            >
                <DialogContent onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>Mover carpeta</DialogTitle>
                        <DialogDescription>
                            Selecciona la carpeta de destino donde deseas mover "{name}".
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="destination" className="text-right">
                                Destino
                            </Label>
                            <div className="col-span-3">
                                {/* Aquí se podría implementar un selector de carpetas más avanzado */}
                                <Input
                                    id="destination"
                                    placeholder="Selecciona una carpeta de destino"
                                    value={targetFolderId}
                                    onChange={(e) => setTargetFolderId(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={(e) => handleCancel(e, setShowMoveDialog)}
                        >
                            Cancelar
                        </Button>
                        <Button>
                            Mover
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default PreviewFolder;