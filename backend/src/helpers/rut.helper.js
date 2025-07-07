// Normaliza un RUT eliminando puntos y dejando solo el guion
export function normalizarRut(rut) {
  if (!rut) return '';
  return rut.replace(/\./g, '').toUpperCase();
}