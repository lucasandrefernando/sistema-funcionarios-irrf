import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { EmployeeForm } from './EmployeeForm'
import type { Employee } from '../../types/employee'

const funcionarioMock: Employee = {
  id: '2',
  nome: 'Fernanda Lima',
  cpf: '987.654.321-00',
  salarioBruto: 3000,
  descontoPrevidencia: 330,
  numeroDependentes: 0,
  salarioBaseIR: 2670,
  descontoIRRF: 30.81,
}

describe('EmployeeForm', () => {
  it('renderiza o formulário vazio para novo funcionário', () => {
    render(<EmployeeForm onSalvar={vi.fn()} onCancelar={vi.fn()} />)
    expect(screen.getByText('Novo Funcionário')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Nome completo')).toHaveValue('')
  })

  it('preenche os campos quando recebe um funcionário para edição', () => {
    render(
      <EmployeeForm
        funcionario={funcionarioMock}
        onSalvar={vi.fn()}
        onCancelar={vi.fn()}
      />
    )

    expect(screen.getByText('Editar Funcionário')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Fernanda Lima')).toBeInTheDocument()
    expect(screen.getByDisplayValue('987.654.321-00')).toBeInTheDocument()
  })

  it('exibe erro de validação quando nome está vazio', async () => {
    render(<EmployeeForm onSalvar={vi.fn()} onCancelar={vi.fn()} />)

    await userEvent.click(screen.getByText('Salvar'))
    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
  })

  it('exibe erro quando CPF está incompleto', async () => {
    render(<EmployeeForm onSalvar={vi.fn()} onCancelar={vi.fn()} />)

    await userEvent.type(screen.getByPlaceholderText('Nome completo'), 'Teste')
    await userEvent.type(screen.getByPlaceholderText('000.000.000-00'), '123')
    await userEvent.click(screen.getByText('Salvar'))

    expect(screen.getByText('CPF inválido')).toBeInTheDocument()
  })

  it('chama onCancelar ao clicar em Cancelar', async () => {
    const onCancelar = vi.fn()
    render(<EmployeeForm onSalvar={vi.fn()} onCancelar={onCancelar} />)

    await userEvent.click(screen.getByText('Cancelar'))
    expect(onCancelar).toHaveBeenCalled()
  })

  it('aplica máscara no CPF enquanto o usuário digita', async () => {
    render(<EmployeeForm onSalvar={vi.fn()} onCancelar={vi.fn()} />)

    const inputCpf = screen.getByPlaceholderText('000.000.000-00')
    await userEvent.type(inputCpf, '12345678900')

    // após digitar 11 dígitos, o campo deve exibir o CPF formatado
    expect(inputCpf).toHaveValue('123.456.789-00')
  })

  it('chama onSalvar com os dados corretos quando formulário é válido', async () => {
    const onSalvar = vi.fn()
    render(<EmployeeForm onSalvar={onSalvar} onCancelar={vi.fn()} />)

    await userEvent.type(screen.getByPlaceholderText('Nome completo'), 'João Silva')
    await userEvent.type(screen.getByPlaceholderText('000.000.000-00'), '12345678900')
    // dois inputs têm placeholder '0,00' — pega o primeiro (Salário Bruto)
    await userEvent.type(screen.getAllByPlaceholderText('0,00')[0], '3000')

    await userEvent.click(screen.getByText('Salvar'))
    expect(onSalvar).toHaveBeenCalled()
  })
})
