import { useState, useEffect, useRef } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFolderStore } from "@/stores/FolderStore";
import { RenameFolder } from "@/models/FolderModel";

/**
 * Interfaz que define las propiedades del componente PreviewFolder
 * @property {string} name - Nombre de la carpeta a mostrar
 * @property {Function} onClick - Función a ejecutar cuando se hace clic en la carpeta
 */
interface PreviewFolderProps {
    id: string;
    name?: string;
    onClick?: () => void;
    // Estas propiedades se pueden agregar cuando se implementen las funcionalidades
    // onDelete?: (id: string) => void;
    // onRename?: (id: string, newName: string) => void;
    // onMove?: (id: string, targetFolderId: string) => void;
    // id?: string;
}

/**
 * Componente que muestra una vista previa de una carpeta con opciones para
 * eliminar, renombrar y mover la carpeta.
 */
function PreviewFolder({ name = "Carpeta", onClick, id}: PreviewFolderProps) {
    const {
        deleteFolder,
        renameFolder,
    } = useFolderStore();

    // Estados para los formularios y diálogos
    const [showMenu, setShowMenu] = useState(false);                // Estado para mostrar/ocultar el menu
    const [showRenameDialog, setShowRenameDialog] = useState(false); // Estado para diálogo de renombrar
    const [showMoveDialog, setShowMoveDialog] = useState(false);     // Estado para diálogo de mover
    const [showDeleteDialog, setShowDeleteDialog] = useState(false); // Estado para diálogo de eliminar
    const [newFolderName, setNewFolderName] = useState("");       // Nombre para renombrar
    const [targetFolderId, setTargetFolderId] = useState("");       // ID de carpeta destino

    // Referencias para el menú desplegable y el botón
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    /**
     * Efecto para cerrar el menú cuando se hace clic fuera de él
     */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Verifica si el clic fue fuera del menú y del botón
            if (menuRef.current && !menuRef.current.contains(event.target as Node) && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    /**
     * Manejador para mostrar/ocultar el menú de opciones
     */
    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    /**
     * Manejador para prevenir la propagación de eventos
     */
    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    /**
     * Manejadores para abrir diálogos
     */
    const openRenameDialog = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        setShowRenameDialog(true);
    };

    const handleRenameFolder = async () => {
        const renameFolderModel: RenameFolder = {
            name: newFolderName,
        }
        await renameFolder(id, renameFolderModel);
        setShowRenameDialog(false);
    }

    const openMoveDialog = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        setShowMoveDialog(true);
    };

    const openDeleteDialog = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        setShowDeleteDialog(true);
    };

    const handleDeleteFolder = async () => {
        await deleteFolder(id);
        setShowDeleteDialog(false);
    }

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
                            onClick={stopPropagation}
                        >
                            <ul className="py-1">
                                <li>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={openRenameDialog}
                                    >
                                        Renombrar
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={openMoveDialog}
                                    >
                                        Mover
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        onClick={openDeleteDialog}
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Diálogo de Renombrar */}
            <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
                <DialogContent onClick={stopPropagation}>
                    <DialogHeader>
                        <DialogTitle>Renombrar carpeta</DialogTitle>
                        <DialogDescription>
                            Introduce un nuevo nombre para la carpeta.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRenameFolder}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nombre
                            </Label>
                            <Input
                                type="text"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                className="col-span-3"
                                autoFocus
                                onClick={stopPropagation}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={stopPropagation}>
                                Cancelar
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="submit">
                                Guardar
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Diálogo de Mover */}
            <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
                <DialogContent onClick={stopPropagation}>
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
                                <Input
                                    id="destination"
                                    placeholder="Selecciona una carpeta de destino"
                                    value={targetFolderId}
                                    onChange={(e) => setTargetFolderId(e.target.value)}
                                    onClick={stopPropagation}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={stopPropagation}>
                                Cancelar
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button onClick={stopPropagation}>
                                Mover
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Diálogo de Eliminar */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent onClick={stopPropagation}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Do you want to delete this folder?</AlertDialogTitle>
                        <AlertDialogDescription>If you want to delete the<span className='font-bold text-black dark:text-white'> {name} </span>folder, its folders and resources will also be deleted.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel >Cancel</AlertDialogCancel>
                        <AlertDialogAction className="btn btn-error hover:text-white hover:bg-red-500" onClick={handleDeleteFolder}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default PreviewFolder;