// Componente raiz da aplicação — orquestra todos os outros componentes.
// Gerencia o estado dos modais (form e confirmação) com useState local,
// e acessa os dados e ações globais via Context (useEmployees).
import { useState, useMemo } from 'react'
import { useEmployees } from './context/EmployeeContext'
import type { Employee, EmployeeFormData } from './types/employee'
import { calcularSalarioBaseIR, calcularDescontoIRRF } from './utils/irrfCalculator'
import { Layout } from './components/Layout/Layout'
import { FilterBar } from './components/FilterBar/FilterBar'
import { EmployeeTable } from './components/EmployeeTable/EmployeeTable'
import { EmployeeForm } from './components/EmployeeForm/EmployeeForm'
import { ConfirmModal } from './components/ConfirmModal/ConfirmModal'
import { LoadingScreen } from './components/LoadingScreen/LoadingScreen'
import styles from './App.module.css'

function App() {
  // pega o estado global, o flag de carregamento e o dispatch do Context
  const { state, dispatch, carregando } = useEmployees()

  // todos os hooks têm que ser chamados ANTES de qualquer return condicional
  // (regra dos hooks do React: ordem de chamada precisa ser sempre a mesma)
  const [formAberto, setFormAberto] = useState(false)
  const [funcionarioEditando, setFuncionarioEditando] = useState<Employee | null>(null)
  const [idParaExcluir, setIdParaExcluir] = useState<string | null>(null)

  // useMemo evita reprocessar o filtro em toda renderização — só recalcula quando a lista ou os filtros mudam
  const funcionariosFiltrados = useMemo(() => {
    return state.funcionarios.filter(f => {
      const nomeOk = f.nome.toLowerCase().includes(state.filtroNome.toLowerCase().trim())
      // compara só os dígitos para funcionar tanto com quanto sem a máscara digitada
      const cpfNumerico = f.cpf.replace(/\D/g, '')
      const filtroNumerico = state.filtroCpf.replace(/\D/g, '')
      const cpfOk = cpfNumerico.includes(filtroNumerico)
      return nomeOk && cpfOk
    })
  }, [state.funcionarios, state.filtroNome, state.filtroCpf])

  // usado pela tabela para exibir a mensagem correta quando a lista está vazia
  const temFiltroAtivo = state.filtroNome !== '' || state.filtroCpf !== ''

  // só depois de todos os hooks é seguro fazer o return condicional
  if (carregando) return <LoadingScreen />

  // abre o formulário vazio para cadastrar um novo funcionário
  function abrirNovoFuncionario() {
    setFuncionarioEditando(null)
    setFormAberto(true)
  }

  // abre o formulário já preenchido com os dados do funcionário selecionado
  function abrirEdicao(funcionario: Employee) {
    setFuncionarioEditando(funcionario)
    setFormAberto(true)
  }

  // fecha o painel lateral e limpa o funcionário em edição
  function fecharForm() {
    setFormAberto(false)
    setFuncionarioEditando(null)
  }

  // recebe os dados do formulário, calcula o IRRF e salva no Context
  function salvarFuncionario(dados: EmployeeFormData) {
    // calcula os valores derivados antes de guardar
    const baseIR = calcularSalarioBaseIR(dados.salarioBruto, dados.descontoPrevidencia, dados.numeroDependentes)
    const irrf = calcularDescontoIRRF(baseIR)

    if (funcionarioEditando) {
      // atualiza mantendo o mesmo id do registro existente
      dispatch({
        type: 'UPDATE_EMPLOYEE',
        payload: { ...dados, id: funcionarioEditando.id, salarioBaseIR: baseIR, descontoIRRF: irrf },
      })
    } else {
      // crypto.randomUUID gera um id único garantido — sem risco de colisão mesmo em cadastros rápidos
      dispatch({
        type: 'ADD_EMPLOYEE',
        payload: { ...dados, id: crypto.randomUUID(), salarioBaseIR: baseIR, descontoIRRF: irrf },
      })
    }

    fecharForm()
  }

  // guarda o id do funcionário que o usuário quer excluir e abre o modal de confirmação
  function confirmarExclusao(id: string) {
    setIdParaExcluir(id)
  }

  // só executa a exclusão depois que o usuário confirmar no modal
  function executarExclusao() {
    if (idParaExcluir) {
      dispatch({ type: 'DELETE_EMPLOYEE', payload: idParaExcluir })
      setIdParaExcluir(null)
    }
  }

  return (
    <Layout>
      <div className={styles.conteudo}>
        {/* barra de filtros e botão de novo cadastro */}
        <FilterBar
          filtroNome={state.filtroNome}
          filtroCpf={state.filtroCpf}
          onChangeFiltroNome={v => dispatch({ type: 'SET_FILTER_NOME', payload: v })}
          onChangeFiltroCpf={v => dispatch({ type: 'SET_FILTER_CPF', payload: v })}
          onNovoFuncionario={abrirNovoFuncionario}
        />

        {/* tabela com a lista filtrada */}
        <EmployeeTable
          funcionarios={funcionariosFiltrados}
          temFiltroAtivo={temFiltroAtivo}
          onEditar={abrirEdicao}
          onExcluir={confirmarExclusao}
        />

        {/* painel lateral de formulário — só aparece quando formAberto é true */}
        {formAberto && (
          <div className={styles.overlay}>
            <div className={styles.painel}>
              <EmployeeForm
                funcionario={funcionarioEditando}
                onSalvar={salvarFuncionario}
                onCancelar={fecharForm}
              />
            </div>
          </div>
        )}

        {/* modal de confirmação de exclusão — só aparece quando tem um id pendente */}
        {idParaExcluir && (
          <ConfirmModal
            mensagem="Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita."
            onConfirmar={executarExclusao}
            onCancelar={() => setIdParaExcluir(null)}
          />
        )}
      </div>
    </Layout>
  )
}

export default App
