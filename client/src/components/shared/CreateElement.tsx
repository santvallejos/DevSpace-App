import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FolderTree from "@/components/shared/FolderTree";
import { useFolderStore } from "@/stores/FolderStore";
import { useState } from "react";

function CreateElment() {
    const [nameNewFolder, setNameNewFolder] = useState("");
    const {
        folderSelected,
        AddFolder,
    } = useFolderStore();

    const handleCreateFolder = async () => {
        const folderId = folderSelected[0]?.id || null;

        try {
            const newFolder = {
                name: nameNewFolder,
                parentFolderID: folderId,
            };

            await AddFolder(newFolder);

            setNameNewFolder("");
        } catch (error) {
            console.log("No se a creado la carpeta", error);
        }
    }

    return (
        <>
            <Dialog>
                <DialogTrigger>
                        + Folder
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleCreateFolder}>
                        <DialogTitle>Agregar una carpeta</DialogTitle>
                        <DialogDescription>
                            Crea una nueva carpeta para organizar tus recursos.
                        </DialogDescription>
                        <DialogHeader>
                            <Input type="text" placeholder="Name Folder" value={nameNewFolder} onChange={(e) => setNameNewFolder(e.target.value)} required />
                            <br />
                            <div>
                                La carpeta se guardara en: {folderSelected[0]?.name || 'Root'}
                            </div>
                            <span>Selecciona donde guardar la carpeta</span>
                            <FolderTree />
                        </DialogHeader>
                        <DialogFooter>
                            <Button type="submit">Add</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog>
                <DialogTrigger>
                        + Recurso
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Agregar un recurso</DialogTitle>
                        <DialogDescription>
                            Agrega un nuevo recurso a tu unidad.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateElment;