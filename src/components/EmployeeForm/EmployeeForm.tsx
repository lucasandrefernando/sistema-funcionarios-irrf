// Formulário de cadastro e edição de funcionários.
// Serve pra criar um novo ou editar um existente — o modo muda dependendo da prop `funcionario`.
// Também mostra uma prévia do IRRF calculado em tempo real enquanto o usuário digita.
import { useState, useEffect } from 'react'
import type { Employee, EmployeeFormData } from '../../types/employee'
import { aplicarMascaraCpf } from '../../utils/cpfMask'
import { calcularSalarioBaseIR, calcularDescontoIRRF } from '../../utils/irrfCalculator'
import { formatarMoeda } from '../../utils/formatCurrency'
import styles from './EmployeeForm.module.css'

interface EmployeeFormProps {
  // quando recebe um funcionário, abre em modo edição; sem ele, modo criação
  funcionario?: Employee | null
  onSalvar: (dados: EmployeeFormData) => void
  onCancelar: () => void
}

// estado inicial do formulário — campos em branco para o modo de criação
const FORM_VAZIO: EmployeeFormData = {
  nome: '',
  cpf: '',
  salarioBruto: 0,
  descontoPrevidencia: 0,
  numeroDependentes: 0,
}

export function EmployeeForm({ funcionario, onSalvar, onCancelar }: EmployeeFormProps) {
  const [form, setForm] = useState<EmployeeFormData>(FORM_VAZIO)
  const [erros, setErros] = useState<Partial<Record<keyof EmployeeFormData, string>>>({})

  // toda vez que o funcionário muda (troca de edição ou abre criação), reseta o formulário
  useEffect(() => {
    if (funcionario) {
      // modo edição: preenche com os dados que já existem
      setForm({
        nome: funcionario.nome,
        cpf: funcionario.cpf,
        salarioBruto: funcionario.salarioBruto,
        descontoPrevidencia: funcionario.descontoPrevidencia,
        numeroDependentes: funcionario.numeroDependentes,
      })
    } else {
      // modo criação: começa do zero
      setForm(FORM_VAZIO)
    }
    // limpa os erros de uma sessão anterior
    setErros({})
  }, [funcionario])

  // recalcula ao vivo para mostrar a prévia do IRRF antes de salvar
  const baseIR = calcularSalarioBaseIR(form.salarioBruto, form.descontoPrevidencia, form.numeroDependentes)
  const descontoIRRF = calcularDescontoIRRF(baseIR)

  // valida os campos obrigatórios antes de submeter
  function validar(): boolean {
    const novosErros: Partial<Record<keyof EmployeeFormData, string>> = {}

    if (!form.nome.trim()) novosErros.nome = 'Nome é obrigatório'
    // CPF precisa ter os 11 dígitos numéricos completos
    if (!form.cpf || form.cpf.replace(/\D/g, '').length < 11) novosErros.cpf = 'CPF inválido'
    if (form.salarioBruto <= 0) novosErros.salarioBruto = 'Salário deve ser maior que zero'
    if (form.descontoPrevidencia < 0) novosErros.descontoPrevidencia = 'Desconto não pode ser negativo'
    if (form.numeroDependentes < 0) novosErros.numeroDependentes = 'Não pode ser negativo'

    setErros(novosErros)
    // se não gerou nenhum erro, o formulário está válido
    return Object.keys(novosErros).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // só chama o pai se passar na validação
    if (validar()) onSalvar(form)
  }

  // aplica a máscara de CPF enquanto o usuário digita
  function handleCpf(valor: string) {
    setForm(f => ({ ...f, cpf: aplicarMascaraCpf(valor) }))
  }

  // converte o string do input numérico para número de verdade
  function handleNumero(campo: keyof EmployeeFormData, valor: string) {
    const num = parseFloat(valor)
    setForm(f => ({ ...f, [campo]: isNaN(num) ? 0 : num }))
  }

  // título muda dependendo do modo
  const titulo = funcionario ? 'Editar Funcionário' : 'Novo Funcionário'

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.titulo}>{titulo}</h2>

      {/* campo de nome */}
      <div className={styles.campo}>
        <label className={styles.label}>Nome</label>
        <input
          className={`${styles.input} ${erros.nome ? styles.inputErro : ''}`}
          type="text"
          value={form.nome}
          onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
          placeholder="Nome completo"
        />
        {erros.nome && <span className={styles.erro}>{erros.nome}</span>}
      </div>

      {/* campo de CPF com máscara automática */}
      <div className={styles.campo}>
        <label className={styles.label}>CPF</label>
        <input
          className={`${styles.input} ${erros.cpf ? styles.inputErro : ''}`}
          type="text"
          value={form.cpf}
          onChange={e => handleCpf(e.target.value)}
          placeholder="000.000.000-00"
          maxLength={14}
        />
        {erros.cpf && <span className={styles.erro}>{erros.cpf}</span>}
      </div>

      {/* três campos numéricos lado a lado: salário, desconto e dependentes */}
      <div className={styles.linha2}>
        <div className={styles.campo}>
          <label className={styles.label}>Salário Bruto</label>
          <input
            className={`${styles.input} ${erros.salarioBruto ? styles.inputErro : ''}`}
            type="number"
            min="0"
            step="0.01"
            value={form.salarioBruto || ''}
            onChange={e => handleNumero('salarioBruto', e.target.value)}
            placeholder="0,00"
          />
          {erros.salarioBruto && <span className={styles.erro}>{erros.salarioBruto}</span>}
        </div>

        <div className={styles.campo}>
          <label className={styles.label}>Desconto Previdência</label>
          <input
            className={`${styles.input} ${erros.descontoPrevidencia ? styles.inputErro : ''}`}
            type="number"
            min="0"
            step="0.01"
            value={form.descontoPrevidencia || ''}
            onChange={e => handleNumero('descontoPrevidencia', e.target.value)}
            placeholder="0,00"
          />
          {erros.descontoPrevidencia && <span className={styles.erro}>{erros.descontoPrevidencia}</span>}
        </div>

        <div className={styles.campo}>
          <label className={styles.label}>Dependentes</label>
          <input
            className={`${styles.input} ${erros.numeroDependentes ? styles.inputErro : ''}`}
            type="number"
            min="0"
            step="1"
            value={form.numeroDependentes || ''}
            onChange={e => handleNumero('numeroDependentes', e.target.value)}
            placeholder="0"
          />
          {erros.numeroDependentes && <span className={styles.erro}>{erros.numeroDependentes}</span>}
        </div>
      </div>

      {/* área somente leitura — mostra o resultado do cálculo em tempo real */}
      <div className={styles.calculados}>
        <div className={styles.itemCalculado}>
          <span className={styles.labelCalc}>Base de Cálculo IR</span>
          <span className={styles.valorCalc}>{formatarMoeda(baseIR)}</span>
        </div>
        <div className={styles.itemCalculado}>
          <span className={styles.labelCalc}>Desconto IRRF</span>
          <span className={styles.valorCalc}>{formatarMoeda(descontoIRRF)}</span>
        </div>
      </div>

      {/* botões de ação no rodapé do formulário */}
      <div className={styles.botoes}>
        <button type="button" className={styles.btnCancelar} onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className={styles.btnSalvar}>
          Salvar
        </button>
      </div>
    </form>
  )
}
