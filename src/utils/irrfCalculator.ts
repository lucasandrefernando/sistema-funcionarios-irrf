// Funções de cálculo do IRRF (Imposto de Renda Retido na Fonte).
// A lógica segue a tabela progressiva da Receita Federal — cada faixa tem uma alíquota
// e uma parcela de dedução que evita a tributação dupla das faixas anteriores.

// tabela progressiva do IRRF — valores conforme legislação vigente
// cada entrada representa: até qual valor (limite), qual alíquota aplicar e quanto deduzir
const FAIXAS_IRRF = [
  { limite: 2259.20,  aliquota: 0,     deducao: 0      }, // isento
  { limite: 2826.65,  aliquota: 0.075, deducao: 169.44 }, // 7,5%
  { limite: 3751.05,  aliquota: 0.15,  deducao: 381.44 }, // 15%
  { limite: 4664.68,  aliquota: 0.225, deducao: 662.77 }, // 22,5%
  { limite: Infinity, aliquota: 0.275, deducao: 896.00 }, // 27,5% — faixa máxima sem limite
]

// dedução fixa por dependente declarado — definida pela Receita Federal
const DEDUCAO_POR_DEPENDENTE = 189.59

// calcula a base de cálculo do IR descontando previdência social e dedução por dependentes
// a fórmula é: salário bruto - previdência - (dependentes × dedução unitária)
export function calcularSalarioBaseIR(
  salarioBruto: number,
  descontoPrevidencia: number,
  numeroDependentes: number
): number {
  const base = salarioBruto - descontoPrevidencia - (DEDUCAO_POR_DEPENDENTE * numeroDependentes)
  // se ficar negativo (muitos dependentes, por ex.) não pode ser menor que zero
  return base < 0 ? 0 : Math.round(base * 100) / 100
}

// recebe a base de cálculo e retorna o valor do IRRF a reter na folha
export function calcularDescontoIRRF(salarioBaseIR: number): number {
  // base zero ou negativa significa isento
  if (salarioBaseIR <= 0) return 0

  // find retorna a primeira faixa onde o salário base ainda cabe
  const faixa = FAIXAS_IRRF.find(f => salarioBaseIR <= f.limite)!

  // faixa de isenção — nenhum desconto a fazer
  if (faixa.aliquota === 0) return 0

  // fórmula: (base × alíquota) - dedução da faixa
  // a dedução elimina a tributação em dobro das faixas anteriores
  const irrf = salarioBaseIR * faixa.aliquota - faixa.deducao

  // Math.round × 100 / 100 arredonda para 2 casas decimais sem sujar com ponto flutuante
  // Math.max garante que nunca retorna negativo (improvável, mas seguro)
  return Math.max(0, Math.round(irrf * 100) / 100)
}
