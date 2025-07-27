import banWords from "./banWords";

export function censurarTexto(texto = "") {
    let censurado = texto;
    
    for (const regex of banWords) {
        censurado = censurado.replace(regex, (match) => "*".repeat(match.length));
    }

    return censurado;
}