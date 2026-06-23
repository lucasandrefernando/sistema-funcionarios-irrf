// Tela de carregamento exibida enquanto os dados dos funcionários são "buscados".
// Simula o comportamento real de uma aplicação que consome uma API.
import styles from './LoadingScreen.module.css'

export function LoadingScreen() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.spinner} />
        <span className={styles.titulo}>Gestão de Funcionários</span>
        <span className={styles.subtitulo}>Carregando dados...</span>
      </div>
    </div>
  )
}
