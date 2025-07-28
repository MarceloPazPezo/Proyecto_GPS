import { useState } from 'react';
import { importUsers } from '@services/user.service';
import Swal from 'sweetalert2';

export function useImportUsers({ onSuccess }) {
  const [loading, setLoading] = useState(false);

  const mapUserData = (user) => ({
    nombreCompleto: user.nombreCompleto || user.fullName || user.nombre || '',
    rut: user.rut || '',
    email: user.email || '',
    password: user.password || '',
    rol: user.rol || 'usuario', // Valor por defecto
    idCarrera: user.idCarrera || user.carrera || null, // Opcional
  });

  const handleImport = async (users, options = {}) => {
    // Mapea todos los usuarios al formato correcto antes de validar/enviar
    const mappedUsers = users.map(mapUserData);
    const invalidRows = mappedUsers.filter(
      (u) => !u.rut || !u.email
    );
    if (invalidRows.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: 'Todos los usuarios deben tener RUT y Email.',
      });
      return false;
    }
    setLoading(true);
    try {
      const response = await importUsers(mappedUsers);
      // Normaliza la respuesta si viene anidada en .data
      const res = response?.data ? response.data : response;

      // Notificar a la tabla si se pasa el callback onImported
      if (typeof options.onImported === 'function') {
        console.log('Respuesta del servidor:', res);
        
        // indices importados
        const importedIndices = Array.isArray(res.imported)
          ? res.imported.map(u => u.index).filter(idx => idx !== null && idx !== undefined)
          : [];
        
        console.log('Índices importados:', importedIndices);
        
        // errores por fila
        const fieldMap = {
          nombreCompleto: 'nombreCompleto',
          email: 'email',
          rut: 'rut',
          password: 'password',
          rol: 'rol',
          idCarrera: 'idCarrera',
          carrera: 'idCarrera', // Mapeo alternativo
        };
        
        const errors = {};
        const invalidUsers = res.invalidUsers || res.details?.invalidUsers || [];
        
        console.log('Usuarios inválidos del servidor:', invalidUsers);
        
        invalidUsers.forEach(u => {
          console.log(`Procesando error para índice ${u.index}:`, u);
          
          if (Array.isArray(u.error)) {
            errors[u.index] = {};
            u.error.forEach(err => {
              let mappedField = err.field;
              if (mappedUsers[u.index] && !(mappedField in mappedUsers[u.index])) {
                mappedField = fieldMap[err.field] || err.field;
              }
              errors[u.index][mappedField] = err.message;
            });
          } else if (typeof u.error === 'string') {
            // Error general como string (ej: "Rut duplicado en base de datos")
            // Determinar el campo apropiado basado en el mensaje
            if (u.error.toLowerCase().includes('rut')) {
              errors[u.index] = { rut: u.error };
            } else if (u.error.toLowerCase().includes('email')) {
              errors[u.index] = { email: u.error };
            } else {
              // Error general que se muestra en el campo más relevante o en todos
              errors[u.index] = { _general: u.error };
            }
          } else {
            errors[u.index] = { _row: u.error || 'Error desconocido' };
          }
        });
        
        console.log('Errores procesados para la tabla:', errors);
        
        // SIEMPRE llamar onImported para actualizar la tabla
        options.onImported(importedIndices, errors);
      }

      // Si la respuesta tiene usuarios importados y al menos uno fue exitoso
      if (Array.isArray(res.imported) && res.imported.length > 0 && (!res.invalidUsers || res.invalidUsers.length === 0)) {
        // Solo cerrar el popup si TODOS los usuarios fueron importados correctamente
        Swal.fire({
          icon: 'success',
          title: 'Importación exitosa',
          text: `Se importaron ${res.imported.length} usuario(s) correctamente.`,
        });
        if (onSuccess) onSuccess();
        return true;
      } else if (Array.isArray(res.imported) && res.imported.length > 0 && Array.isArray(res.invalidUsers) && res.invalidUsers.length > 0) {
        // Importación parcial, NO cerrar el popup
        Swal.fire({
          icon: 'warning',
          title: 'Importación parcial',
          text: `Se importaron ${res.imported.length} usuarios con éxito. ${res.invalidUsers.length} usuarios no se pudieron importar.`,
        });
        return false;
      } else if (Array.isArray(res.invalidUsers) && res.invalidUsers.length > 0) {
        // Ningún usuario fue importado, NO cerrar el popup
        Swal.fire({
          icon: 'error',
          title: 'Ningún usuario fue importado',
          text: `${res.invalidUsers.length} usuarios no se pudieron importar. Revisa los errores en la tabla.`,
        });
        return false;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al importar',
          text: 'No se pudo importar ningún usuario.',
        });
        return false;
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al importar',
        text: error?.response?.data?.message || 'Ocurrió un error al importar usuarios.',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleImport, loading };
}
