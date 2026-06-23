// Barra de filtros e ação principal da tela de listagem.
// Fica no topo da tabela: à esquerda os campos de busca, à direita o botão de cadastro.
import { aplicarMascaraCpf } from '../../utils/cpfMask'
import styles from './FilterBar.module.css'

interface FilterBarProps {
  filtroNome: string
  filtroCpf: string
  onChangeFiltroNome: (valor: string) => void
  onChangeFiltroCpf: (valor: string) => void
  onNovoFuncionario: () => void
}

export function FilterBar({
  filtroNome,
  filtroCpf,
  onChangeFiltroNome,
  onChangeFiltroCpf,
  onNovoFuncionario,
}: FilterBarProps) {
  return (
    <div className={styles.barra}>
      <div className={styles.filtros}>
        {/* filtro por nome — vai passando o valor para o pai que filtra a lista */}
        <input
          type="text"
          placeholder="Filtrar por nome"
          value={filtroNome}
          onChange={e => onChangeFiltroNome(e.target.value)}
          className={styles.input}
        />

        {/* filtro por CPF — aplica a máscara antes de repassar pro pai */}
        <input
          type="text"
          placeholder="Filtrar por CPF"
          value={filtroCpf}
          onChange={e => onChangeFiltroCpf(aplicarMascaraCpf(e.target.value))}
          className={styles.input}
        />
      </div>

      {/* abre o formulário de cadastro de novo funcionário */}
      <button onClick={onNovoFuncionario} className={styles.btnNovo}>
        Novo Funcionário
      </button>
    </div>
  )
}
