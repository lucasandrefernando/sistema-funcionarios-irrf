// Gerenciamento de estado global com Context API + useReducer.
// Optei por não usar Redux aqui — pra esse escopo o Context resolve sem adicionar dependência.
import { createContext, useContext, useReducer, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Employee, EmployeeAction, EmployeeState } from '../types/employee'
import dadosIniciais from '../data/employees.json'

// começa vazio — os dados são carregados de forma assíncrona no Provider (simula uma API)
const estadoInicial: EmployeeState = {
  funcionarios: [],
  filtroNome: '',
  filtroCpf: '',
}

// reducer puro: nunca muta o estado — sempre retorna um objeto novo
export function employeeReducer(state: EmployeeState, action: EmployeeAction): EmployeeState {
  switch (action.type) {
    case 'ADD_EMPLOYEE':
      return { ...state, funcionarios: [...state.funcionarios, action.payload] }

    case 'UPDATE_EMPLOYEE':
      // troca só o funcionário com o id correspondente, mantém os demais intactos
      return {
        ...state,
        funcionarios: state.funcionarios.map(f =>
          f.id === action.payload.id ? action.payload : f
        ),
      }

    case 'DELETE_EMPLOYEE':
      return {
        ...state,
        funcionarios: state.funcionarios.filter(f => f.id !== action.payload),
      }

    case 'SET_FILTER_NOME':
      return { ...state, filtroNome: action.payload }

    case 'SET_FILTER_CPF':
      return { ...state, filtroCpf: action.payload }

    case 'LOAD_EMPLOYEES':
      return { ...state, funcionarios: action.payload }

    default:
      return state
  }
}

type ContextType = {
  state: EmployeeState
  carregando: boolean
  dispatch: React.Dispatch<EmployeeAction>
}

const EmployeeContext = createContext<ContextType | undefined>(undefined)

// delay é configurável para facilitar testes (passa 0 nos testes para não esperar)
export function EmployeeProvider({ children, delay = 900 }: { children: ReactNode; delay?: number }) {
  const [state, dispatch] = useReducer(employeeReducer, estadoInicial)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    // simula o tempo de resposta de uma API real antes de popular a tabela
    const timer = setTimeout(() => {
      dispatch({ type: 'LOAD_EMPLOYEES', payload: dadosIniciais as Employee[] })
      setCarregando(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <EmployeeContext.Provider value={{ state, carregando, dispatch }}>
      {children}
    </EmployeeContext.Provider>
  )
}

// usar esse hook em vez de acessar o context direto — já valida se está dentro do provider
export function useEmployees() {
  const context = useContext(EmployeeContext)
  if (!context) throw new Error('useEmployees precisa estar dentro do EmployeeProvider')
  return context
}
