import { AxiosError } from 'axios';

export interface MongoDBError {
  isMongoDBError: boolean;
  message: string;
  type: 'CONNECTION' | 'AUTHENTICATION' | 'VALIDATION' | 'UNKNOWN';
}

export const parseMongoDBError = (error: AxiosError): MongoDBError => {
  const defaultError: MongoDBError = {
    isMongoDBError: false,
    message: 'Error desconocido',
    type: 'UNKNOWN'
  };

  if (!error.response) {
    return defaultError;
  }

  const status = error.response.status;
  const data = error.response.data;
  const message = typeof data === 'string' ? data : (data as { message?: string })?.message || '';

  // Detectar errores relacionados con MongoDB
  const isMongoDBRelated = 
    message.toLowerCase().includes('mongodb') ||
    message.toLowerCase().includes('connection') ||
    message.toLowerCase().includes('database') ||
    status === 400 && message.toLowerCase().includes('string');

  if (!isMongoDBRelated) {
    return defaultError;
  }

  let type: MongoDBError['type'] = 'UNKNOWN';
  let friendlyMessage = '';

  if (status === 400) {
    if (message.includes('Connection string cannot be empty')) {
      type = 'VALIDATION';
      friendlyMessage = 'La connection string no puede estar vacía';
    } else if (message.includes('Invalid MongoDB connection string')) {
      type = 'VALIDATION';
      friendlyMessage = 'El formato de la connection string es inválido';
    } else {
      type = 'VALIDATION';
      friendlyMessage = 'Error de validación en la configuración de MongoDB';
    }
  } else if (status === 500) {
    if (message.includes('Failed to establish database connection')) {
      type = 'CONNECTION';
      friendlyMessage = 'No se pudo conectar a la base de datos. Verifica tu connection string y conectividad.';
    } else if (message.includes('authentication')) {
      type = 'AUTHENTICATION';
      friendlyMessage = 'Error de autenticación. Verifica tu usuario y contraseña.';
    } else {
      type = 'CONNECTION';
      friendlyMessage = 'Error interno del servidor al conectar con MongoDB';
    }
  }

  return {
    isMongoDBError: true,
    message: friendlyMessage || message,
    type
  };
};

export const getMongoDBErrorAdvice = (error: MongoDBError): string[] => {
  const advice: string[] = [];

  switch (error.type) {
    case 'CONNECTION':
      advice.push('• Verifica que tu connection string sea correcta');
      advice.push('• Asegúrate de que MongoDB esté ejecutándose');
      advice.push('• Confirma que tu IP esté en la whitelist (MongoDB Atlas)');
      advice.push('• Verifica la conectividad de red');
      break;
    
    case 'AUTHENTICATION':
      advice.push('• Verifica tu usuario y contraseña');
      advice.push('• Confirma que el usuario tenga permisos en la base de datos');
      advice.push('• Revisa la configuración de autenticación en MongoDB');
      break;
    
    case 'VALIDATION':
      advice.push('• Verifica el formato de la connection string');
      advice.push('• Ejemplos válidos:');
      advice.push('  - mongodb+srv://user:pass@cluster.mongodb.net/');
      advice.push('  - mongodb://localhost:27017/');
      break;
    
    default:
      advice.push('• Verifica la configuración de MongoDB');
      advice.push('• Consulta los logs del servidor para más detalles');
      break;
  }

  return advice;
};

// Hook para mostrar notificaciones de error
export const useMongoDBErrorHandler = () => {
  const handleError = (error: AxiosError) => {
    const mongoError = parseMongoDBError(error);
    
    if (mongoError.isMongoDBError) {
      console.error('MongoDB Error:', mongoError);
      
      // Aquí podrías integrar con un sistema de notificaciones
      // Por ejemplo, si usas react-toast:
      // toast.error(mongoError.message, {
      //   description: getMongoDBErrorAdvice(mongoError).join('\n')
      // });
      
      return mongoError;
    }
    
    return null;
  };

  return { handleError };
};
