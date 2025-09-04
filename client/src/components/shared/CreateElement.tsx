import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FolderTree from "@/components/shared/FolderTree";
import ResourceTypeSelector, { ResourceType, CodeType } from "@/components/shared/ResourceTypeSelector";
import ResourceForm from "@/components/shared/ResourceForm";
import { useFolderStore } from "@/stores/FolderStore";
import { useState } from "react";

function CreateElment() {
    const [nameNewFolder, setNameNewFolder] = useState("");
    const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
    const [isResourceTypeSelectorOpen, setIsResourceTypeSelectorOpen] = useState(false);
    const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);
    const [selectedResourceType, setSelectedResourceType] = useState<ResourceType>(ResourceType.Url);
    const [selectedCodeType, setSelectedCodeType] = useState<CodeType | undefined>(undefined);
    
    const {
        folderSelected,
        addFolder,
    } = useFolderStore();

    const handleCreateFolder = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        
        const folderId = folderSelected[0]?.id || null;

        try {
            const newFolder = {
                name: nameNewFolder,
                parentFolderID: folderId,
            };

            await addFolder(newFolder);
            
            // Si llegamos aquí, la carpeta se creó exitosamente
            setNameNewFolder("");
            setIsFolderDialogOpen(false);
        } catch (error) {
            console.log("Folder was not created", error);
        }
    }

    // Función para manejar la selección del tipo de recurso
    const handleResourceTypeSelect = (type: ResourceType, codeType?: CodeType) => {
        setSelectedResourceType(type);
        setSelectedCodeType(codeType);
        setIsResourceTypeSelectorOpen(false);
        setIsResourceFormOpen(true);
    };

    // Función para cerrar el formulario de recursos
    const handleResourceFormClose = () => {
        setIsResourceFormOpen(false);
        setSelectedCodeType(undefined);
    };

    return (
        <>
            <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
                <DialogTrigger>
                    <Button variant="outline">
                        + Folder
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleCreateFolder}>
                        <DialogTitle>Add a folder</DialogTitle>
                        <DialogDescription>
                            Create a new folder to organize your resources.
                        </DialogDescription>
                        <DialogHeader>
                            <Input type="text" placeholder="Folder Name" value={nameNewFolder} onChange={(e) => setNameNewFolder(e.target.value)} required />
                            <br />
                            <div>
                                The folder will be saved in: {folderSelected[0]?.name || 'Root'}
                            </div>
                            <span>Select where to save the folder</span>
                            <FolderTree />
                        </DialogHeader>
                        <DialogFooter>
                            <Button type="submit">Add</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Botón para abrir selector de tipo de recurso */}
            <Button 
                variant="outline" 
                onClick={() => setIsResourceTypeSelectorOpen(true)}
            >
                + Resource
            </Button>

            {/* Selector de tipo de recurso */}
            <ResourceTypeSelector
                isOpen={isResourceTypeSelectorOpen}
                onClose={() => setIsResourceTypeSelectorOpen(false)}
                onSelectType={handleResourceTypeSelect}
            />

            {/* Formulario de creación de recurso */}
            <ResourceForm
                isOpen={isResourceFormOpen}
                onClose={handleResourceFormClose}
                resourceType={selectedResourceType}
                codeType={selectedCodeType}
            />
        </>
    );
};

export default CreateElment;