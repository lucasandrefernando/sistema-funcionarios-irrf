// Testes unitários do EmployeeTable.
// OBS: no JSDOM o CSS não é aplicado, então tabela E cards ficam visíveis ao mesmo tempo.
// Por isso usamos getAllByText onde o nome/valor aparece duas vezes (uma na tabela, uma no card).
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { EmployeeTable } from './EmployeeTable'
import type { Employee } from '../../types/employee'

// funcionário de exemplo pra reutilizar nos testes
const funcionarioMock: Employee = {
  id: '1',
  nome: 'Carlos Mendes',
  cpf: '123.456.789-00',
  salarioBruto: 2500,
  descontoPrevidencia: 275,
  numeroDependentes: 1,
  salarioBaseIR: 2035.41,
  descontoIRRF: 0,
}

describe('EmployeeTable', () => {
  it('renderiza os dados do funcionário na tabela', () => {
    render(
      <EmployeeTable
        funcionarios={[funcionarioMock]}
        onEditar={vi.fn()}
        onExcluir={vi.fn()}
      />
    )

    // cada valor aparece duas vezes no JSDOM (tabela desktop + card mobile)
    expect(screen.getAllByText('Carlos Mendes').length).toBeGreaterThan(0)
    expect(screen.getAllByText('123.456.789-00').length).toBeGreaterThan(0)
  })

  it('mostra mensagem quando a lista está vazia sem filtro', () => {
    render(
      <EmployeeTable
        funcionarios={[]}
        temFiltroAtivo={false}
        onEditar={vi.fn()}
        onExcluir={vi.fn()}
      />
    )

    expect(screen.getByText('Nenhum funcionário cadastrado.')).toBeInTheDocument()
  })

  it('mostra mensagem de filtro sem resultados quando filtro está ativo', () => {
    render(
      <EmployeeTable
        funcionarios={[]}
        temFiltroAtivo={true}
        onEditar={vi.fn()}
        onExcluir={vi.fn()}
      />
    )

    expect(screen.getByText('Nenhum resultado para os filtros aplicados.')).toBeInTheDocument()
  })

  it('chama onEditar ao clicar em Editar', async () => {
    const onEditar = vi.fn()
    render(
      <EmployeeTable
        funcionarios={[funcionarioMock]}
        onEditar={onEditar}
        onExcluir={vi.fn()}
      />
    )

    // clica no primeiro botão "Editar" (existem dois: um na tabela, um no card)
    await userEvent.click(screen.getAllByText('Editar')[0])
    expect(onEditar).toHaveBeenCalledWith(funcionarioMock)
  })

  it('exibe valores monetários formatados em reais, incluindo a Base IR', () => {
    render(
      <EmployeeTable
        funcionarios={[funcionarioMock]}
        onEditar={vi.fn()}
        onExcluir={vi.fn()}
      />
    )
    // usando regex para não depender do caractere exato de espaço (non-breaking space do toLocaleString)
    expect(screen.getAllByText(/2\.500,00/).length).toBeGreaterThan(0)   // salário bruto
    expect(screen.getAllByText(/2\.035,41/).length).toBeGreaterThan(0)   // salário base IR
  })

  it('chama onExcluir com o id correto ao clicar em Excluir', async () => {
    const onExcluir = vi.fn()
    render(
      <EmployeeTable
        funcionarios={[funcionarioMock]}
        onEditar={vi.fn()}
        onExcluir={onExcluir}
      />
    )

    // clica no primeiro "Excluir" disponível (tabela ou card — ambos disparam a mesma ação)
    await userEvent.click(screen.getAllByText('Excluir')[0])
    expect(onExcluir).toHaveBeenCalledWith('1')
  })
})
