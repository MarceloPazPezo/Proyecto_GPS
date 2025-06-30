import axios from "./root.service.js";

export async function getComaprtidos(idUser) {
    try {
        const { data } = await axios.get(`/share/${idUser}`);
        return data;
    } catch (error) {
        console.error(error.data);
    }
}