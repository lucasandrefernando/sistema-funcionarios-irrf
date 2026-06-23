import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { EmployeeProvider, employeeReducer, useEmployees } from './EmployeeContext'
import type { Employee, EmployeeState } from '../types/employee'

// componente auxiliar para testar o hook sem expor internals do context
function ContadorFuncionarios() {
  const { state } = useEmployees()
  return <span>funcionarios:{state.funcionarios.length}</span>
}

describe('EmployeeProvider', () => {
  it('carrega os 5 funcionários do employees.json após o carregamento', async () => {
    render(
      // delay=0 para o setTimeout resolver imediatamente no ambiente de testes
      <EmployeeProvider delay={0}>
        <ContadorFuncionarios />
      </EmployeeProvider>
    )
    // findBy aguarda o dispatch do LOAD_EMPLOYEES antes de verificar
    expect(await screen.findByText('funcionarios:5')).toBeInTheDocument()
  })
})

const estadoVazio: EmployeeState = {
  funcionarios: [],
  filtroNome: '',
  filtroCpf: '',
}

const funcionario1: Employee = {
  id: '1',
  nome: 'Ana Silva',
  cpf: '111.111.111-11',
  salarioBruto: 3000,
  descontoPrevidencia: 330,
  numeroDependentes: 0,
  salarioBaseIR: 2670,
  descontoIRRF: 30.81,
}

const funcionario2: Employee = {
  id: '2',
  nome: 'Bruno Costa',
  cpf: '222.222.222-22',
  salarioBruto: 5000,
  descontoPrevidencia: 550,
  numeroDependentes: 1,
  salarioBaseIR: 4260.41,
  descontoIRRF: 295.34,
}

describe('employeeReducer', () => {
  it('ADD_EMPLOYEE — adiciona funcionário à lista vazia', () => {
    const resultado = employeeReducer(estadoVazio, {
      type: 'ADD_EMPLOYEE',
      payload: funcionario1,
    })
    expect(resultado.funcionarios).toHaveLength(1)
    expect(resultado.funcionarios[0].nome).toBe('Ana Silva')
  })

  it('ADD_EMPLOYEE — adiciona segundo funcionário mantendo o primeiro', () => {
    const estadoComUm: EmployeeState = { ...estadoVazio, funcionarios: [funcionario1] }
    const resultado = employeeReducer(estadoComUm, {
      type: 'ADD_EMPLOYEE',
      payload: funcionario2,
    })
    expect(resultado.funcionarios).toHaveLength(2)
    expect(resultado.funcionarios[0].id).toBe('1')
    expect(resultado.funcionarios[1].id).toBe('2')
  })

  it('UPDATE_EMPLOYEE — atualiza o funcionário correto sem mexer nos outros', () => {
    const estadoComDois: EmployeeState = {
      ...estadoVazio,
      funcionarios: [funcionario1, funcionario2],
    }
    const atualizado = { ...funcionario1, nome: 'Ana Souza' }
    const resultado = employeeReducer(estadoComDois, {
      type: 'UPDATE_EMPLOYEE',
      payload: atualizado,
    })
    expect(resultado.funcionarios).toHaveLength(2)
    expect(resultado.funcionarios[0].nome).toBe('Ana Souza')
    expect(resultado.funcionarios[1].nome).toBe('Bruno Costa')
  })

  it('DELETE_EMPLOYEE — remove pelo id, preserva os demais', () => {
    const estadoComDois: EmployeeState = {
      ...estadoVazio,
      funcionarios: [funcionario1, funcionario2],
    }
    const resultado = employeeReducer(estadoComDois, {
      type: 'DELETE_EMPLOYEE',
      payload: '1',
    })
    expect(resultado.funcionarios).toHaveLength(1)
    expect(resultado.funcionarios[0].id).toBe('2')
  })

  it('SET_FILTER_NOME — atualiza só filtroNome', () => {
    const resultado = employeeReducer(estadoVazio, {
      type: 'SET_FILTER_NOME',
      payload: 'ana',
    })
    expect(resultado.filtroNome).toBe('ana')
    expect(resultado.filtroCpf).toBe('')
  })

  it('SET_FILTER_CPF — atualiza só filtroCpf', () => {
    const resultado = employeeReducer(estadoVazio, {
      type: 'SET_FILTER_CPF',
      payload: '111',
    })
    expect(resultado.filtroCpf).toBe('111')
    expect(resultado.filtroNome).toBe('')
  })
})
