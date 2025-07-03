import axios from "./root.service.js";

export async function getCompartidos(idUser) {
    try {
        const response = await axios.get(`/share/${idUser}`);
        return response.data.data;
    } catch (error) {
        if(error.status===404){
            return [];
        }
        //console.error(error);
    }
}