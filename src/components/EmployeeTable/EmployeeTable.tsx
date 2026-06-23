// Tabela principal que lista todos os funcionários cadastrados.
// No desktop mostra uma tabela completa; no mobile renderiza cards — muito mais legível em tela pequena.
import type { Employee } from '../../types/employee'
import { formatarMoeda } from '../../utils/formatCurrency'
import styles from './EmployeeTable.module.css'

interface EmployeeTableProps {
  funcionarios: Employee[]
  // saber se tem filtro ativo ajuda a exibir a mensagem certa quando a lista está vazia
  temFiltroAtivo?: boolean
  onEditar: (funcionario: Employee) => void
  onExcluir: (id: string) => void
}

export function EmployeeTable({ funcionarios, temFiltroAtivo, onEditar, onExcluir }: EmployeeTableProps) {
  // se não tem nenhum funcionário pra mostrar, exibe uma mensagem adequada
  if (funcionarios.length === 0) {
    // a mensagem muda dependendo se o resultado vazio é por causa de um filtro ou se não tem ninguém cadastrado
    const msg = temFiltroAtivo
      ? 'Nenhum resultado para os filtros aplicados.'
      : 'Nenhum funcionário cadastrado.'
    return <p className={styles.vazio}>{msg}</p>
  }

  return (
    <>
      {/* ── DESKTOP: tabela tradicional ─────────────────────────── */}
      <div className={styles.container}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              {/* colunas conforme especificação do PDF — não alterar a ordem */}
              <th>Nome</th>
              <th>CPF</th>
              <th>Salário</th>
              <th>Desconto</th>
              <th>Dependentes</th>
              <th>Base IR</th>
              <th>Desconto IRPF</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionarios.map(f => (
              <tr key={f.id}>
                <td>{f.nome}</td>
                <td>{f.cpf}</td>
                {/* valores monetários sempre formatados em R$ com vírgula */}
                <td>{formatarMoeda(f.salarioBruto)}</td>
                <td>{formatarMoeda(f.descontoPrevidencia)}</td>
                <td>{f.numeroDependentes}</td>
                {/* salarioBaseIR e descontoIRRF são calculados automaticamente */}
                <td>{formatarMoeda(f.salarioBaseIR)}</td>
                <td>{formatarMoeda(f.descontoIRRF)}</td>
                <td className={styles.acoes}>
                  <button className={styles.btnEditar} onClick={() => onEditar(f)}>Editar</button>
                  <button className={styles.btnExcluir} onClick={() => onExcluir(f.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE: lista de cards — mais fácil de ler em tela pequena ── */}
      <ul className={styles.listaCards}>
        {funcionarios.map(f => (
          <li key={f.id} className={styles.card}>
            {/* nome em destaque no topo do card */}
            <span className={styles.cardNome}>{f.nome}</span>
            <span className={styles.cardCpf}>{f.cpf}</span>

            {/* grade com os valores — dois por linha */}
            <div className={styles.cardGrade}>
              <div className={styles.cardItem}>
                <span className={styles.cardLabel}>Salário Bruto</span>
                <span className={styles.cardValor}>{formatarMoeda(f.salarioBruto)}</span>
              </div>
              <div className={styles.cardItem}>
                <span className={styles.cardLabel}>Desc. Previdência</span>
                <span className={styles.cardValor}>{formatarMoeda(f.descontoPrevidencia)}</span>
              </div>
              <div className={styles.cardItem}>
                <span className={styles.cardLabel}>Dependentes</span>
                <span className={styles.cardValor}>{f.numeroDependentes}</span>
              </div>
              <div className={styles.cardItem}>
                <span className={styles.cardLabel}>Base IR</span>
                <span className={styles.cardValor}>{formatarMoeda(f.salarioBaseIR)}</span>
              </div>
              {/* desconto IRPF ocupa a largura toda para dar destaque */}
              <div className={`${styles.cardItem} ${styles.cardItemDestaque}`}>
                <span className={styles.cardLabel}>Desconto IRPF</span>
                <span className={styles.cardValorDestaque}>{formatarMoeda(f.descontoIRRF)}</span>
              </div>
            </div>

            <div className={styles.cardAcoes}>
              <button className={styles.btnEditar} onClick={() => onEditar(f)}>Editar</button>
              <button className={styles.btnExcluir} onClick={() => onExcluir(f.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
