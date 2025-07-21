import { useState, useEffect } from "react";
import { getMuralByUsuario } from "../../services/stickNotes.service";

const useGetMurales = (idUser) => {
    const [murales, setMurales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMurales = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMuralByUsuario(idUser);
            setMurales(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (idUser) fetchMurales();
    }, [idUser]);

    return { murales, loading, error, fetchMurales };
};

export default useGetMurales;