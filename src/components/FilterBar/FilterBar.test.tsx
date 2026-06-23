// Testes do componente FilterBar — verifica se os inputs e o botão se comportam corretamente.
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { useState } from 'react'
import { FilterBar } from './FilterBar'

// props padrão para não repetir em cada teste
const propsPadrao = {
  filtroNome: '',
  filtroCpf: '',
  onChangeFiltroNome: vi.fn(),
  onChangeFiltroCpf: vi.fn(),
  onNovoFuncionario: vi.fn(),
}

// wrapper com estado para simular o uso real do componente controlado
function FilterBarComEstado() {
  const [filtroCpf, setFiltroCpf] = useState('')
  return (
    <FilterBar
      filtroNome=""
      filtroCpf={filtroCpf}
      onChangeFiltroNome={vi.fn()}
      onChangeFiltroCpf={setFiltroCpf}
      onNovoFuncionario={vi.fn()}
    />
  )
}

describe('FilterBar', () => {
  it('renderiza os campos de filtro e o botão de cadastro', () => {
    render(<FilterBar {...propsPadrao} />)

    expect(screen.getByPlaceholderText('Filtrar por nome')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Filtrar por CPF')).toBeInTheDocument()
    expect(screen.getByText('Novo Funcionário')).toBeInTheDocument()
  })

  it('chama onChangeFiltroNome com o valor digitado', async () => {
    const onChangeFiltroNome = vi.fn()
    render(<FilterBar {...propsPadrao} onChangeFiltroNome={onChangeFiltroNome} />)

    await userEvent.type(screen.getByPlaceholderText('Filtrar por nome'), 'a')
    expect(onChangeFiltroNome).toHaveBeenCalledWith('a')
  })

  it('aplica máscara incremental no CPF ao digitar', async () => {
    // o wrapper com estado é necessário porque o input é controlado —
    // sem ele o valor nunca atualiza entre teclas e a máscara não acumula
    render(<FilterBarComEstado />)

    await userEvent.type(screen.getByPlaceholderText('Filtrar por CPF'), '1234')
    expect(screen.getByPlaceholderText('Filtrar por CPF')).toHaveValue('123.4')
  })

  it('chama onNovoFuncionario ao clicar no botão', async () => {
    const onNovoFuncionario = vi.fn()
    render(<FilterBar {...propsPadrao} onNovoFuncionario={onNovoFuncionario} />)

    await userEvent.click(screen.getByText('Novo Funcionário'))
    expect(onNovoFuncionario).toHaveBeenCalledTimes(1)
  })
})
