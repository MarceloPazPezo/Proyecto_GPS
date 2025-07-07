import Table from '@components/Table';
import { format as formatDate, parseISO } from 'date-fns';
import useUsers from '@hooks/users/useGetUsers.jsx';
import Popup from '../components/Popup';
import { useState } from 'react';
import useEditUser from '@hooks/users/useEditUser';
import useDeleteUser from '@hooks/users/useDeleteUser';
import ImportUsersPopup from '@components/ImportUsersPopup.jsx';
import CreateUserPopup from '@components/CreateUserPopup.jsx';
import { useImportUsers } from '@hooks/users/useImportUsers.jsx';
import { MdUploadFile, MdEdit, MdDelete, MdPersonAddAlt1 } from 'react-icons/md';
import useCreateUser from '@hooks/users/useCreateUser.jsx';

const Users = () => {
  const { users, fetchUsers, setUsers } = useUsers();
  const [showImport, setShowImport] = useState(false);

  const {
    showCreate,
    setShowCreate,
    handleCreateUser,
  } = useCreateUser();

  const { handleImport, loading } = useImportUsers({
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

      <Popup show={isPopupOpen} setShow={setIsPopupOpen} data={dataUser} action={handleUpdate} />
      {showImport && (
        <ImportUsersPopup show={showImport} setShow={setShowImport} onFile={handleImportFile} loading={loading} />
      )}
      {showCreate && (
        <CreateUserPopup show={showCreate} setShow={setShowCreate} dataUsers={setUsers} />
      )}
    </div>
  );
};

export default Users;