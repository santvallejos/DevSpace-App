import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Code, FileText } from "lucide-react";

// Tipos de recursos disponibles
export enum ResourceType {
    Url = 0,
    Code = 1,
    Text = 2
}

// Tipos de código disponibles
export enum CodeType {
    Html = 0,
    Css = 1,
    Javascript = 2,
    Typescript = 3,
    React = 4,
    Vue = 5,
    Angular = 6,
    Svelte = 7,
    PHP = 8,
    Python = 9,
    Java = 10,
    CSharp = 11,
    Ruby = 12,
    Go = 13,
    Rust = 14,
    Sql = 15,
    Markdown = 16,
    Json = 17
}

// Propiedades del selector de tipo de recurso
interface ResourceTypeSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectType: (type: ResourceType, codeType?: CodeType) => void;
}

// Componente de selector de tipo de recurso
function ResourceTypeSelector({ isOpen, onClose, onSelectType }: ResourceTypeSelectorProps) {
    // Maneja la selección de tipo URL
    const handleSelectUrl = () => {
        onSelectType(ResourceType.Url);
    };

    // Maneja la selección de tipo Código
    const handleSelectCode = (codeType: CodeType) => {
        onSelectType(ResourceType.Code, codeType);
    };

    // Maneja la selección de tipo Texto
    const handleSelectText = () => {
        onSelectType(ResourceType.Text);
    };

    // Lista de lenguajes de programación más populares
    const popularCodeTypes = [
        { type: CodeType.Javascript, name: "JavaScript" },
        { type: CodeType.Typescript, name: "TypeScript" },
        { type: CodeType.React, name: "React" },
        { type: CodeType.Python, name: "Python" },
        { type: CodeType.Html, name: "HTML" },
        { type: CodeType.Css, name: "CSS" },
        { type: CodeType.Json, name: "JSON" },
        { type: CodeType.Markdown, name: "Markdown" }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Select resource type</DialogTitle>
                    <DialogDescription>
                        Choose the type of resource you want to create
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-6 py-4">
                    {/* Tipo URL */}
                    <Card className="cursor-pointer transition-colors" onClick={handleSelectUrl}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-blue-500" />
                                URL / Enlace Web
                            </CardTitle>
                            <CardDescription>
                                Save links to web pages, online documents, videos, etc.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Tipo Texto */}
                    <Card className="cursor-pointer transition-colors" onClick={handleSelectText}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-green-500" />
                                Texto / Notas
                            </CardTitle>
                            <CardDescription>
                                Save notes, documentation, ideas or any plain text.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Tipo Código */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Code className="h-5 w-5 text-purple-500" />
                                Code / Snippets
                            </CardTitle>
                            <CardDescription>
                                Save code snippets, functions, components, etc.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {popularCodeTypes.map((codeType) => (
                                    <Button
                                        key={codeType.type}
                                        variant="outline"
                                        size="sm"
                                        className="justify-start h-auto p-3 text-left"
                                        onClick={() => handleSelectCode(codeType.type)}
                                    >
                                        <div>
                                            <div className="font-medium text-sm">{codeType.name}</div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ResourceTypeSelector;