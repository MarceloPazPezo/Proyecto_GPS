import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';

const Table = ({
  data = [],
  columns: userColumns = [],
  pageSize = 10,
  badgeMap = {}, // NUEVA PROP
  onEdit,
  onDelete,
  onView,
  renderActions,
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });

  // Columnas con renderizado personalizado y acciones
  const columns = useMemo(() => {
    const indexCol = {
      id: 'visualIndex',
      header: <span className="font-bold text-slate-700">#</span>,
      size: 40,
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
      enableColumnFilter: false,
    };


    const baseCols = userColumns.map(col => {
      let filterFn = 'includesString';
      let filterElement;
      // Truncamiento automático si la columna tiene truncate: true y no tiene cell custom
      let cellRender = col.cell || ((info) => {
        const value = info.getValue();
        if (col.truncate && typeof value === 'string') {
          const maxLength = typeof col.truncate === 'number' ? col.truncate : 50;
          return value.length > maxLength ? value.slice(0, maxLength) + '...' : value;
        }
        return value;
      });
      if (col.filterType === 'select' && Array.isArray(col.filterOptions)) {
        filterFn = (row, columnId, filterValue) => {
          if (!filterValue) return true;
          return row.getValue(columnId) === filterValue;
        };
        filterElement = ({ column }) => (
          <select
            value={column.getFilterValue() || ''}
            onChange={e => column.setFilterValue(e.target.value)}
            className="mt-1 px-1 py-0.5 border border-blue-200 rounded w-full bg-blue-50 text-[#4EB9FA] focus:outline-none focus:ring-2 focus:ring-blue-300 transition appearance-none"
            style={{ backgroundImage: 'none' }}
          >
            <option value="">Todos</option>
            {col.filterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
        // Si existe badgeMap para esta columna, renderizar el badge de color
        if (badgeMap[col.accessorKey]) {
          cellRender = info => {
            const value = info.getValue();
            const color = badgeMap[col.accessorKey][value] || badgeMap[col.accessorKey]['default'];
            if (!color) return value;
            return (
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-md border font-semibold text-xs min-w-[184px] max-w-[184px] ${color.bg} ${color.text} ${color.border}`}>
                {color.icon ? (
                  React.createElement(color.icon, { className: "w-4 h-4 flex-shrink-0" })
                ) : (
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 flex-grow-0 inline-block ${color.dot}`}></span>
                )}
                {color.label || value}
              </span>
            );
          };
        }
      } else if (col.filterType === 'date') {
        filterFn = (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const rowValue = row.getValue(columnId);
          // Si el valor es DD-MM-YYYY, parsear manualmente
          let rowDateISO = '';
          if (rowValue && /^\d{2}-\d{2}-\d{4}$/.test(rowValue)) {
            const [day, month, year] = rowValue.split('-');
            const dateObj = new Date(`${year}-${month}-${day}T00:00:00`);
            if (!isNaN(dateObj)) {
              rowDateISO = dateObj.toISOString().slice(0, 10);
            }
          } else if (rowValue) {
            // Si ya es un ISO o Date válido
            const dateObj = new Date(rowValue);
            if (!isNaN(dateObj)) {
              rowDateISO = dateObj.toISOString().slice(0, 10);
            }
          }
          return rowDateISO === filterValue;
        };
        filterElement = ({ column }) => (
          <input
            type="date"
            value={column.getFilterValue() || ''}
            onChange={e => {
              column.setFilterValue(e.target.value);
            }}
            className="mt-1 px-1 py-0.5 border border-blue-200 rounded w-full bg-blue-50 text-[#4EB9FA] focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            style={{ colorScheme: 'light' }}
          />
        );
      }
      return {
        ...col,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn,
        filterElement,
        cell: cellRender,
      };
    });
    // Insertar la columna de índice al inicio
    baseCols.unshift(indexCol);
    baseCols.push({
      id: 'actions',
      header: 'Acciones',
      size: 120,
      cell: ({ row }) =>
        renderActions
          ? renderActions({ row: row.original })
          : (
            <div className="flex gap-2">
              {onView && <button className="text-blue-600 hover:underline" onClick={() => onView(row.original)}>Ver</button>}
              {onEdit && <button className="text-yellow-600 hover:underline" onClick={() => onEdit(row.original)}>Editar</button>}
              {onDelete && <button className="text-red-600 hover:underline" onClick={() => onDelete(row.original)}>Eliminar</button>}
            </div>
          ),
      enableSorting: false,
      enableColumnFilter: false,
    });
    // Ejemplo de columna fija a la izquierda (agrega sticky: 'left' en la definición de columna deseada)
    return baseCols;
  }, [userColumns, onEdit, onDelete, onView, renderActions]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    debugTable: false,
  });

  // --- Rellenar filas vacías para mantener el alto de la tabla ---
  const pageRows = table.getRowModel().rows;
  const pageSizeCurrent = table.getState().pagination.pageSize;
  const emptyRowsCount = Math.max(0, pageSizeCurrent - pageRows.length);
  // Para las filas vacías, generamos celdas vacías según las columnas visibles
  const visibleColumns = table.getVisibleFlatColumns();

  return (
    <div className="w-full overflow-x-auto relative">
      <div className="relative min-w-full [&_button]:cursor-pointer [&_input]:cursor-pointer [&_select]:cursor-pointer">
        <table className="min-w-full border border-white/20 rounded-2xl overflow-hidden bg-transparent text-sm block md:table" style={{ tableLayout: 'fixed' }}>
          <thead className="bg-white/60 block md:table-header-group">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="block md:table-row">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={`p-2 text-left font-semibold border-b border-white/30 text-slate-700 whitespace-nowrap ${header.column.columnDef.sticky === 'left' ? 'sticky left-0 bg-white/60 z-20 shadow-md' : ''} ${header.column.columnDef.sticky === 'right' ? 'sticky right-0 bg-white/60 z-20 shadow-md' : ''} ${header.column.columnDef.sticky ? 'bg-white/60' : ''} block md:table-cell`}
                    style={{ minWidth: header.column.columnDef.size, maxWidth: header.column.columnDef.size }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {/* Filtro por columna */}
                    {header.column.getCanFilter() && (
                      <div>
                        {header.column.columnDef.filterElement
                          ? header.column.columnDef.filterElement({ column: header.column })
                          : (
                            <input
                              type="text"
                              value={header.column.getFilterValue() || ''}
                              onChange={e => header.column.setFilterValue(e.target.value)}
                              placeholder={`Filtrar...`}
                              className="mt-1 px-1 py-0.5 border border-blue-200 rounded w-full bg-blue-50 text-[#4EB9FA] placeholder-[#4EB9FA] focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                            />
                          )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="block md:table-row-group overflow-x-auto md:overflow-visible">
            {pageRows.map((row, idx) => (
              <tr
                key={row.id}
                className={`block md:table-row ${idx % 2 === 1 ? 'bg-gray-100' : ''}`}
                style={{ height: '48px', minHeight: '48px', maxHeight: '48px' }}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className={`p-0 align-top border-b border-white/20 text-slate-800 bg-white/80 block md:table-cell ${cell.column.columnDef.sticky === 'left' ? 'sticky left-0 z-10 shadow-md' : ''} ${cell.column.columnDef.sticky === 'right' ? 'sticky right-0 z-10 shadow-md' : ''}`}
                    style={{ minWidth: cell.column.columnDef.size, maxWidth: cell.column.columnDef.size, height: '48px', minHeight: '48px', maxHeight: '48px', backgroundColor: idx % 2 === 1 ? '#f3f4f6' : undefined }}
                  >
                    <div className="flex items-center h-full w-full px-2 break-words whitespace-normal" title={String(cell.getValue?.() ?? '')}>
                      {/* Si el contenido es un botón, input, select, etc, forzar cursor-pointer */}
                      <span className="break-words whitespace-normal block max-w-full align-middle [&_button]:cursor-pointer [&_input]:cursor-pointer [&_select]:cursor-pointer">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            {/* Filas vacías para mantener el alto de la tabla */}
            {Array.from({ length: emptyRowsCount }).map((_, idx) => (
              <tr key={`empty-row-${idx}`} className="block md:table-row bg-transparent" style={{ pointerEvents: 'none', height: '48px', minHeight: '48px', maxHeight: '48px' }}>
                {visibleColumns.map(col => (
                  <td
                    key={`empty-cell-${col.id}`}
                    className={`p-0 align-top border-b border-white/20 whitespace-nowrap bg-white/80 block md:table-cell`}
                    style={{ minWidth: col.columnDef.size, maxWidth: col.columnDef.size, height: '48px', minHeight: '48px', maxHeight: '48px' }}
                  >
                    <div className="h-full w-full px-2">&nbsp;</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Sombra para indicar scroll horizontal en mobile */}
        <div className="pointer-events-none absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-white/80 to-transparent md:hidden" />
      </div>
      {/* Paginación */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-2">
        {/* Filas por página a la izquierda */}
        <div className="flex items-center gap-2 mb-2 md:mb-0 w-full md:w-auto md:justify-start">
          <label className="flex items-center gap-1 text-[#2C3E50]">
            <span>Filas por página:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="border border-white/30 rounded px-2 py-1 ml-1 focus:ring-2 focus:ring-white/50 bg-white/10 text-slate-700 cursor-pointer"
            >
              {[5, 10, 20, 50, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </label>
        </div>
        {/* Página X de Y al centro */}
        <div className="flex-1 flex justify-center items-center text-sm text-slate-700">
          <span>
            Página <strong>{table.getState().pagination.pageIndex + 1} de {table.getPageCount()}</strong>
          </span>
        </div>
        {/* Paginación a la derecha */}
        <div className="flex gap-1 items-center w-full md:w-auto md:justify-end">
          <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="px-2 py-1 border border-white/30 rounded bg-white/10 text-[#2C3E50] hover:bg-[#4EB9FA]/30 disabled:opacity-50 cursor-pointer">Primero</button>
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-2 py-1 border border-white/30 rounded bg-white/10 text-[#2C3E50] hover:bg-[#4EB9FA]/30 disabled:opacity-50 cursor-pointer">Anterior</button>
          {/* Input de página estilo custom con botones - y + a la derecha */}
          <div className="flex items-center mx-1 border border-white/30 rounded-lg overflow-hidden bg-white/10" style={{ minWidth: '40px', height: '38px' }}>
            <button
              type="button"
              className="w-10 h-full flex items-center justify-center text-2xl text-[#2C3E50] hover:bg-[#4EB9FA]/30 transition disabled:opacity-50 cursor-pointer"
              disabled={table.getState().pagination.pageIndex + 1 <= 1}
              onClick={() => {
                if (table.getState().pagination.pageIndex + 1 > 1) {
                  table.setPageIndex(table.getState().pagination.pageIndex - 1);
                }
              }}
              aria-label="Página anterior"
            >
              –
            </button>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min={1}
              max={table.getPageCount()}
              value={table.getState().pagination.pageIndex + 1}
              onChange={e => {
                // Solo permitir números válidos
                const val = e.target.value.replace(/\D/g, '');
                let page = val ? Math.max(1, Math.min(Number(val), table.getPageCount())) : 1;
                table.setPageIndex(page - 1);
              }}
              className="w-12 text-lg text-slate-700 bg-transparent outline-none border-none text-center focus:ring-0 cursor-pointer"
              disabled={table.getPageCount() === 0}
              style={{ boxShadow: 'none', minWidth: '3rem', maxWidth: '3rem' }}
            />
            <button
              type="button"
              className="w-10 h-full flex items-center justify-center text-2xl text-[#2C3E50] hover:bg-[#4EB9FA]/30 transition disabled:opacity-50 cursor-pointer"
              disabled={table.getState().pagination.pageIndex + 1 >= table.getPageCount()}
              onClick={() => {
                if (table.getState().pagination.pageIndex + 1 < table.getPageCount()) {
                  table.setPageIndex(table.getState().pagination.pageIndex + 1);
                }
              }}
              aria-label="Siguiente página"
            >
              +
            </button>
          </div>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-2 py-1 border border-white/30 rounded bg-white/10 text-[#2C3E50] hover:bg-[#4EB9FA]/30 disabled:opacity-50 cursor-pointer">Siguiente</button>
          <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="px-2 py-1 border border-white/30 rounded bg-white/10 text-[#2C3E50] hover:bg-[#4EB9FA]/30 disabled:opacity-50 cursor-pointer">Último</button>
        </div>
      </div>
    </div>
  );
};
Table.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  pageSize: PropTypes.number,
  badgeMap: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  renderActions: PropTypes.func,
};

export default Table;
