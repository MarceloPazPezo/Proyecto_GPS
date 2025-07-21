import { useState } from "react";
import { crearMural as createMuralService } from "../../services/stickNotes.service";

const useCreateMural = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createMural = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const mural = await createMuralService(data);
            setLoading(false);
            return mural;
        } catch (err) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    return { createMural, loading, error };
};

export default useCreateMural;