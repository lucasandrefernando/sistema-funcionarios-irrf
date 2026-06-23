// Componente de layout base — envolve todas as páginas do sistema.
// Tem o header fixo no topo (com logo e título) e uma área de conteúdo que cresce conforme a página precisa.
import type { ReactNode } from 'react'
import logo from '../../assets/seidor-customer-logo.png'
import styles from './Layout.module.css'

interface LayoutProps {
  // qualquer componente filho pode ser passado aqui
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    // wrapper ocupa a altura total da tela e empilha header + conteúdo verticalmente
    <div className={styles.wrapper}>
      <header className={styles.header}>
        {/* container branco para a logo — o PNG tem fundo claro e precisa de contexto adequado no header escuro */}
        <div className={styles.logoBox}>
          <img src={logo} alt="Seidor" className={styles.logo} />
        </div>
        <span className={styles.divisor} />
        <span className={styles.titulo}>Gestão de Funcionários — IRRF</span>
      </header>

      {/* área principal onde cada tela renderiza seu conteúdo */}
      <main className={styles.conteudo}>{children}</main>
    </div>
  )
}
