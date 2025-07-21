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
        let msg = `Se importaron ${res.imported.length} carrera(s) correctamente.\n\n${res.invalidCarreras.length} carrera(s) no se importaron.`;
        const detalles = res.invalidCarreras.map((u, idx) => {
          let m = `Fila ${u.index + 1}`;
          if (u.carrera?.codigo) m += ` | CODIGO: ${u.carrera.codigo}`;
          if (u.carrera?.rutEncargado) m += ` | rutEncargado: ${u.carrera.rutEncargado}`;
          // Mostrar todos los mensajes de error si es array
          if (Array.isArray(u.error)) {
            m += `\nMotivo: ${u.error.map(e => e.message).join('; ')}`;
          } else {
            m += `\nMotivo: ${u.error}`;
          }
          return m;
        }).join('\n\n');
        Swal.fire({
          icon: 'warning',
          title: 'Importación parcial',
          html: `<div style="text-align:left;white-space:pre-wrap;">${msg}\n\n${detalles}</div>`,
          width: 600,
        });
        return false;
      } else if (Array.isArray(res.invalidCarreras) && res.invalidCarreras.length > 0) {
        // Ningún usuario fue importado, NO cerrar el popup
        const detalles = res.invalidCarreras.map((u, idx) => {
          let msg = `Fila ${u.index + 1}`;
          if (u.carrera?.codigo) m += ` | CODIGO: ${u.carrera.codigo}`;
          if (u.carrera?.rutEncargado) m += ` | rutEncargado: ${u.carrera.rutEncargado}`;
          if (Array.isArray(u.error)) {
            msg += `\nMotivo: ${u.error.map(e => e.message).join('; ')}`;
          } else {
            msg += `\nMotivo: ${u.error}`;
          }
          return msg;
        }).join('\n\n');
        Swal.fire({
          icon: 'error',
          title: 'Ninguna carrera fue importado',
          html: `<pre style="text-align:left;white-space:pre-wrap;">${detalles}</pre>`,
          width: 600,
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
