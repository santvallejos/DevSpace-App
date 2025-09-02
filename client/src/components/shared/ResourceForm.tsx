import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FolderTree from "@/components/shared/FolderTree";
import { useFolderStore } from "@/stores/FolderStore";
import { useResourceStore } from "@/stores/ResourceStore";
import { useState } from "react";
import { CreateResourceModel } from "@/models/resourceModel";
import { ResourceType, CodeType } from "./ResourceTypeSelector";

interface ResourceFormProps {
    isOpen: boolean;
    onClose: () => void;
    resourceType: ResourceType;
    codeType?: CodeType;
}

function ResourceForm({ isOpen, onClose, resourceType, codeType }: ResourceFormProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [value, setValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { folderSelected } = useFolderStore();
    const { addResource } = useResourceStore();

    // Función para obtener el título del formulario según el tipo
    const getFormTitle = () => {
        switch (resourceType) {
            case ResourceType.Url:
                return "Agregar URL / Enlace";
            case ResourceType.Code:
                return `Agregar Código ${getCodeTypeName()}`;
            case ResourceType.Text:
                return "Agregar Texto / Notas";
            default:
                return "Agregar Recurso";
        }
    };

    // Función para obtener el nombre del tipo de código
    const getCodeTypeName = () => {
        if (codeType === undefined) return "";
        const codeTypeNames = {
            [CodeType.Html]: "HTML",
            [CodeType.Css]: "CSS",
            [CodeType.Javascript]: "JavaScript",
            [CodeType.Typescript]: "TypeScript",
            [CodeType.React]: "React",
            [CodeType.Vue]: "Vue",
            [CodeType.Angular]: "Angular",
            [CodeType.Svelte]: "Svelte",
            [CodeType.PHP]: "PHP",
            [CodeType.Python]: "Python",
            [CodeType.Java]: "Java",
            [CodeType.CSharp]: "C#",
            [CodeType.Ruby]: "Ruby",
            [CodeType.Go]: "Go",
            [CodeType.Rust]: "Rust",
            [CodeType.Sql]: "SQL",
            [CodeType.Markdown]: "Markdown",
            [CodeType.Json]: "JSON"
        };
        return codeTypeNames[codeType] || "";
    };

    // Función para obtener el placeholder del campo value según el tipo
    const getValuePlaceholder = () => {
        switch (resourceType) {
            case ResourceType.Url:
                return "https://ejemplo.com";
            case ResourceType.Code:
                return `Escribe tu código ${getCodeTypeName()} aquí...`;
            case ResourceType.Text:
                return "Escribe tus notas o texto aquí...";
            default:
                return "Valor del recurso";
        }
    };

    // Función para obtener la descripción del formulario
    const getFormDescription = () => {
        switch (resourceType) {
            case ResourceType.Url:
                return "Agrega un enlace web a tu colección de recursos.";
            case ResourceType.Code:
                return `Guarda un fragmento de código ${getCodeTypeName()} para uso futuro.`;
            case ResourceType.Text:
                return "Guarda notas, documentación o cualquier texto importante.";
            default:
                return "Agrega un nuevo recurso a tu unidad.";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const newResource: CreateResourceModel = {
                folderId: folderSelected[0]?.id || null,
                name: name,
                description: description,
                type: resourceType,
                codeType: resourceType === ResourceType.Code ? codeType : undefined,
                value: value,
            };

            await addResource(newResource);

            // Limpiar formulario y cerrar
            setName("");
            setDescription("");
            setValue("");
            onClose();
        } catch (error) {
            console.log("Error al crear el recurso:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        // Limpiar formulario al cerrar
        setName("");
        setDescription("");
        setValue("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{getFormTitle()}</DialogTitle>
                        <DialogDescription>
                            {getFormDescription()}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        {/* Campo Nombre */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre del recurso *</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Nombre descriptivo del recurso"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Campo Descripción */}
                        <div className="grid gap-2">
                            <Label htmlFor="description">Descripción (opcional)</Label>
                            <Input
                                id="description"
                                type="text"
                                placeholder="Descripción del recurso"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Campo Valor - Cambia según el tipo */}
                        <div className="grid gap-2">
                            <Label htmlFor="value">
                                {resourceType === ResourceType.Url ? "URL" : 
                                 resourceType === ResourceType.Code ? "Código" : "Contenido"}
                                {resourceType !== ResourceType.Text ? " *" : ""}
                            </Label>
                            {resourceType === ResourceType.Code || resourceType === ResourceType.Text ? (
                                <textarea
                                    id="value"
                                    className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder={getValuePlaceholder()}
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    required={resourceType === ResourceType.Code}
                                />
                            ) : (
                                <Input
                                    id="value"
                                    type="url"
                                    placeholder={getValuePlaceholder()}
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    required
                                />
                            )}
                        </div>

                        {/* Información de carpeta */}
                        <div className="grid gap-2">
                            <Label>Ubicación</Label>
                            <div className="text-sm text-muted-foreground">
                                Se guardará en: <strong>{folderSelected[0]?.name || 'Carpeta raíz'}</strong>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Selecciona una carpeta diferente si es necesario:
                            </div>
                            <FolderTree />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creando..." : "Crear Recurso"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ResourceForm;