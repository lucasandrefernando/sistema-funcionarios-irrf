# Gestão de Funcionários — IRRF

Sistema web para cadastro e gerenciamento de funcionários com cálculo automático de Imposto de Renda Retido na Fonte (IRRF), desenvolvido como teste técnico para a Seidor / 4tax.

## Tecnologias utilizadas

- **React 19** + **TypeScript** — interface e tipagem estática
- **Vite** — bundler e servidor de desenvolvimento
- **Context API + useReducer** — gerenciamento de estado global (sem Redux)
- **CSS Modules** — estilização escopada por componente, sem frameworks CSS
- **Vitest + React Testing Library** — testes unitários e de integração

## Pré-requisitos

- [Node.js](https://nodejs.org/) **v18 ou superior**
- npm (incluído na instalação do Node.js)

## Como executar

```bash
# 1. instalar as dependências
npm install

# 2. iniciar o servidor de desenvolvimento
npm run dev
```

Acesse **http://localhost:5173** no navegador.

## Como rodar os testes

```bash
# roda todos os testes uma vez
npm test

# relatório de cobertura
npm run coverage
```

O projeto possui **40 testes** divididos em:

- **Unitários:** cálculo IRRF (todas as faixas), máscara CPF, formatação de moeda, reducer
- **Componentes:** FilterBar, EmployeeForm, EmployeeTable, ConfirmModal
- **Integração:** fluxos completos de cadastro, edição, exclusão e filtro no App

## Funcionalidades

- Cadastro de funcionários com cálculo automático de IRRF ao salvar
- Edição com recálculo automático dos valores
- Exclusão com modal de confirmação
- Listagem com colunas: Nome, CPF, Salário, Desconto, Dependentes, **Base IR**, Desconto IRPF
- Filtro em tempo real por nome e por CPF (funciona com ou sem máscara)
- Validação de campos no formulário (nome, CPF e salário obrigatórios)
- Tela de carregamento animada na inicialização
- Layout totalmente responsivo — tabela no desktop, cards empilhados no mobile

## Cálculo do IRRF

```
Salário Base IR = Salário Bruto − Desconto Previdência − (R$ 189,59 × Nº Dependentes)
Desconto IRRF   = Salário Base IR × Alíquota − Parcela a Deduzir
```

**Tabela progressiva:**

| Faixa (Salário Base IR)     | Alíquota | Parcela a Deduzir |
|-----------------------------|----------|-------------------|
| Até R$ 2.259,20             | Isento   | —                 |
| R$ 2.259,21 a R$ 2.826,65  | 7,5%     | R$ 169,44         |
| R$ 2.826,66 a R$ 3.751,05  | 15%      | R$ 381,44         |
| R$ 3.751,06 a R$ 4.664,68  | 22,5%    | R$ 662,77         |
| Acima de R$ 4.664,68        | 27,5%    | R$ 896,00         |

## Estrutura do projeto

```
src/
├── assets/
│   └── seidor-customer-logo.png  # logo exibida no header
├── components/
│   ├── ConfirmModal/    # modal de confirmação de exclusão
│   ├── EmployeeForm/    # formulário de cadastro e edição
│   ├── EmployeeTable/   # tabela (desktop) e cards (mobile)
│   ├── FilterBar/       # filtros por nome/CPF e botão de novo cadastro
│   ├── Layout/          # header com logo e estrutura base da página
│   └── LoadingScreen/   # tela animada exibida enquanto os dados carregam
├── context/
│   └── EmployeeContext.tsx  # estado global com Context API + useReducer
├── data/
│   └── employees.json       # 5 funcionários de exemplo (uma por faixa do IRRF)
├── types/
│   └── employee.ts          # interfaces TypeScript
└── utils/
    ├── cpfMask.ts           # máscara incremental de CPF (000.000.000-00)
    ├── formatCurrency.ts    # formatação monetária em R$
    └── irrfCalculator.ts   # cálculo do Salário Base IR e do Desconto IRRF
```
