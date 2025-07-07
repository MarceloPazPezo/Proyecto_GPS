import CloseIcon from '@assets/XIcon.svg';
//import QuestionIcon from '@assets/QuestionCircleIcon.svg';

export default function SharePopUp({ show, setShow, data, action }) {
    let list = [];
    const userData = data && data.length > 0 ? data[0] : {};

    const handleSubmit = () => {
        action(list);
        list = [];
        setShow(false);
    };

    const changeList = (e) => {
        const id = e.target.value;
        if (!list.includes(id)) {
            list.push(id);
        } else {
            list.splice(list.indexOf(id), 1);
        }
    };

    return (
        <div>
            {show && (
                <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-10 max-w-3xl relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-4"
                            onClick={() => setShow(false)}
                        >
                            <img src={CloseIcon} alt="Close" className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800 mb-4">Selecciona a quién compartir</h1>
                        <div className="overflow-auto max-h-64">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Seleccionar</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nombre Completo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {data.map((user) => (
                                        user.id !== JSON.parse(sessionStorage.getItem("usuario"))?.id ? (
                                            <tr key={user.id}>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="checkbox"
                                                        id={user.id}
                                                        value={user.id}
                                                        onChange={changeList}
                                                        className="accent-blue-500 w-4 h-4"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-gray-800">{user.nombreCompleto}</td>
                                            </tr>
                                        ) : null
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleSubmit}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg"
                            >
                                Compartir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
