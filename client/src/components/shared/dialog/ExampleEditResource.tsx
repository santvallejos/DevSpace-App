import { useState } from 'react';
import { Button } from "@/components/ui/button";
import EditResourceDialog from '@/components/shared/dialog/EditResourceDialog';
import { Resource, UpdateResourceModel } from '@/models/resourceModel';

// Ejemplo de uso del EditResourceDialog
function ExampleEditResource() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Ejemplo de recurso para probar el dialog de edición
    const exampleResource: Resource = {
        id: "example-edit-123",
        folderId: null,
        name: "Mi Función JavaScript",
        description: "Una función útil para validar emails",
        type: 1, // Código
        codeType: 2, // JavaScript
        value: `function validateEmail(email) {
    const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return regex.test(email);
}

// Ejemplo de uso
console.log(validateEmail("usuario@ejemplo.com")); // true
console.log(validateEmail("email-invalido"));       // false`,
        favorite: false,
        createdOn: new Date()
    };

    const handleSave = async (id: string, updatedResource: UpdateResourceModel) => {
        console.log('Guardando recurso:', id, updatedResource);
        
        // Simular una llamada a la API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Recurso actualizado exitosamente');
        setIsDialogOpen(false);
    };

    return (
        <div className="p-8 space-y-4">
            <Button onClick={() => setIsDialogOpen(true)}>
                Editar Recurso de Ejemplo
            </Button>

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Recurso de Ejemplo:</h3>
                <p><strong>Nombre:</strong> {exampleResource.name}</p>
                <p><strong>Descripción:</strong> {exampleResource.description}</p>
                <p><strong>Tipo:</strong> Código JavaScript</p>
                <div className="mt-2">
                    <strong>Contenido:</strong>
                    <pre className="text-xs bg-white dark:bg-gray-900 p-2 rounded mt-1 overflow-x-auto">
                        {exampleResource.value}
                    </pre>
                </div>
            </div>

            <EditResourceDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                resource={exampleResource}
                onSave={handleSave}
            />
        </div>
    );
}

export default ExampleEditResource;
