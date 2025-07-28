import Table from '@components/Table';
import { format as formatDate, parseISO } from 'date-fns';
import useMisUsuarios from '@hooks/users/useGetMisUsuarios.jsx';
import UpdateMiUsuarioPopup from '../components/UpdateMiUsuarioPopup';
import { useState } from 'react';
import useEditMiUsuario from '@hooks/users/useEditMiUsuario';
import useDeleteMiUsuario from '@hooks/users/useDeleteMiUsuario';
import ImportMisUsuariosPopup from '@components/ImportMisUsuariosPopup.jsx';
import CreateMiUsuarioPopup from '@components/CreateMiUsuarioPopup.jsx';
import { useImportMisUsuarios } from '@hooks/users/useImportMisUsuarios.jsx';
import { MdUploadFile, MdEdit, MdDelete, MdPersonAddAlt1, MdSupervisorAccount, MdPerson, MdGroup } from 'react-icons/md';
import useCreateMiUsuario from '@hooks/users/useCreateMiUsuario.jsx';

const MisUsuarios = () => {
  const { users, fetchUsers, setUsers } = useMisUsuarios();
  const [showImport, setShowImport] = useState(false);

  const {
    showCreate,
    setShowCreate,
  } = useCreateMiUsuario();

  const { handleImport, loading } = useImportMisUsuarios({
    onSuccess: () => {
      fetchUsers();
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
    dataUser,
    setDataUser
  } = useEditMiUsuario(setUsers);

  const { handleDelete } = useDeleteMiUsuario(fetchUsers, setDataUser);

  // Definición de los colores para los badges de rol
  const rolBadgeMap = {
    'Tutor': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-400',
      icon: MdSupervisorAccount,
      label: 'Tutor'
    },
    'Tutorado': {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-400',
      icon: MdGroup,
      label: 'Tutorado'
    },
    'Usuario': {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-400',
      icon: MdPerson,
      label: 'Usuario'
    },
    'default': {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-400',
      icon: MdPerson,
      label: 'Desconocido'
    }
  };
  const columns = [
    {
      accessorKey: 'rut',
      header: 'Rut',
      size: 120,
      sticky: 'left', // Fija la columna de Rut a la izquierda
    },
    {
      accessorKey: 'nombreCompleto',
      header: 'Nombre completo',
      size: 200,
    },
    {
      accessorKey: 'email',
      header: 'Correo electrónico',
      truncate: true,
    },
    {
      accessorKey: 'rol',
      header: 'Rol',
      size: 200,
      filterType: 'select',
      filterOptions: [
        { value: 'Tutor', label: 'Tutor' },
        { value: 'Tutorado', label: 'Tutorado' },
        { value: 'Usuario', label: 'Usuario' }
      ]
    },
    {
      accessorKey: 'carreraCodigo',
      header: 'Código Carrera',
      size: 120,
    },
    {
      accessorKey: 'carreraNombre',
      header: 'Nombre Carrera',
      size: 120,
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
      // Para el filtro, compara usando yyyy-MM-dd extraído del ISO
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
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-[#2C3E50]">Usuarios</h1>
        <div className="flex items-center gap-2">
          <button
            className="bg-[#4EB9FA] hover:bg-[#5EBFFA] text-white font-semibold px-6 py-3 rounded-lg shadow transition-all duration-200 border border-[#4EB9FA] hover:-translate-y-0.5"
            title="Importar usuarios desde Excel"
            onClick={() => setShowImport(true)}
          >
            <span className="flex items-center gap-2"><MdUploadFile size={24} />Importar</span>
          </button>
          <button
            className="bg-[#2C3E50] hover:bg-[#34495E] text-white font-semibold px-6 py-3 rounded-lg shadow transition-all duration-200 border border-[#2C3E50] hover:-translate-y-0.5"
            title="Crear usuario"
            onClick={() => setShowCreate(true)}
          >
            <span className="flex items-center gap-2">
              <MdPersonAddAlt1 size={22} />
              Crear usuario
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg border border-[#4EB9FA]/20 shadow-xl p-8 sm:p-10 rounded-2xl mb-6 overflow-x-auto">
        <Table
          data={users}
          columns={columns}
          pageSize={5}
          badgeMap={{ rol: rolBadgeMap }}
          onEdit={row => { setDataUser([row]); setIsPopupOpen(true); }}
          onDelete={row => handleDelete([row])}
          onView={row => alert('Ver usuario: ' + row.nombreCompleto)}
          renderActions={({ row }) => (
            <div className="flex gap-2">
              <button title="Editar" className="text-[#FF9233]/70 hover:text-[#2C3E50] transition-colors duration-200 p-1 rounded" onClick={() => { setDataUser([row]); setIsPopupOpen(true); }}>
                <MdEdit size={18} />
              </button>
              <button title="Eliminar" className="text-red-400 hover:text-[#2C3E50] transition-colors duration-200 p-1 rounded" onClick={() => handleDelete([row])}>
                <MdDelete size={18} />
              </button>
            </div>
          )}
        />
      </div>

      <UpdateMiUsuarioPopup show={isPopupOpen} setShow={setIsPopupOpen} data={dataUser} action={handleUpdate} />
      {showImport && (
        <ImportMisUsuariosPopup show={showImport} setShow={setShowImport} onFile={handleImportFile} loading={loading} />
      )}
      {showCreate && (
        <CreateMiUsuarioPopup show={showCreate} setShow={setShowCreate} dataUsers={setUsers} />
      )}
    </div>
  );
};

export default MisUsuarios;