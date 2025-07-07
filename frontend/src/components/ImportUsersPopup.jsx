import React, { useRef, useState, useMemo, useEffect } from 'react';
import { MdUploadFile } from 'react-icons/md';
import CloseIcon from '@assets/XIcon.svg';
import * as xlsx from 'xlsx';
import PreviewTable from './PreviewTable.jsx';
import PropTypes from 'prop-types';

const ImportUsersPopup = ({ show, setShow, onFile, loading }) => {
  const fileInputRef = useRef();
  const [previewData, setPreviewData] = useState([]);
  const [previewColumns, setPreviewColumns] = useState([]);
  const [fileName, setFileName] = useState("");

  function formatExcelDate(value) {
    // Si es un número (fecha serial Excel)
    if (typeof value === 'number') {
      const excelEpoch = new Date(Date.UTC(1899, 11, 30));
      const date = new Date(excelEpoch.getTime() + value * 86400000);
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = date.getUTCFullYear();
      return `${day}-${month}-${year}`;
    }
    // Si es string tipo ISO o Date
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      const date = new Date(value);
      if (!isNaN(date)) {
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}-${month}-${year}`;
      }
    }
    return value;
  }

  const parseFile = (file) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = xlsx.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      let jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });
      // Normalizar nombres de columnas a claves internas
      const keyMap = {
        'Nombre Completo': 'nombreCompleto',
        'Correo': 'email',
        'Rut': 'rut',
        'Contraseña': 'password',
      };
      jsonData = jsonData.map(row => {
        const newRow = {};
        Object.entries(row).forEach(([k, v]) => {
          const key = keyMap[k] || k;
          newRow[key] = v;
        });
        return newRow;
      });
      // Detectar columnas tipo fecha y formatear
      if (jsonData.length > 0) {
        const keys = Object.keys(jsonData[0]);
        // Detectar columnas con nombre que incluya "fecha" (case-insensitive)
        const fechaKeys = keys.filter(k => /fecha/i.test(k));
        if (fechaKeys.length > 0) {
          jsonData = jsonData.map(row => {
            const newRow = { ...row };
            fechaKeys.forEach(fk => {
              newRow[fk] = formatExcelDate(row[fk]);
            });
            return newRow;
          });
        }
      }
      setPreviewData(jsonData);
      setPreviewColumns(jsonData.length > 0 ? Object.keys(jsonData[0]) : []);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.[0]) {
      parseFile(e.dataTransfer.files[0]);
      // No cerrar el popup aún, solo preview
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      parseFile(e.target.files[0]);
      // No cerrar el popup aún, solo preview
    }
  };



  // Para edición en vivo de la tabla
  const [editData, setEditData] = useState([]);
  // Errores por fila: { fila: error }
  const [rowErrors, setRowErrors] = useState({});

  // Log para detectar cambios de referencia en editData
  useEffect(() => {
    console.log('ImportUsersPopup: editData changed', editData);
  }, [editData]);

  // Sincroniza editData cuando previewData cambia (al cargar archivo)
  useEffect(() => {
    setEditData(previewData);
    setRowErrors({}); // Limpiar errores al cargar nuevo archivo
  }, [previewData]);

  // Columnas para PreviewTable (todas editables por defecto)
  const tableColumns = React.useMemo(() => {
    if (!editData || editData.length === 0) return [];
    return Object.keys(editData[0]).map(key => ({
      accessorKey: key,
      header: key,
      editable: true,
    }));
  }, [editData]);

  // Estado para filas importadas
  const [importedRows, setImportedRows] = React.useState([]);

  // Eliminar fila
  const handleDeleteRow = (rowIndex) => {
    const newEditData = editData.filter((_, idx) => idx !== rowIndex);
    setEditData(newEditData);
    // También eliminar de filas importadas y errores
    setImportedRows(importedRows.filter(idx => idx !== rowIndex));
    setRowErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[rowIndex];
      // Reindexar errores
      const reindexed = {};
      Object.entries(newErrors).forEach(([k, v]) => {
        const num = Number(k);
        reindexed[num > rowIndex ? num - 1 : num] = v;
      });
      return reindexed;
    });
  };

  const handleImport = async () => {
    if (editData.length > 0 && onFile) {
      try {
        await onFile({
          name: fileName,
          data: editData,
          onImported: (importedIndices, invalidErrors) => {
            setImportedRows(importedIndices);
            setRowErrors(invalidErrors);
          }
        });
        // Si todo fue exitoso, cerrar popup (esto solo si no hay errores)
        // El cierre del popup debe manejarse en el callback si se desea
      } catch (err) {
        // Si el backend responde error pero hay datos parciales, no sobreescribas los estados
        // El manejo de errores visuales queda a cargo del callback
      }
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative bg-white/80 backdrop-blur-lg border border-[#4EB9FA]/20 shadow-xl w-full max-w-4xl h-[90vh] max-h-[95vh] p-0 animate-fade-in flex flex-col rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-[#4EB9FA]/20">
          <h2 className="text-2xl font-bold text-[#2C3E50]">Importar usuarios</h2>
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white border border-[#4EB9FA]/30 hover:bg-[#4EB9FA]/10 transition"
            onClick={() => setShow(false)}
            aria-label="Cerrar"
            style={{ lineHeight: 0 }}
          >
            <img src={CloseIcon} alt="Cerrar" className="w-5 h-5" />
          </button>
        </div>
        {/* Body */}
        <div className="px-10 py-8 flex flex-col items-center flex-1 min-h-0 w-full">
          {!previewData.length ? (
            <>
              <p className="text-[#2C3E50] mb-2 text-center">Selecciona o arrastra un archivo Excel (.xlsx, .xls, .csv) con los usuarios a importar.</p>
              <div className="w-full flex flex-col items-center mb-4">
                <span className="text-[#2C3E50] font-semibold mb-1">Formato esperado de columnas:</span>
                <div className="w-full max-w-md bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-[#2C3E50] flex flex-col gap-1 shadow-sm">
                  <div><b>Nombre Completo</b> <span className="text-xs text-blue-400">(obligatorio)</span></div>
                  <div><b>Rut</b> <span className="text-xs text-blue-400">(obligatorio)</span></div>
                  <div><b>Correo</b> <span className="text-xs text-blue-400">(obligatorio)</span></div>
                  <div><b>Contraseña</b> <span className="text-xs text-blue-400">(obligatorio)</span></div>
                  <div><b>Carrera</b> <span className="text-xs text-blue-400">(obligatorio)</span></div>
                  <div className="text-xs text-blue-400 mt-1">* El archivo debe tener al menos estas columnas, en cualquier orden.</div>
                </div>
              </div>
              <button
                type="button"
                className={`border-2 border-dashed border-[#4EB9FA] rounded-2xl text-center cursor-pointer hover:bg-[#4EB9FA]/10 transition w-full flex flex-col justify-center items-center gap-2 ${loading ? 'opacity-60 pointer-events-none' : ''}`}
                style={{ background: 'transparent', minHeight: '160px', padding: '3.5rem 1.5rem' }}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => !loading && fileInputRef.current.click()}
                tabIndex={0}
                aria-disabled={loading}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <MdUploadFile size={56} className="text-[#4EB9FA]" />
                  <span className="block text-[#2C3E50] font-medium text-lg">Haz clic o suelta un archivo aquí</span>
                </div>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={loading}
                />
              </button>
              <button
                type="button"
                className="mt-4 px-6 py-3 bg-[#4EB9FA] hover:bg-[#5EBFFA] text-white font-semibold rounded-lg shadow transition disabled:opacity-60 disabled:pointer-events-none border border-[#4EB9FA] hover:-translate-y-0.5"
                onClick={() => !loading && fileInputRef.current.click()}
                disabled={loading}
              >
                Importar archivo
              </button>
              {loading && (
                <div className="mt-4 flex flex-col items-center gap-2 text-[#4EB9FA] font-semibold">
                  <span className="animate-spin rounded-full border-b-2 border-[#4EB9FA] h-6 w-6"></span>
                  Importando usuarios...
                </div>
              )}
            </>
          ) : (
            <>
              <div className="w-full flex justify-between items-center mb-4">
                <span className="text-[#2C3E50] font-medium">Cantidad de usuarios a importar: <b>{editData.length}</b></span>
              </div>
              <div className="w-full h-[60vh] rounded-xl bg-white/90 border border-[#4EB9FA]/10 p-2 overflow-auto">
                <PreviewTable
                  data={editData}
                  columns={tableColumns}
                  onDataChange={setEditData}
                  rowErrors={rowErrors}
                  importedRows={importedRows}
                  onDeleteRow={handleDeleteRow}
                />
              </div>
              <div className="flex w-full gap-2 mt-6">
                <button
                  className="flex-1 bg-[#4EB9FA] hover:bg-[#5EBFFA] text-white font-semibold py-2.5 rounded-lg shadow transition border border-[#4EB9FA] hover:-translate-y-0.5"
                  onClick={handleImport}
                >
                  Confirmar importación
                </button>
                <button
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-[#2C3E50] font-semibold py-2.5 rounded-lg shadow transition border border-gray-300"
                  onClick={() => { setPreviewData([]); setEditData([]); setFileName(""); }}
                >
                  Cerrar archivo
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
ImportUsersPopup.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  onFile: PropTypes.func,
  loading: PropTypes.bool
};

export default ImportUsersPopup;