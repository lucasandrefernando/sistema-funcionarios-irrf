// Utilitários de máscara para CPF.
// A máscara é aplicada incrementalmente enquanto o usuário digita,
// não só quando ele sai do campo — por isso a lógica usa slice em vez de regex direta.

// remove tudo que não for número — útil antes de salvar ou comparar CPFs
export function limparCpf(cpf: string): string {
  return cpf.replace(/\D/g, '')
}

// formata o CPF no padrão 000.000.000-00 conforme o usuário digita
// funciona incrementalmente: 1 dígito → "1", 4 dígitos → "123.4", e assim por diante
export function aplicarMascaraCpf(valor: string): string {
  // primeiro limpa e limita a 11 dígitos para não aceitar mais que o necessário
  const n = limparCpf(valor).slice(0, 11)

  // vai adicionando os separadores conforme o comprimento dos dígitos
  if (n.length <= 3) return n
  if (n.length <= 6) return `${n.slice(0, 3)}.${n.slice(3)}`
  if (n.length <= 9) return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`

  // CPF completo: XXX.XXX.XXX-XX
  return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`
}
