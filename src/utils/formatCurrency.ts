// Utilitário de formatação monetária.
// Usa a API nativa do browser (Intl) para formatar no padrão brasileiro: R$ 1.234,56
// Assim não precisamos de biblioteca externa e o resultado é sempre consistente com o locale do sistema.

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
