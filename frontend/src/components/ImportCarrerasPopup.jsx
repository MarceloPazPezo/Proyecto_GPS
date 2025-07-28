import React, { useRef, useState, useMemo, useEffect } from 'react';
import { MdUploadFile, MdError } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import CloseIcon from '@assets/XIcon.svg';
import QuestionIcon from '@assets/QuestionCircleIcon.svg';
import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';

const ImportCarrerasPopup = ({ show, setShow, onFile, loading }) => {
  const fileInputRef = useRef();
  const [fileName, setFileName] = useState("");
  const [tableData, setTableData] = useState([]);
  const [rowErrors, setRowErrors] = useState({});
  const [importedRows, setImportedRows] = useState([]);

  // Columnas esperadas para carreras
  const columns = ['nombre', 'codigo', 'descripcion', 'departamento', 'rutEncargado'];

  function formatExcelDate(value) {
    if (typeof value === 'number') {
      const excelEpoch = new Date(Date.UTC(1899, 11, 30));
      const date = new Date(excelEpoch.getTime() + value * 86400000);
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = date.getUTCFullYear();
      return `${day}-${month}-${year}`;
    }
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
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      let jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      
      // Normalizar nombres de columnas a claves internas
      const keyMap = {
        'Nombre': 'nombre',
        'Codigo': 'codigo',
        'Código': 'codigo',
        'Descripcion': 'descripcion',
        'Descripción': 'descripcion',
        'Departamento': 'departamento',
        'Rut Encargado': 'rutEncargado',
        'RUT Encargado': 'rutEncargado',
        'rutEncargado': 'rutEncargado'
      };
      
      jsonData = jsonData.map(row => {
        const newRow = {};
        Object.entries(row).forEach(([k, v]) => {
          const key = keyMap[k] || k.toLowerCase();
          // Convertir codigo a texto explícitamente
          if (key === 'codigo') {
            newRow[key] = String(v || '');
          } else {
            newRow[key] = v;
          }
        });
        return newRow;
      });

      // Detectar columnas tipo fecha y formatear
      if (jsonData.length > 0) {
        const keys = Object.keys(jsonData[0]);
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
      
      setTableData(jsonData);
      setRowErrors({});
      setImportedRows([]);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.[0]) {
      parseFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      parseFile(e.target.files[0]);
    }
  };

  const handleCloseFile = () => {
    setTableData([]);
    setFileName("");
    setRowErrors({});
    setImportedRows([]);
  };

  const updateCell = (rowIndex, field, value) => {
    const newData = [...tableData];
    // Asegurar que el campo codigo siempre sea texto
    const processedValue = field === 'codigo' ? String(value || '') : value;
    newData[rowIndex] = { ...newData[rowIndex], [field]: processedValue };
    setTableData(newData);
    
    // Limpiar error de esta celda si existe
    if (rowErrors[rowIndex]?.[field]) {
      const newErrors = { ...rowErrors };
      delete newErrors[rowIndex][field];
      if (Object.keys(newErrors[rowIndex]).length === 0) {
        delete newErrors[rowIndex];
      }
      setRowErrors(newErrors);
    }
  };

  const deleteRow = (rowIndex) => {
    const newData = tableData.filter((_, idx) => idx !== rowIndex);
    setTableData(newData);
    
    // Actualizar índices de filas importadas y errores
    const newImportedRows = importedRows
      .filter(idx => idx !== rowIndex)
      .map(idx => idx > rowIndex ? idx - 1 : idx);
    setImportedRows(newImportedRows);
    
    const newErrors = {};
    Object.entries(rowErrors).forEach(([idx, error]) => {
      const numIdx = parseInt(idx);
      if (numIdx !== rowIndex) {
        const newIdx = numIdx > rowIndex ? numIdx - 1 : numIdx;
        newErrors[newIdx] = error;
      }
    });
    setRowErrors(newErrors);
  };

  const handleImport = async () => {
    if (tableData.length > 0 && onFile) {
      try {
        await onFile({
          name: fileName,
          data: tableData,
          onImported: (importedIndices, invalidErrors) => {
            setImportedRows(importedIndices);
            setRowErrors(invalidErrors);
          }
        });
      } catch (err) {
        console.error('Error en importación:', err);
      }
    }
  };

  // Calcular estadísticas
  const totalRows = tableData.length;
  const importedCount = importedRows.length;
  const errorCount = Object.keys(rowErrors).length;
  const pending = totalRows - importedCount - errorCount;

  if (!show) {
    return null;
  }

  // Obtener columnas dinámicamente
  const dynamicColumns = tableData.length > 0 ? Object.keys(tableData[0]) : columns;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2">
      <div className="relative bg-white shadow-2xl w-full max-w-7xl h-[95vh] p-0 animate-fade-in flex flex-col rounded-2xl border border-gray-200">
        
        {/* Header mejorado */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gradient-to-r from-[#4EB9FA]/5 to-[#5EBFFA]/5 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#4EB9FA]/10 rounded-xl">
              <MdUploadFile size={24} className="text-[#4EB9FA]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#2C3E50]">Importar Carreras</h2>
              <p className="text-gray-600 text-sm">Carga y gestiona carreras desde archivos Excel</p>
            </div>
          </div>
          <button
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:scale-105 shadow-sm"
            onClick={() => setShow(false)}
            aria-label="Cerrar"
          >
            <img src={CloseIcon} alt="Cerrar" className="w-4 h-4" />
          </button>
        </div>

        {/* Body mejorado */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0 px-8 py-6">
          {tableData.length === 0 ? (
            // Vista de carga de archivo mejorada
            <div className="flex flex-col items-center justify-center flex-1 gap-6">
              
              {/* Instrucciones mejoradas */}
              <div className="text-center max-w-2xl">
                <h3 className="text-2xl font-semibold text-[#2C3E50] mb-3">
                  Selecciona tu archivo de carreras
                </h3>
                <p className="text-gray-600 text-base">
                  Soportamos archivos .xlsx, .xls y .csv
                </p>
              </div>

              {/* Zona de drop mejorada con formatos integrados */}
              <div className="w-full max-w-4xl">
                <button
                  type="button"
                  className={`w-full border-2 border-dashed border-[#4EB9FA] rounded-2xl text-center cursor-pointer hover:bg-[#4EB9FA]/5 transition-all duration-300 hover:border-[#5EBFFA] hover:scale-[1.01] ${loading ? 'opacity-60 pointer-events-none' : ''}`}
                  style={{ background: 'transparent', minHeight: '320px', padding: '2rem 1.5rem' }}
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => !loading && fileInputRef.current?.click()}
                  tabIndex={0}
                  aria-disabled={loading}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="p-2 bg-[#4EB9FA]/10 rounded-2xl">
                      <MdUploadFile size={48} className="text-[#4EB9FA]" />
                    </div>
                    
                    <div className="text-center">
                      <span className="block text-[#2C3E50] font-semibold text-lg mb-2">
                        Arrastra tu archivo aquí
                      </span>
                      <span className="block text-gray-500 text-base mb-2">
                        o haz clic para seleccionar
                      </span>
                    </div>

                    {/* Formato esperado integrado */}
                    <div className="w-full">
                      <h4 className="text-sm font-semibold text-[#2C3E50] mb-3">
                        📋 Formato de columnas requerido
                      </h4>
                      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="text-sm font-medium text-red-700 mb-2">Requeridos</div>
                          <div className="space-y-1">
                            <div className="text-sm text-red-600">• Nombre</div>
                            <div className="text-sm text-red-600">• Codigo</div>
                            <div className="text-sm text-red-600">• Departamento</div>
                            <div className="text-sm text-red-600">• Rut Encargado</div>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="text-sm font-medium text-green-700 mb-2">Opcionales</div>
                          <div className="space-y-1">
                            <div className="text-sm text-green-600">• Descripcion</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200 max-w-2xl mx-auto">
                        <p className="text-sm text-gray-600 text-center">
                          💡 <strong>Tip:</strong> Las columnas pueden estar en cualquier orden
                        </p>
                      </div>
                    </div>
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
              </div>

              {loading && (
                <div className="flex flex-col items-center gap-3 text-[#4EB9FA] font-semibold">
                  <div className="flex items-center gap-3">
                    <span className="animate-spin rounded-full border-2 border-[#4EB9FA]/20 border-t-[#4EB9FA] h-6 w-6"></span>
                    <span className="text-base">Procesando archivo...</span>
                  </div>
                  <p className="text-gray-600 text-sm">Esto puede tomar unos momentos</p>
                </div>
              )}
            </div>
          ) : (
            // Vista de tabla mejorada
            <div className="flex flex-col h-full space-y-4">
              {/* Header de estadísticas mejorado */}
              <div className="bg-gradient-to-r from-[#4EB9FA]/5 to-[#5EBFFA]/5 rounded-xl p-4 border border-[#4EB9FA]/20 flex-shrink-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#4EB9FA]/10 rounded-xl">
                      <MdUploadFile size={24} className="text-[#4EB9FA]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#2C3E50]">Datos del archivo: {fileName}</h3>
                      <p className="text-sm text-gray-600">Total de registros: {tableData.length}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-lg">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <span className="text-green-800 font-medium text-sm">Importadas: {importedCount}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-red-100 px-3 py-2 rounded-lg">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      <span className="text-red-800 font-medium text-sm">Con errores: {errorCount}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-yellow-100 px-3 py-2 rounded-lg">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                      <span className="text-yellow-800 font-medium text-sm">Pendientes: {pending}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla mejorada con scroll */}
              <div className="flex-1 rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden min-h-0">
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-200 w-16 text-sm">
                          #
                        </th>
                        {columns.map(col => (
                          <th key={col} className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-200 min-w-[140px] text-sm">
                            <div className="flex items-center gap-2">
                              <span>{col.charAt(0).toUpperCase() + col.slice(1)}</span>
                              {['nombre', 'codigo', 'departamento', 'rutEncargado'].includes(col) && (
                                <span className="relative group">
                                  <img src={QuestionIcon} alt="info" className="w-4 h-4 cursor-pointer" />
                                  <span className="absolute left-6 top-1 z-10 hidden group-hover:block bg-white text-xs text-[#2C3E50] border border-[#4EB9FA]/30 rounded px-2 py-1 shadow-lg min-w-max">
                                    Este campo es obligatorio
                                  </span>
                                </span>
                              )}
                            </div>
                          </th>
                        ))}
                        <th className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-200 w-20 text-sm">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {tableData.map((row, rowIndex) => {
                        const isImported = importedRows.includes(rowIndex);
                        const hasError = rowErrors[rowIndex];
                        
                        return (
                          <tr
                            key={`row-${rowIndex}`}
                            className={`hover:bg-gray-50 transition-colors ${
                              isImported
                                ? 'bg-green-50 border-l-4 border-green-400'
                                : hasError
                                ? 'bg-red-50 border-l-4 border-red-400'
                                : 'border-l-4 border-transparent'
                            }`}
                          >
                            <td className="px-4 py-3 text-center font-medium text-gray-800 bg-gray-50/50 text-sm">
                              {rowIndex + 1}
                            </td>
                            {columns.map(field => {
                              const value = row[field] ?? '';
                              const errorMsg = rowErrors?.[rowIndex]?.[field];
                              
                              return (
                                <td key={`${rowIndex}-${field}`} className="px-4 py-3">
                                  <div className="flex flex-col gap-1">
                                    <input
                                      type="text"
                                      className={`border rounded-lg px-3 py-2 text-sm w-full transition-all focus:ring-2 focus:ring-[#4EB9FA]/20 focus:border-[#4EB9FA] ${
                                        isImported 
                                          ? 'bg-green-50 border-green-300 text-green-800 cursor-not-allowed' 
                                          : errorMsg 
                                          ? 'border-red-400 bg-red-50 text-gray-800 focus:ring-red-200' 
                                          : 'border-gray-300 hover:border-gray-400 text-gray-800 bg-white'
                                      }`}
                                      value={value}
                                      disabled={isImported}
                                      onChange={e => {
                                        if (!isImported) {
                                          updateCell(rowIndex, field, e.target.value);
                                        }
                                      }}
                                      placeholder={
                                        field === 'nombre' ? 'Nombre de la carrera' :
                                        field === 'codigo' ? 'Código único' :
                                        field === 'descripcion' ? 'Descripción (opcional)' :
                                        field === 'departamento' ? 'Departamento' :
                                        field === 'rutEncargado' ? '12345678-9' : ''
                                      }
                                    />
                                    {errorMsg && (
                                      <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-md min-h-[32px] w-full">
                                        <MdError size={14} className="flex-shrink-0 mt-0.5" />
                                        <span className="flex-1 leading-relaxed break-words">{errorMsg}</span>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                            <td className="px-4 py-3 text-center">
                              <button
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Eliminar fila"
                                onClick={() => deleteRow(rowIndex)}
                              >
                                <FaTrash size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Botones mejorados */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 flex-shrink-0">
                <button
                  className="flex-1 bg-gradient-to-r from-[#4EB9FA] to-[#5EBFFA] hover:from-[#5EBFFA] hover:to-[#6ECFFA] text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2 text-base"
                  onClick={handleImport}
                  disabled={loading}
                >
                  <MdUploadFile size={18} />
                  {loading ? 'Importando...' : 'Confirmar Importación'}
                </button>
                <button
                  className="flex-1 bg-white hover:bg-gray-50 text-[#2C3E50] font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg border border-gray-200 hover:border-gray-300 text-base"
                  onClick={handleCloseFile}
                >
                  Cerrar Archivo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
ImportCarrerasPopup.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  onFile: PropTypes.func,
  loading: PropTypes.bool
};

export default ImportCarrerasPopup;