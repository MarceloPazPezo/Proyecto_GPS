import axios from "./root.service.js";

export async function getCompartidos(idUser) {
    try {
        const response = await axios.get(`/share/${idUser}`);
        return response.data.data;
    } catch (error) {
        if (error.status === 404) {
            return [];
        }//console.error(error);
    }
}

export async function shareQuiz(idQuiz, idUser) {
    try {
        //console.log(idQuiz,idUser)
        const response = await axios.post(`/share/`, { idCuestionario: idQuiz, idUser: idUser })
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function shareQuizMany(idQuiz, users) {
    try {
        //console.log(idQuiz,users)
        const response=[users.length];
        for (let i = 0; i < users.length; i++) {
            response[i] = await axios.post(`/share/`, { idCuestionario: idQuiz, idUser: users[i] })
        }
        return response;
    } catch (error) {
        console.error(error);
    }
}

export async function deleteForMe(idQuiz,idUser) {
    try {
        const response = await axios.delete(`/share/`,{idQuiz,idUser});
        return response;
    } catch (error) {
        console.error(error);
    }
}