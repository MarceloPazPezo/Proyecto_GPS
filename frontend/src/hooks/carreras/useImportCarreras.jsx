import { useState } from 'react';
import { importCarreras } from '@services/carrera.service';
import Swal from 'sweetalert2';

export function useImportCarreras({ onSuccess }) {
  const [loading, setLoading] = useState(false);

  const mapCarreraData = (carrera) => ({
    nombre: carrera.nombre || carrera.name || '',
    codigo: carrera.codigo || '',
    descripcion: carrera.descripcion || '',
    departamento: carrera.departamento || '',
    rutEncargado: carrera.rutEncargado || '',
  });

  const handleImport = async (carreras, options = {}) => {
    // Mapea todos los usuarios al formato correcto antes de validar/enviar
    const mappedCarreras = carreras.map(mapCarreraData);
    const invalidRows = mappedCarreras.filter(
      (u) => !u.codigo || !u.rutEncargado
    );
    if (invalidRows.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: 'Todas las carreras deben tener codigo y rut del encargado.',
      });
      return false;
    }
    setLoading(true);
    try {
      const response = await importCarreras(mappedCarreras);
      const res = response?.data ? response.data : response;

      if (typeof options.onImported === 'function') {
        const importedIndices = Array.isArray(res.imported)
          ? res.imported.map(u => u.index).filter(idx => idx !== null && idx !== undefined)
          : [];
        const fieldMap = {
          nombre: 'nombre',
          codigo: 'codigo',
          descripcion: 'descripcion',
          departamento: 'departamento',
          rutEncargado: 'rutEncargado',
        };
        const errors = {};
        (res.invalidCarreras || res.details?.invalidCarreras || []).forEach(u => {
          if (Array.isArray(u.error)) {
            errors[u.index] = {};
            u.error.forEach(err => {
              let mappedField = err.field;
              if (mappedCarreras[u.index] && !(mappedField in mappedCarreras[u.index])) {
                mappedField = fieldMap[err.field] || err.field;
              }
              errors[u.index][mappedField] = err.message;
            });
          } else {
            errors[u.index] = { _row: u.error };
          }
        });
        if (importedIndices.length > 0 || Object.keys(errors).length > 0) {
          options.onImported(importedIndices, errors);
        } else {
          // Llama igual para forzar actualización en el padre
          options.onImported([], {});
        }
      }

      // Si la respuesta tiene usuarios importados y al menos uno fue exitoso
      if (Array.isArray(res.imported) && res.imported.length > 0 && (!res.invalidCarreras || res.invalidCarreras.length === 0)) {
        // Solo cerrar el popup si TODOS los usuarios fueron importados correctamente
        Swal.fire({
          icon: 'success',
          title: 'Importación exitosa',
          text: `Se importaron ${res.imported.length} carrera(s) correctamente.`,
        });
        if (onSuccess) onSuccess();
        return true;
      } else if (Array.isArray(res.imported) && res.imported.length > 0 && Array.isArray(res.invalidCarreras) && res.invalidCarreras.length > 0) {
        // Importación parcial, NO cerrar el popup
        Swal.fire({
          icon: 'warning',
          title: 'Importación parcial',
          text: `Se importaron ${res.imported.length} carrera(s) correctamente. ${res.invalidCarreras.length} carrera(s) no se importaron.`,
        });
        return false;
      } else if (Array.isArray(res.invalidCarreras) && res.invalidCarreras.length > 0) {
        // Ninguna carrera fue importada, NO cerrar el popup
        Swal.fire({
          icon: 'error',
          title: 'Ninguna carrera fue importada',
          text: `${res.invalidCarreras.length} carrera(s) no pudieron ser importadas.`,
        });
        return false;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al importar',
          text: 'No se pudo importar ninguna carrera.',
        });
        return false;
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al importar',
        text: error?.response?.data?.message || 'Ocurrió un error al importar carreras.',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleImport, loading };
}
