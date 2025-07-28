import { useState, useEffect } from 'react';
import { importMisUsuarios } from '@services/user.service';
import { getMisCarreras } from '@services/carrera.service';
import Swal from 'sweetalert2';

export function useImportMisUsuarios({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [misCarreras, setMisCarreras] = useState([]);

  // Obtener las carreras del encargado al cargar el hook
  useEffect(() => {
    const fetchMisCarreras = async () => {
      try {
        const response = await getMisCarreras();
        setMisCarreras(response.data || []);
      } catch (error) {
        console.error('Error al obtener mis carreras:', error);
        setMisCarreras([]);
      }
    };
    
    fetchMisCarreras();
  }, []);

  const mapUserData = (user) => {
    const mappedUser = {
      nombreCompleto: user["Nombre Completo"] || user["nombre completo"] || user.nombreCompleto || user.fullName || user.nombre || '',
      rut: user.RUT || user.rut || user.Rut || '',
      email: user.Email || user.email || user.correo || '',
      password: user.Password || user.password || user.contraseña || 'user1234',
      rol: user.Rol || user.rol || user.role || 'tutorado',
    };

    // Si no se proporciona carreraCodigo y hay carreras disponibles, usar la primera
    if (!user.carreraCodigo && !user["Carrera Codigo"] && !user["codigo carrera"] && misCarreras.length > 0) {
      mappedUser.carreraCodigo = misCarreras[0].codigo;
    } else {
      mappedUser.carreraCodigo = user.carreraCodigo || user["Carrera Codigo"] || user["codigo carrera"] || '';
    }

    return mappedUser;
  };

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
      const response = await importMisUsuarios(mappedUsers);
      // Normaliza la respuesta si viene anidada en .data
      const res = response?.data ? response.data : response;

      // Notificar a la tabla si se pasa el callback onImported
      if (typeof options.onImported === 'function') {
        // console.log('Respuesta del servidor:', res);
        
        // indices importados
        const importedIndices = Array.isArray(res.imported)
          ? res.imported.map(u => u.index).filter(idx => idx !== null && idx !== undefined)
          : [];
        
        // console.log('Índices importados:', importedIndices);
        
        // errores por fila
        const fieldMap = {
          nombreCompleto: 'nombreCompleto',
          email: 'email',
          rut: 'rut',
          password: 'password',
          carreraCodigo: 'carreraCodigo',
        };
        
        const errors = {};
        const invalidUsers = res.invalidUsers || res.details?.invalidUsers || [];
        
        // console.log('Usuarios inválidos del servidor:', invalidUsers);
        
        invalidUsers.forEach(u => {
          // console.log(`Procesando error para índice ${u.index}:`, u);
          
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
            } else if (u.error.toLowerCase().includes('carrera') || u.error.toLowerCase().includes('código')) {
              errors[u.index] = { carreraCodigo: u.error };
            } else {
              // Error general que se muestra en el campo más relevante o en todos
              errors[u.index] = { _general: u.error };
            }
          } else {
            errors[u.index] = { _row: u.error || 'Error desconocido' };
          }
        });
        
        // console.log('Errores procesados para la tabla:', errors);
        
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
