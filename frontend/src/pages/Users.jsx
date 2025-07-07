import Table from '@components/Table';
import { format as formatDate, parseISO } from 'date-fns';
import useUsers from '@hooks/users/useGetUsers.jsx';
import Popup from '../components/Popup';
import { useState } from 'react';
import useEditUser from '@hooks/users/useEditUser';
import useDeleteUser from '@hooks/users/useDeleteUser';
import ImportUsersPopup from '@components/ImportUsersPopup.jsx';
import { useImportUsers } from '@hooks/users/useImportUsers.jsx';
import { MdUploadFile, MdEdit, MdDelete } from 'react-icons/md';

const Users = () => {
  const { users, fetchUsers, setUsers } = useUsers();
  const [showImport, setShowImport] = useState(false);
  const { handleImport, loading } = useImportUsers({
    onSuccess: () => {
      fetchUsers();
      setShowImport(false);
    }
  });

  const handleImportFile = ({ name, data }) => {
    handleImport(data);
  };

  const {
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataUser,
    setDataUser
  } = useEditUser(setUsers);

  const { handleDelete } = useDeleteUser(fetchUsers, setDataUser);

  const columns = [
    {
      accessorKey: 'rut',
      header: 'Rut',
      size: 100,
    },
    {
      accessorKey: 'nombreCompleto',
      header: 'Nombre completo',
      size: 200,
    },
    {
      accessorKey: 'email',
      header: 'Correo electrónico',
      size: 200,
    },
    {
      accessorKey: 'rol',
      header: 'Rol',
      size: 150,
      filterType: 'select',
      filterOptions: [
        { value: 'Administrador', label: 'Admin' },
        { value: 'Usuario', label: 'Usuario' }
      ]
    },
    {
      accessorKey: 'createdAt',
      header: 'Creado',
      size: 150,
      // Muestra la fecha en formato chileno dd-MM-yyyy
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
    <div className="flex flex-col justify-center items-center w-full font-sans bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl p-8 sm:p-10 rounded-2xl mb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
        <h1 className="text-white font-bold text-3xl mb-2 text-center md:text-left">Usuarios</h1>
        <div className="flex gap-2 items-center">
          <button
            className="bg-white/20 border border-white/30 shadow-md p-2 rounded-lg hover:bg-white/30 transition text-white"
            title="Importar usuarios desde Excel"
            onClick={() => setShowImport(true)}
          >
            <MdUploadFile size={24} color="#fff" />
          </button>
        </div>
      </div>
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto">
          <Table
            data={users}
            columns={columns}
            pageSize={5}
            onEdit={row => { setDataUser([row]); setIsPopupOpen(true); }}
            onDelete={row => handleDelete([row])}
            onView={row => alert('Ver usuario: ' + row.nombreCompleto)}
            renderActions={({ row }) => (
              <div className="flex gap-2">
                <button title="Editar" className="text-yellow-300 hover:bg-yellow-400/20 p-1 rounded transition" onClick={() => { setDataUser([row]); setIsPopupOpen(true); }}>
                  <MdEdit size={20} />
                </button>
                <button title="Eliminar" className="text-red-400 hover:bg-red-400/20 p-1 rounded transition" onClick={() => handleDelete([row])}>
                  <MdDelete size={20} />
                </button>
              </div>
            )}
          />
        </div>
      </div>
      <Popup show={isPopupOpen} setShow={setIsPopupOpen} data={dataUser} action={handleUpdate} />
      {showImport && (
        <ImportUsersPopup show={showImport} setShow={setShowImport} onFile={handleImportFile} loading={loading} />
      )}
    </div>
  );
};

export default Users;