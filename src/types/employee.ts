// campos que o usuário preenche no formulário
export interface EmployeeFormData {
  nome: string
  cpf: string
  salarioBruto: number
  descontoPrevidencia: number
  numeroDependentes: number
}

// funcionário completo — os campos calculados são preenchidos automaticamente ao salvar
export interface Employee extends EmployeeFormData {
  id: string
  salarioBaseIR: number
  descontoIRRF: number
}

export interface EmployeeState {
  funcionarios: Employee[]
  filtroNome: string
  filtroCpf: string
}

// union type com todas as ações que o reducer aceita
export type EmployeeAction =
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_EMPLOYEE'; payload: Employee }
  | { type: 'DELETE_EMPLOYEE'; payload: string } // payload é o id
  | { type: 'SET_FILTER_NOME'; payload: string }
  | { type: 'SET_FILTER_CPF'; payload: string }
  | { type: 'LOAD_EMPLOYEES'; payload: Employee[] }
