export function getRequiredMessage(fieldName: string) {
  return `O campo ${fieldName} precisa ser informado.`;
}

export function getInvalidFormatMessage(fieldName: string) {
  return `O formato do campo ${fieldName} é inválido.`;
}

export function getInvalidOptionMessage(fieldName: string) {
  return `A opção escolhida no campo ${fieldName.toLowerCase()} é inválida.`;
}

export function getMinLengthMessage(fieldName: string, min: number) {
  return `${fieldName} deve ter pelo menos ${min} caractere(s).`;
}

export function getMaxLengthMessage(fieldName: string, max: number) {
  return `${fieldName} deve ter no máximo ${max} caractere(s).`;
}
