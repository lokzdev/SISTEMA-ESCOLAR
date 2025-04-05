// Estrutura de dados para armazenar os alunos
let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

// Variável para armazenar a seção anterior
let secaoAnterior = "cadastro";

// Variável para armazenar o ID do aluno a ser removido
let alunoParaRemover = null;

// Função para gerar uma matrícula única de 5 dígitos
function gerarMatricula() {
  // Gera um número aleatório de 5 dígitos (10000 a 99999)
  let matricula;
  let matriculaExiste;

  do {
    matricula = Math.floor(10000 + Math.random() * 90000);
    matriculaExiste = alunos.some((aluno) => aluno.matricula === matricula);
  } while (matriculaExiste);

  return matricula;
}

// Função para mostrar/esconder seções
function showSection(sectionId) {
  secaoAnterior = sectionId;
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.add("hidden");
  });
  document.getElementById(sectionId).classList.remove("hidden");
}

// Função para mostrar notificação
function mostrarNotificacao(titulo, mensagem, callback = null) {
  document.getElementById("notificacao-titulo").textContent = titulo;
  document.getElementById("notificacao-mensagem").textContent = mensagem;

  // Limpar botões anteriores
  const botoesContainer = document.querySelector(".notificacao-acoes");
  botoesContainer.innerHTML = "";

  // Adicionar botão de voltar
  const botaoVoltar = document.createElement("button");
  botaoVoltar.textContent = "Voltar";
  botaoVoltar.onclick = voltarParaSecaoAnterior;
  botoesContainer.appendChild(botaoVoltar);

  // Se houver um callback, adicionar botão de confirmação
  if (callback) {
    const botaoConfirmar = document.createElement("button");
    botaoConfirmar.textContent = "Confirmar";
    botaoConfirmar.onclick = () => {
      callback();
      voltarParaSecaoAnterior();
    };
    botoesContainer.appendChild(botaoConfirmar);
  }

  showSection("notificacao");
}

// Função para voltar para a seção anterior
function voltarParaSecaoAnterior() {
  showSection(secaoAnterior);
}

// Função para cadastrar aluno
function cadastrarAluno(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const turma = document.getElementById("turma").value;
  const matricula = gerarMatricula();

  const novoAluno = {
    id: Date.now(),
    nome,
    matricula,
    turma,
    faltas: [],
    notas: {},
  };

  alunos.push(novoAluno);
  salvarDados();
  atualizarSelects();
  atualizarTabela();

  document.getElementById("formCadastro").reset();
  mostrarNotificacao(
    "Aluno Cadastrado",
    `Aluno cadastrado com sucesso! Matrícula: ${matricula}`
  );
  return false;
}

// Função para registrar falta
function registrarFalta(event) {
  event.preventDefault();

  const alunoId = parseInt(document.getElementById("alunoFalta").value);
  const data = document.getElementById("dataFalta").value;

  const aluno = alunos.find((a) => a.id === alunoId);
  if (aluno) {
    aluno.faltas.push(data);
    salvarDados();
    atualizarTabela();
    mostrarNotificacao("Falta Registrada", "Falta registrada com sucesso!");
  }

  document.getElementById("formFaltas").reset();
  return false;
}

// Função para registrar nota
function registrarNota(event) {
  event.preventDefault();

  const alunoId = parseInt(document.getElementById("alunoNota").value);
  const disciplina = document.getElementById("disciplina").value;
  const nota = parseFloat(document.getElementById("nota").value);

  const aluno = alunos.find((a) => a.id === alunoId);
  if (aluno) {
    if (!aluno.notas[disciplina]) {
      aluno.notas[disciplina] = [];
    }
    aluno.notas[disciplina].push(nota);
    salvarDados();
    atualizarTabela();
    mostrarNotificacao("Nota Registrada", "Nota registrada com sucesso!");
  }

  document.getElementById("formNotas").reset();
  return false;
}

// Função para calcular média
function calcularMedia(notas) {
  if (!notas || Object.keys(notas).length === 0) return 0;

  let somaTotal = 0;
  let quantidadeTotal = 0;

  for (let disciplina in notas) {
    const notasDisciplina = notas[disciplina];
    const soma = notasDisciplina.reduce((a, b) => a + b, 0);
    somaTotal += soma;
    quantidadeTotal += notasDisciplina.length;
  }

  return quantidadeTotal > 0 ? (somaTotal / quantidadeTotal).toFixed(2) : 0;
}

