import { useState } from 'react';
import { Button } from "@/components/ui/button";
import ResourceDetailDialog from '@/components/shared/dialog/ResourceDetailDialog';
import { Resource } from '@/models/resourceModel';

// Ejemplo de uso del ResourceDetailDialog
function ExampleResourceDetail() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Ejemplo de recurso para probar el dialog
    const exampleResource: Resource = {
        id: "example-id-123",
        folderId: null,
        name: "Ejemplo de Recurso",
        description: "Este es un ejemplo de recurso para demostrar el dialog de detalles",
        type: 1, // Código
        codeType: 2, // JavaScript
        value: `function ejemploFuncion() {
    console.log("¡Hola mundo!");
    return "Este es un ejemplo de código JavaScript";
}

ejemploFuncion();`,
        favorite: true,
        createdOn: new Date()
    };

    const handleEdit = (resource: Resource) => {
        console.log('Editar recurso:', resource);
        setIsDialogOpen(false);
        // Aquí irían las acciones de edición
    };

    const handleMove = (resource: Resource) => {
        console.log('Mover recurso:', resource);
        setIsDialogOpen(false);
        // Aquí irían las acciones de mover
    };

    const handleDelete = (resource: Resource) => {
        console.log('Eliminar recurso:', resource);
        setIsDialogOpen(false);
        // Aquí irían las acciones de eliminación
    };

    const handleToggleFavorite = (resource: Resource) => {
        console.log('Toggle favorito:', resource);
        // Aquí irían las acciones de favorito
    };

    return (
        <div className="p-8">
            <Button onClick={() => setIsDialogOpen(true)}>
                Ver Detalles del Recurso de Ejemplo
            </Button>

            <ResourceDetailDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                resource={exampleResource}
                onEdit={handleEdit}
                onMove={handleMove}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
            />
        </div>
    );
}

export default ExampleResourceDetail;
