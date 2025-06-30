import axios from "./root.service.js";

export async function getCuestionarios(idUser) {
    try {
        const { data } = await axios.get(`/quiz/${idUser}`);
        return data;
    } catch (error) {
        console.error(error.data);
    }
}