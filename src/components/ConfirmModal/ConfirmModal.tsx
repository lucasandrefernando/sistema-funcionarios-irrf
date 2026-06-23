// Modal de confirmação antes de executar uma ação destrutiva (excluir funcionário).
// Aparece sobre a tela com um fundo escuro e dois botões: cancelar ou confirmar.
import styles from './ConfirmModal.module.css'

interface ConfirmModalProps {
  mensagem: string
  onConfirmar: () => void
  onCancelar: () => void
}

export function ConfirmModal({ mensagem, onConfirmar, onCancelar }: ConfirmModalProps) {
  return (
    // o overlay cobre toda a tela — clicar fora do box cancela a ação
    <div className={styles.overlay} onClick={onCancelar}>
      {/*
        stopPropagation impede que o clique dentro do box chegue até o overlay,
        o que cancelaria a ação sem querer
      */}
      <div className={styles.box} onClick={e => e.stopPropagation()}>
        <p className={styles.mensagem}>{mensagem}</p>

        <div className={styles.botoes}>
          <button className={styles.btnCancelar} onClick={onCancelar}>
            Cancelar
          </button>
          {/* botão de confirmar em vermelho para reforçar que é uma ação perigosa */}
          <button className={styles.btnConfirmar} onClick={onConfirmar}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
