export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function getRequiredMessage(fieldName: string) {
  return `O campo ${fieldName.toLowerCase()} é obrigatório.`;
}

export function getInvalidFormatMessage(fieldName: string) {
  return `O formato do campo ${fieldName.toLowerCase()} é inválido.`;
}

export function getMinLengthMessage(fieldName: string, min: number) {
  return `${fieldName} deve ter pelo menos ${min} caracteres.`;
}

export function getMaxLengthMessage(fieldName: string, max: number) {
  return `${fieldName} deve ter pelo menos ${max} caracteres.`;
}
