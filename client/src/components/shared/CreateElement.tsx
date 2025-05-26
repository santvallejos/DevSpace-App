import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FolderTree from "@/components/shared/FolderTree";
import { useFolderStore } from "@/stores/FolderStore";
import { useResourceStore } from "@/stores/resourceStore";
import { useState } from "react";
import { CreateResourceModel } from "@/models/ResourceModel";

function CreateElment() {
    const [nameNewResource, setNameNewResource] = useState("");
    const [descriptionNewResource, setDescriptionNewResource] = useState("");
    const [urlNewResource, setUrlNewResource] = useState("");
    const [nameNewFolder, setNameNewFolder] = useState("");
    const {
        folderSelected,
        addFolder,
    } = useFolderStore();

    const {
        addResource,
    } = useResourceStore();

    const handleCreateFolder = async () => {
        const folderId = folderSelected[0]?.id || null;

        try {
            const newFolder = {
                name: nameNewFolder,
                parentFolderID: folderId,
            };

            await addFolder(newFolder);

            setNameNewFolder("");
        } catch (error) {
            console.log("No se a creado la carpeta", error);
        }
    }

    const handleCreateResource = async () => {
        try {
            const newResource: CreateResourceModel = {
                folderId: folderSelected[0]?.id || null,
                name: nameNewResource,
                description: descriptionNewResource,
                type: 0,
                url: urlNewResource,
                code: "",
                text: "",
            };

            await addResource(newResource);

            setNameNewResource("");
            setDescriptionNewResource("");
            setUrlNewResource("");
        } catch (error) {
            console.log("No se a creado el recurso", error);
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
                    <form action={handleCreateResource}>
                        <DialogHeader>
                            <DialogTitle>Agregar un recurso</DialogTitle>
                            <DialogDescription>
                                Agrega un nuevo recurso a tu unidad.
                            </DialogDescription>
                            <Input type="text" placeholder="Name Resource" value={nameNewResource} onChange={(e) => setNameNewResource(e.target.value)} required />
                            <Input type="text" placeholder="Decription Resource" value={descriptionNewResource} onChange={(e) => setDescriptionNewResource(e.target.value)} />
                            <Input type="text" placeholder="Url Resource" value={urlNewResource} onChange={(e) => setUrlNewResource(e.target.value)} />
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
        </>
    );
};

export default CreateElment;