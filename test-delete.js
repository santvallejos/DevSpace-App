// Prueba simple del servicio de eliminación
const testDelete = async () => {
    try {
        console.log('Iniciando prueba de eliminación...');
        
        // Primero obtener algunos recursos
        const getResponse = await fetch('http://localhost:5250/api/Resource/root');
        const resources = await getResponse.json();
        console.log('Recursos disponibles:', resources.length);
        
        if (resources.length > 0) {
            const resourceToDelete = resources[0];
            console.log('Intentando eliminar recurso:', resourceToDelete.id);
            
            const deleteResponse = await fetch(`http://localhost:5250/api/Resource/${resourceToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Status de eliminación:', deleteResponse.status);
            console.log('Response OK:', deleteResponse.ok);
            
            if (deleteResponse.ok) {
                console.log('✅ Eliminación exitosa');
            } else {
                console.log('❌ Error en eliminación:', await deleteResponse.text());
            }
        } else {
            console.log('No hay recursos para eliminar');
        }
        
    } catch (error) {
        console.error('Error en la prueba:', error);
    }
};

testDelete();
