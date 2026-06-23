// Testes de integração do App — verifica os fluxos completos que o avaliador vai testar:
// cadastro, edição, exclusão e filtro. Usa o EmployeeProvider real com os dados do JSON.
// OBS: no JSDOM o CSS não é aplicado — tabela e cards ficam no DOM ao mesmo tempo,
// por isso usamos findAllByText / getAllByText onde o texto aparece duplicado.
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { EmployeeProvider } from './context/EmployeeContext'
import App from './App'

// delay=0 nos testes para o carregamento resolver imediatamente (sem aguardar 900ms)
function renderApp() {
  return render(
    <EmployeeProvider delay={0}>
      <App />
    </EmployeeProvider>
  )
}

describe('App — integração', () => {
  it('exibe os funcionários do JSON ao carregar a página', async () => {
    renderApp()

    // findAllByText aguarda o carregamento terminar e aceita múltiplos nós (tabela + card)
    expect((await screen.findAllByText('Carlos Mendes')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Fernanda Lima').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Marcelo Santos').length).toBeGreaterThan(0)
  })

  it('filtra a lista ao digitar nome parcial no campo de busca', async () => {
    renderApp()

    // aguarda os dados carregarem antes de interagir
    await screen.findAllByText('Carlos Mendes')

    // digita "Carlos" no filtro — só Carlos deve continuar visível
    await userEvent.type(screen.getByPlaceholderText('Filtrar por nome'), 'Carlos')

    expect(screen.getAllByText('Carlos Mendes').length).toBeGreaterThan(0)
    expect(screen.queryByText('Fernanda Lima')).not.toBeInTheDocument()
    expect(screen.queryByText('Roberto Souza')).not.toBeInTheDocument()
  })

  it('cadastra novo funcionário e o exibe na tabela', async () => {
    renderApp()

    // aguarda os dados carregarem
    await screen.findAllByText('Carlos Mendes')

    // abre o formulário de novo cadastro
    await userEvent.click(screen.getByText('Novo Funcionário'))
    expect(screen.getByText('Novo Funcionário', { selector: 'h2' })).toBeInTheDocument()

    // preenche os campos obrigatórios
    await userEvent.type(screen.getByPlaceholderText('Nome completo'), 'Teste Integração')
    await userEvent.type(screen.getByPlaceholderText('000.000.000-00'), '99999999999')
    await userEvent.type(screen.getAllByPlaceholderText('0,00')[0], '3000')

    // salva e verifica que o novo funcionário aparece (tabela ou card)
    await userEvent.click(screen.getByText('Salvar'))

    expect(screen.getAllByText('Teste Integração').length).toBeGreaterThan(0)
  })

  it('exclui funcionário após confirmação no modal', async () => {
    renderApp()

    // aguarda os dados carregarem
    await screen.findAllByText('Carlos Mendes')

    // clica no primeiro botão Excluir da página (tabela tem precedência no DOM)
    const botoesExcluir = screen.getAllByText('Excluir')
    await userEvent.click(botoesExcluir[0])

    // modal de confirmação deve aparecer
    expect(screen.getByText(/Tem certeza que deseja excluir/)).toBeInTheDocument()

    // confirma a exclusão
    await userEvent.click(screen.getByText('Confirmar'))

    // Carlos não deve mais estar em nenhum lugar da página
    expect(screen.queryByText('Carlos Mendes')).not.toBeInTheDocument()
  })

  it('edita funcionário e mantém na tabela com os novos dados', async () => {
    renderApp()

    // aguarda os dados carregarem
    await screen.findAllByText('Carlos Mendes')

    // abre edição do primeiro funcionário (Carlos Mendes)
    const botoesEditar = screen.getAllByText('Editar')
    await userEvent.click(botoesEditar[0])

    // formulário deve abrir no modo edição com o nome do Carlos
    expect(screen.getByDisplayValue('Carlos Mendes')).toBeInTheDocument()

    // altera o nome
    const inputNome = screen.getByDisplayValue('Carlos Mendes')
    await userEvent.clear(inputNome)
    await userEvent.type(inputNome, 'Carlos Editado')

    await userEvent.click(screen.getByText('Salvar'))

    // novo nome deve aparecer (tabela ou card)
    expect(screen.getAllByText('Carlos Editado').length).toBeGreaterThan(0)
    expect(screen.queryByText('Carlos Mendes')).not.toBeInTheDocument()
  })
})
