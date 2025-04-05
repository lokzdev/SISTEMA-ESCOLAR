# Sistema de Gestão Escolar

Um sistema web simples e intuitivo para gerenciamento de alunos, faltas e notas.

## Funcionalidades

- Cadastro de alunos com validação de dados
- Geração automática de matrícula única de 5 dígitos
- Registro de faltas por aluno
- Registro de notas por disciplina
- Cálculo automático de médias
- Visualização de resultados em tabela
- Exportação de dados para CSV
- Armazenamento local dos dados
- Interface responsiva

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- LocalStorage para persistência de dados

## Como Usar

1. Clone ou baixe este repositório
2. Abra o arquivo `index.html` em um navegador moderno
3. Comece a usar o sistema!

## Estrutura do Projeto

- `index.html` - Estrutura da página
- `styles.css` - Estilos e layout
- `script.js` - Lógica da aplicação

## Funcionalidades Principais

### Cadastro de Alunos

- Nome completo (apenas letras e espaços)
- Matrícula (gerada automaticamente com 5 dígitos)
- Turma

### Registro de Faltas

- Seleção do aluno
- Data da falta
- Histórico de faltas

### Notas e Médias

- Registro de notas por disciplina
- Cálculo automático de média
- Status de aprovação (média ≥ 7)

### Visualização de Resultados

- Tabela com todos os dados
- Opções de edição e remoção
- Exportação para CSV

## Validações

- Matrícula única gerada automaticamente
- Nome apenas com letras e espaços
- Notas entre 0 e 10
- Campos obrigatórios

## Compatibilidade

O sistema é compatível com os principais navegadores modernos:

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

## Contribuição

Sinta-se à vontade para contribuir com o projeto através de pull requests ou reportando issues.

## Licença

Este projeto está sob a licença MIT.