// Função para atualizar a tabela de resultados
function atualizarTabela() {
  const tbody = document.getElementById("resultadosBody");
  tbody.innerHTML = "";

  alunos.forEach((aluno) => {
    const media = calcularMedia(aluno.notas);
    const status = media >= 7 ? "Aprovado" : "Reprovado";

    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${aluno.nome}</td>
            <td>${aluno.matricula}</td>
            <td>${aluno.turma}</td>
            <td>${aluno.faltas.length}</td>
            <td>${media}</td>
            <td>${status}</td>
            <td class="acoes">
                <button class="editar" onclick="editarAluno(${aluno.id})">Editar</button>
                <button class="remover" onclick="removerAluno(${aluno.id})">Remover</button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

// Função para atualizar os selects de alunos
function atualizarSelects() {
  const selects = ["alunoFalta", "alunoNota"];

  selects.forEach((selectId) => {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">Selecione um aluno</option>';

    alunos.forEach((aluno) => {
      const option = document.createElement("option");
      option.value = aluno.id;
      option.textContent = `${aluno.nome} (${aluno.matricula})`;
      select.appendChild(option);
    });
  });
}

// Função para editar aluno
function editarAluno(id) {
  const aluno = alunos.find((a) => a.id === id);
  if (aluno) {
    document.getElementById("aluno-id-edicao").value = aluno.id;
    document.getElementById("nome-edicao").value = aluno.nome;
    document.getElementById("turma-edicao").value = aluno.turma;
    document.getElementById("matricula-edicao").value = aluno.matricula;

    showSection("edicao-aluno");
  }
}

// Função para salvar edição de aluno
function salvarEdicaoAluno(event) {
  event.preventDefault();

  const id = parseInt(document.getElementById("aluno-id-edicao").value);
  const novoNome = document.getElementById("nome-edicao").value;
  const novaTurma = document.getElementById("turma-edicao").value;

  const aluno = alunos.find((a) => a.id === id);
  if (aluno) {
    aluno.nome = novoNome;
    aluno.turma = novaTurma;
    salvarDados();
    atualizarSelects();
    atualizarTabela();
    mostrarNotificacao(
      "Aluno Atualizado",
      "Dados do aluno atualizados com sucesso!"
    );
  }

  return false;
}

// Função para remover aluno
function removerAluno(id) {
  const aluno = alunos.find((a) => a.id === id);
  if (aluno) {
    alunoParaRemover = id;
    mostrarNotificacao(
      "Confirmar Remoção",
      `Tem certeza que deseja remover o aluno ${aluno.nome}?`,
      confirmarRemocaoAluno
    );
  }
}

// Função para confirmar remoção de aluno
function confirmarRemocaoAluno() {
  if (alunoParaRemover) {
    alunos = alunos.filter((a) => a.id !== alunoParaRemover);
    salvarDados();
    atualizarSelects();
    atualizarTabela();
    mostrarNotificacao("Aluno Removido", "Aluno removido com sucesso!");
    alunoParaRemover = null;
  }
}

// Função para salvar dados no localStorage
function salvarDados() {
  localStorage.setItem("alunos", JSON.stringify(alunos));
}

// Função para exportar dados para CSV
function exportarCSV() {
  let csv = "Nome,Matrícula,Turma,Faltas,Média,Status\n";

  alunos.forEach((aluno) => {
    const media = calcularMedia(aluno.notas);
    const status = media >= 7 ? "Aprovado" : "Reprovado";

    csv += `${aluno.nome},${aluno.matricula},${aluno.turma},${aluno.faltas.length},${media},${status}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", "alunos.csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  mostrarNotificacao(
    "Exportação Concluída",
    "Dados exportados para CSV com sucesso!"
  );
}

function definirDataHoje() {
  const hoje = new Date();
  const dataFormatada = hoje.toISOString().split("T")[0];
  document.getElementById("data-falta").value = dataFormatada;
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  atualizarSelects();
  atualizarTabela();
});
