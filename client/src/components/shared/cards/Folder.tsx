import { useState, useEffect, useRef } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFolderStore } from "@/stores/FolderStore";
import { RenameFolder, MoveFolder } from "@/models/FolderModel";
import FolderTree from "../FolderTree";

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
function PreviewFolder({ name = "Folder", onClick, id }: PreviewFolderProps) {
    const {
        folderSelected,
        deleteFolder,
        renameFolder,
        moveFolder
    } = useFolderStore();

    // Estados para los formularios y diálogos
    const [showMenu, setShowMenu] = useState(false);                    // Estado para mostrar/ocultar el menu
    const [showRenameDialog, setShowRenameDialog] = useState(false);    // Estado para diálogo de renombrar
    const [showMoveDialog, setShowMoveDialog] = useState(false);        // Estado para diálogo de mover
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);    // Estado para diálogo de eliminar
    const [newFolderName, setNewFolderName] = useState("");             // Nombre para renombrar           // ID de carpeta destino

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

    const handleMoveFolder = () => {
        // Logica para mover la carpeta
        const folderId = folderSelected[0]?.id || null;
        const moveFolderModel: MoveFolder = {
            parentFolderID: folderId,
        };
        moveFolder(id, moveFolderModel);
        setShowMoveDialog(false);
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
        <div className="group relative p-4 border rounded-lg hover:bg-accent/50 hover:border-primary/20 cursor-pointer transition-all duration-200 h-fit min-h-[4rem] flex flex-col justify-center">
            {/* Contenedor principal de la carpeta */}
            <div className="flex items-center justify-between gap-3" onClick={onClick}>
                {/* Icono y nombre de la carpeta */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="icon icon-tabler icons-tabler-outline icon-tabler-folder text-primary"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
                        </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <span 
                            className="block text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors duration-200"
                            title={name}
                        >
                            {name}
                        </span>
                    </div>
                </div>

                {/* Botón de opciones y menú desplegable */}
                <div className="relative flex-shrink-0">
                    <button
                        ref={buttonRef}
                        className="p-2 rounded-full hover:bg-gray-200/80 dark:hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                        aria-label="Opciones de carpeta"
                        onClick={toggleMenu}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
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
                            className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 backdrop-blur-sm"
                            onClick={stopPropagation}
                        >
                            <ul className="py-2">
                                <li>
                                    <button
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center gap-2"
                                        onClick={openRenameDialog}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                                        </svg>
                                        Rename
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center gap-2"
                                        onClick={openMoveDialog}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="5,9 2,12 5,15"/>
                                            <polyline points="9,5 12,2 15,5"/>
                                            <polyline points="15,19 12,22 9,19"/>
                                            <polyline points="19,9 22,12 19,15"/>
                                            <line x1="2" x2="22" y1="12" y2="12"/>
                                            <line x1="12" x2="12" y1="2" y2="22"/>
                                        </svg>
                                        Move
                                    </button>
                                </li>
                                <li>
                                    <hr className="my-1 border-gray-200 dark:border-gray-600" />
                                    <button
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 flex items-center gap-2"
                                        onClick={openDeleteDialog}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3,6 5,6 21,6"/>
                                            <path d="m19,6v14a2,2 0,0 1,-2,2H7a2,2 0,0 1,-2,-2V6m3,0V4a2,2 0,0 1,2,-2h4a2,2 0,0 1,2,2v2"/>
                                        </svg>
                                        Delete
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Diálogo de Renombrar */}
            <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
                <DialogContent onClick={stopPropagation} className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                            </svg>
                            Rename folder
                        </DialogTitle>
                        <DialogDescription>
                            Enter a new name for folder "{name}".
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRenameFolder}>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">
                                    New name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    placeholder="Enter the new name..."
                                    className="w-full"
                                    autoFocus
                                    onClick={stopPropagation}
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="outline" onClick={stopPropagation}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button type="submit" disabled={!newFolderName.trim()}>
                                    Save changes
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Diálogo de Mover */}
            <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
                <DialogContent onClick={stopPropagation} className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="5,9 2,12 5,15"/>
                                <polyline points="9,5 12,2 15,5"/>
                                <polyline points="15,19 12,22 9,19"/>
                                <polyline points="19,9 22,12 19,15"/>
                                <line x1="2" x2="22" y1="12" y2="12"/>
                                <line x1="12" x2="12" y1="2" y2="22"/>
                            </svg>
                            Move folder
                        </DialogTitle>
                        <DialogDescription>
                            Select the destination folder where you want to move "<span className="font-medium">{name}</span>".
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="mb-4 p-3 bg-muted/50 rounded-lg border">
                            <p className="text-sm text-muted-foreground">Selected destination:</p>
                            <p className="font-medium">{folderSelected[0]?.name || 'Root folder'}</p>
                        </div>
                        <div className="max-h-60 overflow-y-auto border rounded-lg">
                            <FolderTree />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" onClick={stopPropagation}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button onClick={handleMoveFolder}>
                                Move folder
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Diálogo de Eliminar */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent onClick={stopPropagation} className="sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                                <path d="M12 9v4"/>
                                <path d="M12 17h.01"/>
                            </svg>
                            Delete this folder?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            <p>If you delete the folder <span className='font-semibold text-foreground'>"{name}"</span>, all its subfolders and resources will also be deleted.</p>
                            <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                            onClick={handleDeleteFolder}
                        >
                            Delete folder
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default PreviewFolder;