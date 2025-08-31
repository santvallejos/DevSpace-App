import api from '../contexts/Api';
import axios from 'axios';

// Función de prueba para debuggear el problema
export const debugDeleteResource = async (id: string) => {
    console.log('🔍 Iniciando debug de eliminación...');
    console.log('📋 ID del recurso:', id);
    console.log('🌐 Base URL del API:', api.defaults.baseURL);
    
    try {
        console.log('⏱️ Enviando request DELETE...');
        const startTime = Date.now();
        
        const response = await api.delete(`Resource/${id}`);
        
        const endTime = Date.now();
        console.log('✅ Response recibida en:', endTime - startTime, 'ms');
        console.log('📊 Status:', response.status);
        console.log('📄 Data:', response.data);
        console.log('🎯 Headers:', response.headers);
        
        return response;
        
    } catch (error) {
        console.error('❌ Error completo:', error);
        
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error('📊 Response status:', error.response.status);
                console.error('📄 Response data:', error.response.data);
                console.error('🎯 Response headers:', error.response.headers);
            } else if (error.request) {
                console.error('📡 Request sin response:', error.request);
            }
        } else {
            console.error('⚙️ Error de configuración:', (error as Error).message);
        }
        
        throw error;
    }
};

// Función para probar timeout
export const testTimeout = async (id: string) => {
    console.log('⏰ Probando con timeout...');
    
    try {
        const response = await Promise.race([
            api.delete(`Resource/${id}`),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('TIMEOUT')), 5000)
            )
        ]);
        
        console.log('✅ Completado dentro del timeout');
        return response;
        
    } catch (error) {
        if ((error as Error).message === 'TIMEOUT') {
            console.error('⏰ Request tardó más de 5 segundos!');
        }
        throw error;
    }
};
