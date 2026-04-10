export const NUMERO_CARAVANA_MAX_LENGTH = 15;

export const sanitizeNumeroCaravana = (value: string) =>
  value.replace(/\D/g, '').slice(0, NUMERO_CARAVANA_MAX_LENGTH);

export const isNumeroCaravanaValido = (value: string) =>
  /^\d{1,15}$/.test(value);

export const getNumeroCaravanaError = (value: string) => {
  if (!value) {
    return 'El campo Número de caravana no puede estar vacío';
  }

  if (!isNumeroCaravanaValido(value)) {
    return 'El número de caravana debe contener solo números y hasta 15 dígitos';
  }

  return null;
};
