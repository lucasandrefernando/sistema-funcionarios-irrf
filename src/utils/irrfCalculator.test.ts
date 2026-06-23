import { describe, it, expect } from 'vitest'
import { calcularDescontoIRRF, calcularSalarioBaseIR } from './irrfCalculator'

describe('calcularDescontoIRRF', () => {
  it('salário base até 2.259,20 — isento, retorna 0', () => {
    // Carlos Mendes do employees.json: base 2035.41
    expect(calcularDescontoIRRF(2035.41)).toBe(0)
    expect(calcularDescontoIRRF(2259.20)).toBe(0)
  })

  it('faixa 7,5% — base entre 2.259,21 e 2.826,65', () => {
    // Fernanda Lima: base 2670.00 → 2670 * 0.075 - 169.44 = 30.81
    expect(calcularDescontoIRRF(2670)).toBe(30.81)
  })

  it('faixa 15% — base entre 2.826,66 e 3.751,05', () => {
    // Roberto Souza: base 3370.41 → 3370.41 * 0.15 - 381.44 = 124.12
    expect(calcularDescontoIRRF(3370.41)).toBe(124.12)
  })

  it('faixa 22,5% — base entre 3.751,06 e 4.664,68', () => {
    // Patricia Alves: base 4450.00 → 4450 * 0.225 - 662.77 = 338.48
    expect(calcularDescontoIRRF(4450)).toBe(338.48)
  })

  it('faixa 27,5% — base acima de 4.664,68', () => {
    // Marcelo Santos: base 6740.82 → 6740.82 * 0.275 - 896 = 957.73
    expect(calcularDescontoIRRF(6740.82)).toBe(957.73)
  })

  it('salário base zero ou negativo — retorna 0', () => {
    expect(calcularDescontoIRRF(0)).toBe(0)
    expect(calcularDescontoIRRF(-100)).toBe(0)
  })
})

describe('calcularSalarioBaseIR', () => {
  it('calcula corretamente sem dependentes', () => {
    // Fernanda: 3000 - 330 - 0 = 2670
    expect(calcularSalarioBaseIR(3000, 330, 0)).toBe(2670)
  })

  it('com 1 dependente — desconta R$ 189,59 da base', () => {
    // Carlos: 2500 - 275 - 1 * 189.59 = 2035.41
    expect(calcularSalarioBaseIR(2500, 275, 1)).toBe(2035.41)
  })

  it('com 2 dependentes — desconta R$ 379,18 da base', () => {
    // Marcelo: 8000 - 880 - 2 * 189.59 = 6740.82
    expect(calcularSalarioBaseIR(8000, 880, 2)).toBe(6740.82)
  })

  it('com 3 dependentes — desconta R$ 568,77 da base', () => {
    // 5000 - 550 - 3 * 189.59 = 3881.23
    expect(calcularSalarioBaseIR(5000, 550, 3)).toBe(3881.23)
  })

  it('salário muito baixo com muitos dependentes — retorna 0, não negativo', () => {
    // 1000 - 500 - 5 * 189.59 = -447.95 → deve retornar 0
    expect(calcularSalarioBaseIR(1000, 500, 5)).toBe(0)
  })
})
