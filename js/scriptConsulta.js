document.addEventListener("DOMContentLoaded", () => {
  const estadoSelect = document.getElementById("estado");
  const cidadeSelect = document.getElementById("cidade");
  const hospitalSelect = document.getElementById("hospital");
  const dataInput = document.getElementById("data");
  const formPesquisa = document.getElementById("form-pesquisa");
  const secaoHorarios = document.getElementById("secao-horarios");
  const horariosContainer = document.getElementById("horarios-container");
  const btnConfirmar = document.getElementById("btn-confirmar");
  const listaAgendamentosUI = document.getElementById("lista-agendamentos");

  let horarioSelecionado = null;

  function atualizarDisponibilidadeHorarios() {
    const hospitalSelecionado = hospitalSelect.value;
    const dataSelecionada = dataInput.value;

    if (!hospitalSelecionado || !dataSelecionada) {
      return;
    }

    const agendamentos = JSON.parse(localStorage.getItem('agendamentosSalvos')) || [];
    const todosOsBotoes = horariosContainer.querySelectorAll(".btn-horario");

    const agora = new Date();
    const hojeString = agora.toISOString().split("T")[0];
    const horaAtual = agora.getHours();

    todosOsBotoes.forEach(botao => {
      const horarioDoBotao = botao.dataset.horario;

      const agendamentoExiste = agendamentos.some(ag =>
        ag.hospital === hospitalSelecionado &&
        ag.data === dataSelecionada &&
        ag.horario === horarioDoBotao
      );

      let horarioJaPassou = false;
      if (dataSelecionada === hojeString) {
        const horaDoBotao = parseInt(horarioDoBotao.split(':')[0]);
        if (horaAtual >= horaDoBotao) {
          horarioJaPassou = true;
        }
      }

      if (agendamentoExiste || horarioJaPassou) {
        botao.disabled = true;
        botao.classList.add("indisponivel");
      } else {
        botao.disabled = false;
        botao.classList.remove("indisponivel");
      }
    });
  }

  function carregarAgendamentosSalvos() { const agendamentos = JSON.parse(localStorage.getItem('agendamentosSalvos')) || []; listaAgendamentosUI.innerHTML = ''; if (agendamentos.length === 0) { listaAgendamentosUI.innerHTML = '<li>Nenhum agendamento prévio.</li>'; } else { agendamentos.forEach((ag, index) => { const dataFormatada = new Date(ag.data + 'T00:00:00').toLocaleDateString('pt-BR'); const listItem = document.createElement('li'); const textoSpan = document.createElement('span'); textoSpan.textContent = `✅ ${ag.hospital} - ${dataFormatada} às ${ag.horario}`; const btnExcluir = document.createElement('button'); btnExcluir.className = 'btn-excluir'; btnExcluir.textContent = 'X'; btnExcluir.title = 'Excluir agendamento'; btnExcluir.dataset.agendamentoId = index; listItem.appendChild(textoSpan); listItem.appendChild(btnExcluir); listaAgendamentosUI.appendChild(listItem); }); } }
  function verificarAgendamentoDuplicado(novoAgendamento) { const agendamentos = JSON.parse(localStorage.getItem('agendamentosSalvos')) || []; return agendamentos.some(ag => ag.hospital === novoAgendamento.hospital && ag.data === novoAgendamento.data && ag.horario === novoAgendamento.horario); }
  const hoje = new Date().toISOString().split("T")[0]; dataInput.min = hoje;
  const dadosLocais = { "1502105": { nome: "Canaã dos Carajás", hospitais: ["HOSPITAL MUNICIPAL DANIEL GONCALVES", "HOSPITAL 5 DE OUTUBRO"] }, "1504200": { nome: "Marabá", hospitais: ["HOSPITAL REGIONAL DO SUDESTE DO PARA DR GERALDO VELOSO", "HOSPITAL MATERNO INFANTIL DE MARABA", "HOSPITAL MUNICIPAL DE MARABA"] }, "1505530": { nome: "Parauapebas", hospitais: ["HOSPITAL GERAL DE PARAUAPEBAS", "HOSPITAL SANTA TEREZINHA", "YUTAKA Takeda"] } };
  const hospitaisPadrao = [{ value: "HOSPITAL_REGIONAL", text: "Verificar no Hospital Regional mais próximo" }, { value: "POSTO_SAUDE", text: "Consultar Posto de Saúde local para encaminhamento" }, { value: "OUTRO", text: "Outro - especificar na consulta" }];
  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome").then(res => res.json()).then(estados => { estados.forEach(estado => { const option = document.createElement("option"); option.value = estado.id; option.textContent = estado.nome; estadoSelect.appendChild(option); }); });
  estadoSelect.addEventListener("change", () => { const estadoSelecionadoId = estadoSelect.value; resetCidadeEHospital(); if (estadoSelecionadoId) { cidadeSelect.disabled = false; if (estadoSelecionadoId === "15") { for (const codigoCidade in dadosLocais) { const cidade = dadosLocais[codigoCidade]; const option = document.createElement("option"); option.value = codigoCidade; option.textContent = cidade.nome; cidadeSelect.appendChild(option); } } else { fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionadoId}/municipios?orderBy=nome`).then(res => res.json()).then(cidades => { cidades.forEach(cidade => { const option = document.createElement("option"); option.value = cidade.id; option.textContent = cidade.nome; cidadeSelect.appendChild(option); }); }); } } });
  cidadeSelect.addEventListener("change", () => { const codigoCidade = cidadeSelect.value; resetHospital(); if (codigoCidade) { hospitalSelect.disabled = false; if (dadosLocais[codigoCidade]) { const hospitais = dadosLocais[codigoCidade].hospitais; hospitais.forEach(nomeHospital => { const option = document.createElement("option"); option.value = nomeHospital; option.textContent = nomeHospital; hospitalSelect.appendChild(option); }); } else { hospitaisPadrao.forEach(item => { const option = document.createElement("option"); option.value = item.value; option.textContent = item.text; hospitalSelect.appendChild(option); }); } } atualizarDisponibilidadeHorarios(); });
  hospitalSelect.addEventListener('change', atualizarDisponibilidadeHorarios);
  dataInput.addEventListener('change', atualizarDisponibilidadeHorarios);
  formPesquisa.addEventListener("submit", (event) => { event.preventDefault(); if (estadoSelect.value && cidadeSelect.value && hospitalSelect.value && dataInput.value) { secaoHorarios.style.display = "block"; setTimeout(() => { secaoHorarios.style.opacity = 1; }, 10); atualizarDisponibilidadeHorarios(); } else { alert("Por favor, preencha todos os campos antes de pesquisar."); } });
  horariosContainer.addEventListener("click", (event) => { if (event.target.classList.contains("btn-horario") && !event.target.disabled) { const todosOsBotoes = horariosContainer.querySelectorAll(".btn-horario"); todosOsBotoes.forEach(btn => btn.classList.remove("selecionado")); const botaoClicado = event.target; botaoClicado.classList.add("selecionado"); horarioSelecionado = botaoClicado.dataset.horario; btnConfirmar.style.display = "block"; } });
  btnConfirmar.addEventListener("click", () => { if (!horarioSelecionado) { alert("Por favor, selecione um horário."); return; } const agendamentoAtual = { hospital: hospitalSelect.value, data: dataInput.value, horario: horarioSelecionado }; if (verificarAgendamentoDuplicado(agendamentoAtual)) { alert("❌ Erro! Você já possui um agendamento exatamente igual."); return; } const agendamentosAnteriores = JSON.parse(localStorage.getItem('agendamentosSalvos')) || []; agendamentosAnteriores.push(agendamentoAtual); localStorage.setItem('agendamentosSalvos', JSON.stringify(agendamentosAnteriores)); alert(`Agendamento Confirmado! ✅\n\nResumo:\n- Hospital: ${agendamentoAtual.hospital}\n- Data: ${new Date(agendamentoAtual.data + 'T00:00:00').toLocaleDateString('pt-BR')}\n- Horário: ${agendamentoAtual.horario}`); carregarAgendamentosSalvos(); atualizarDisponibilidadeHorarios(); btnConfirmar.style.display = 'none'; horarioSelecionado = null; const botaoSelecionado = horariosContainer.querySelector('.btn-horario.selecionado'); if (botaoSelecionado) { botaoSelecionado.classList.remove('selecionado'); } });
  listaAgendamentosUI.addEventListener('click', (event) => { if (event.target.classList.contains('btn-excluir')) { const confirmar = confirm("Tem certeza que deseja excluir este agendamento?"); if (confirmar) { const agendamentoId = parseInt(event.target.dataset.agendamentoId); let agendamentos = JSON.parse(localStorage.getItem('agendamentosSalvos')) || []; agendamentos.splice(agendamentoId, 1); localStorage.setItem('agendamentosSalvos', JSON.stringify(agendamentos)); carregarAgendamentosSalvos(); atualizarDisponibilidadeHorarios(); } } });
  function resetCidadeEHospital() { cidadeSelect.innerHTML = '<option value="">Selecione a Cidade</option>'; cidadeSelect.disabled = true; resetHospital(); }
  function resetHospital() { hospitalSelect.innerHTML = '<option value="">Selecione o Hospital</option>'; hospitalSelect.disabled = true; }

  carregarAgendamentosSalvos();

  setInterval(atualizarDisponibilidadeHorarios, 60000);
});