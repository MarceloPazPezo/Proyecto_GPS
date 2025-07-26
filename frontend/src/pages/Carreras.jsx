import Table from '@components/Table';
import { format as formatDate, parseISO } from 'date-fns';
import useCarreras from '@hooks/carreras/useGetCarreras.jsx';
import UpdateCarreraPopup from '../components/UpdateCarreraPopup';
import { useState } from 'react';
import useEditCarrera from '@hooks/carreras/useEditCarrera';
import useDeleteCarrera from '@hooks/carreras/useDeleteCarrera';
import ImportCarrerasPopup from '@components/ImportCarrerasPopup.jsx';
import CreateCarreraPopup from '@components/CreateCarreraPopup.jsx';
import { useImportCarreras } from '@hooks/carreras/useImportCarreras.jsx';
import { MdUploadFile, MdEdit, MdDelete, MdPersonAddAlt1 } from 'react-icons/md';
import useCreateCarrera from '@hooks/carreras/useCreateCarrera.jsx';

const Carreras = () => {
  const { carreras, fetchCarreras, setCarreras } = useCarreras();
  const [showImport, setShowImport] = useState(false);

  const {
    showCreate,
    setShowCreate,
  } = useCreateCarrera();

  const { handleImport, loading } = useImportCarreras({
    onSuccess: () => {
      fetchCarreras();
      setShowImport(false);
    }
  });

  const handleImportFile = ({ name, data, onImported }) => {
    handleImport(data, { onImported });
  };

  const {
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataCarrera,
    setDataCarrera
  } = useEditCarrera(setCarreras);

  const { handleDelete } = useDeleteCarrera(fetchCarreras, setDataCarrera);

  // Definición de los colores para los badges de rol
  // Definición de los colores para los badges de rol
  const rolBadgeMap = {
  };
  const columns = [
    {
      accessorKey: 'codigo',
      header: 'Codigo',
      size: 120,
      sticky: 'left', // Fija la columna de Rut a la izquierda
    },
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      size: 200,
    },
    {
      accessorKey: 'descripcion',
      header: 'Descripcion',
      truncate: true,
    },
    {
      accessorKey: 'departamento',
      header: 'departamento',
      truncate: true,
    },
    {
      accessorKey: 'rutEncargado',
      header: 'Rut encargado',
      size: 200,
    },
    {
      accessorKey: 'createdAt',
      header: 'Creado',
      truncate: true,
      cell: info => {
        const value = info.getValue();
        if (!value) return '';
        try {
          return formatDate(parseISO(value), 'dd-MM-yyyy');
        } catch {
          return value;
        }
      },
      filterType: 'date',
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId);
        if (!filterValue) return true;
        if (!value) return false;
        try {
          return formatDate(parseISO(value), 'yyyy-MM-dd') === filterValue;
        } catch {
          return false;
        }
      },
    },
  ];

  return (
    <div className='p-9'>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-[#2C3E50]">Carreras</h1>
        <div className="flex items-center gap-2">
          <button
            className="bg-[#4EB9FA] hover:bg-[#5EBFFA] text-white font-semibold px-6 py-3 rounded-lg shadow transition-all duration-200 border border-[#4EB9FA] hover:-translate-y-0.5"
            title="Importar carreras desde Excel"
            onClick={() => setShowImport(true)}
          >
            <span className="flex items-center gap-2"><MdUploadFile size={24} />Importar</span>
          </button>
          <button
            className="bg-[#2C3E50] hover:bg-[#34495E] text-white font-semibold px-6 py-3 rounded-lg shadow transition-all duration-200 border border-[#2C3E50] hover:-translate-y-0.5"
            title="Crear carrera"
            onClick={() => setShowCreate(true)}
          >
            <span className="flex items-center gap-2">
              <MdPersonAddAlt1 size={22} />
              Crear carrera
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg border border-[#4EB9FA]/20 shadow-xl p-8 sm:p-10 rounded-2xl mb-6 overflow-x-auto">
        <Table
          data={carreras}
          columns={columns}
          pageSize={5}
          badgeMap={{ rol: rolBadgeMap }}
          onEdit={row => { setDataCarrera([row]); setIsPopupOpen(true); }}
          onDelete={row => handleDelete([row])}
          onView={row => alert('Ver carreras: ' + row.nombreCompleto)}
          renderActions={({ row }) => (
            <div className="flex gap-2">
              <button title="Editar" className="text-[#FF9233]/70 hover:text-[#2C3E50] transition-colors duration-200 p-1 rounded" onClick={() => { setDataCarrera([row]); setIsPopupOpen(true); }}>
                <MdEdit size={18} />
              </button>
              <button title="Eliminar" className="text-red-400 hover:text-[#2C3E50] transition-colors duration-200 p-1 rounded" onClick={() => handleDelete([row])}>
                <MdDelete size={18} />
              </button>
            </div>
          )}
        />
      </div>

      <UpdateCarreraPopup show={isPopupOpen} setShow={setIsPopupOpen} data={dataCarrera} action={handleUpdate} />
      {showImport && (
        <ImportCarrerasPopup show={showImport} setShow={setShowImport} onFile={handleImportFile} loading={loading} />
      )}
      {showCreate && (
        <CreateCarreraPopup show={showCreate} setShow={setShowCreate} dataCarreras={setCarreras} />
      )}
    </div>
  );
};

export default Carreras;