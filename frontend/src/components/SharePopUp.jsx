import CloseIcon from '@assets/XIcon.svg';
//import QuestionIcon from '@assets/QuestionCircleIcon.svg';

export default function SharePopUp({ show, setShow, data, action }) {
    let list = [];
    const userData = data && data.length > 0 ? data[0] : {};

    const handleSubmit = () => {
        action(list);
        list=[];
        setShow(false);
    };


    const changeList = (e) => {
        const id = e.target.value;
        if (!list.includes(id)) {
            list.push(id);
        } else {
            list.splice(list.indexOf(id), 1)
        }
    }

    return (
        <div>
            {show && (
                <div className="bg ">
                    <div className="popup">
                        <button className='close' onClick={() => setShow(false)}>
                            <img src={CloseIcon} />
                        </button>
                        <h1>Selecciones a quien compartir</h1>
                        {
                            data.map((user) => (
                                user.id!==JSON.parse(sessionStorage.getItem("usuario")).id?
                                <div key={user.id}>
                                    <input
                                        key={user.id}
                                        type="checkbox"
                                        id={user.id}
                                        value={user.id}
                                        onChange={changeList}
                                    />
                                    <label>{user.nombreCompleto}</label>
                                </div>:<></>
                            ))
                        }
                        <button onClick={handleSubmit}>Compartir</button>

                    </div>
                </div>
            )}
        </div>
    );
}