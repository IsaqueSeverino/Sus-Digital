document.addEventListener("DOMContentLoaded", () => {

    // ===================================================================
    //  1. SELEÇÃO DOS ELEMENTOS DO DOM (A "PONTE" COM O HTML)
    // ===================================================================

    // Elementos do formulário principal
    const estadoSelect = document.getElementById("estado");
    const cidadeSelect = document.getElementById("cidade");
    const hospitalSelect = document.getElementById("hospital");
    const dataInput = document.getElementById("data");
    const formPesquisa = document.getElementById("form-pesquisa");

    // Elementos da seção de horários
    const secaoHorarios = document.getElementById("secao-horarios");
    const horariosContainer = document.getElementById("horarios-container");
    const btnConfirmar = document.getElementById("btn-confirmar");
    
    // Elementos da lista de agendamentos já realizados
    const listaAgendamentosUI = document.getElementById("lista-agendamentos");


    // ===================================================================
    //  2. DADOS E ESTADO DA APLICAÇÃO
    // ===================================================================

    // Variável que guarda o horário selecionado pelo usuário
    let horarioSelecionado = null;

    // Objeto com dados específicos para hospitais em cidades prioritárias
    const dadosLocais = {
        "1502105": { nome: "Canaã dos Carajás", hospitais: ["HOSPITAL MUNICIPAL DANIEL GONCALVES", "HOSPITAL 5 DE OUTUBRO"] },
        "1504200": { nome: "Marabá", hospitais: ["HOSPITAL REGIONAL DO SUDESTE DO PARA DR GERALDO VELOSO", "HOSPITAL MATERNO INFANTIL DE MARABA", "HOSPITAL MUNICIPAL DE MARABA"] },
        "1505530": { nome: "Parauapebas", hospitais: ["HOSPITAL GERAL DE PARAUAPEBAS", "HOSPITAL SANTA TEREZINHA", "YUTAKA Takeda"] }
    };

    // Lista de opções padrão para hospitais em cidades não prioritárias
    const hospitaisPadrao = [
        { value: "HOSPITAL_REGIONAL", text: "Verificar no Hospital Regional mais próximo" },
        { value: "POSTO_SAUDE", text: "Consultar Posto de Saúde local para encaminhamento" },
        { value: "OUTRO", text: "Outro - especificar na consulta" }
    ];


    // ===================================================================
    //  3. FUNÇÕES PRINCIPAIS (O "CÉREBRO" DA APLICAÇÃO)
    // ===================================================================

    /**
     * Atualiza a disponibilidade dos botões de horário.
     * Desabilita horários já agendados ou que já passaram no dia de hoje.
     */
    function atualizarDisponibilidadeHorarios() {
        const hospitalSelecionado = hospitalSelect.value;
        const dataSelecionada = dataInput.value;
        
        if (!hospitalSelecionado || !dataSelecionada) {
            return; // Sai da função se não houver dados suficientes
        }

        const agendamentos = JSON.parse(localStorage.getItem('agendamentosSalvos')) || [];
        const todosOsBotoes = horariosContainer.querySelectorAll(".btn-horario");

        const agora = new Date();
        const hojeString = agora.toISOString().split("T")[0];
        const horaAtual = agora.getHours();

        todosOsBotoes.forEach(botao => {
            const horarioDoBotao = botao.dataset.horario;

            // Condição 1: Verifica se já existe um agendamento no localStorage
            const agendamentoExiste = agendamentos.some(ag =>
                ag.hospital === hospitalSelecionado &&
                ag.data === dataSelecionada &&
                ag.horario === horarioDoBotao
            );

            // Condição 2: Verifica se o horário já passou (apenas para o dia de hoje)
            let horarioJaPassou = false;
            if (dataSelecionada === hojeString) {
                const horaDoBotao = parseInt(horarioDoBotao.split(':')[0]);
                if (horaAtual >= horaDoBotao) {
                    horarioJaPassou = true;
                }
            }

            // Desabilita o botão se qualquer condição for verdadeira
            if (agendamentoExiste || horarioJaPassou) {
                botao.disabled = true;
                botao.classList.add("indisponivel");
            } else {
                botao.disabled = false;
                botao.classList.remove("indisponivel");
            }
        });
    }

    /**
     * Lê os agendamentos do localStorage e os exibe na tela como uma lista.
     */
    function carregarAgendamentosSalvos() {
        const agendamentos = JSON.parse(localStorage.getItem('agendamentosSalvos')) || [];
        
        listaAgendamentosUI.innerHTML = ''; // Limpa a lista antes de recarregar
        
        if (agendamentos.length === 0) {
            listaAgendamentosUI.innerHTML = '<li>Nenhum agendamento prévio.</li>';
            return;
        }
        
        agendamentos.forEach((ag, index) => {
            const dataFormatada = new Date(ag.data + 'T00:00:00').toLocaleDateString('pt-BR');
            
            const listItem = document.createElement('li');
            const textoSpan = document.createElement('span');
            const btnExcluir = document.createElement('button');

            textoSpan.textContent = `✅ ${ag.hospital} - ${dataFormatada} às ${ag.horario}`;
            
            btnExcluir.className = 'btn-excluir';
            btnExcluir.textContent = 'X';
            btnExcluir.title = 'Excluir agendamento';
            btnExcluir.dataset.agendamentoId = index;

            listItem.appendChild(textoSpan);
            listItem.appendChild(btnExcluir);

            listaAgendamentosUI.appendChild(listItem);
        });
    }

    /**
     * Verifica se um novo agendamento já existe no localStorage.
     * @param {object} novoAgendamento - O objeto do agendamento a ser verificado.
     * @returns {boolean} - True se for duplicado, false caso contrário.
     */
    function verificarAgendamentoDuplicado(novoAgendamento) {
        const agendamentos = JSON.parse(localStorage.getItem('agendamentosSalvos')) || [];
        return agendamentos.some(ag => 
            ag.hospital === novoAgendamento.hospital &&
            ag.data === novoAgendamento.data &&
            ag.horario === novoAgendamento.horario
        );
    }


    // ===================================================================
    //  4. FUNÇÕES AUXILIARES (DE "LIMPEZA")
    // ===================================================================

    function resetCidadeEHospital() {
        cidadeSelect.innerHTML = '<option value="">Selecione a Cidade</option>';
        cidadeSelect.disabled = true;
        resetHospital();
    }

    function resetHospital() {
        hospitalSelect.innerHTML = '<option value="">Selecione o Hospital</option>';
        hospitalSelect.disabled = true;
    }


    // ===================================================================
    //  5. EVENT LISTENERS (OS "OUVIDOS" DA APLICAÇÃO)
    // ===================================================================

    // --- Carregamento Inicial de Estados ---
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
        .then(response => response.json())
        .then(estados => {
            estados.forEach(estado => {
                const option = document.createElement("option");
                option.value = estado.id;
                option.textContent = estado.nome;
                estadoSelect.appendChild(option);
            });
        });

    // --- Quando o usuário muda o Estado ---
    estadoSelect.addEventListener("change", () => {
        const estadoSelecionadoId = estadoSelect.value;
        resetCidadeEHospital();

        if (estadoSelecionadoId) {
            cidadeSelect.disabled = false;

            if (estadoSelecionadoId === "15") { // Lógica especial para o Pará
                for (const codigoCidade in dadosLocais) {
                    const cidade = dadosLocais[codigoCidade];
                    const option = document.createElement("option");
                    option.value = codigoCidade;
                    option.textContent = cidade.nome;
                    cidadeSelect.appendChild(option);
                }
            } else { // Lógica padrão para outros estados
                fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionadoId}/municipios?orderBy=nome`)
                    .then(response => response.json())
                    .then(cidades => {
                        cidades.forEach(cidade => {
                            const option = document.createElement("option");
                            option.value = cidade.id;
                            option.textContent = cidade.nome;
                            cidadeSelect.appendChild(option);
                        });
                    });
            }
        }
    });

    // --- Quando o usuário muda a Cidade ---
    cidadeSelect.addEventListener("change", () => {
        const codigoCidade = cidadeSelect.value;
        resetHospital();

        if (codigoCidade) {
            hospitalSelect.disabled = false;

            if (dadosLocais[codigoCidade]) {
                const hospitais = dadosLocais[codigoCidade].hospitais;
                hospitais.forEach(nomeHospital => {
                    const option = document.createElement("option");
                    option.value = nomeHospital;
                    option.textContent = nomeHospital;
                    hospitalSelect.appendChild(option);
                });
            } else {
                hospitaisPadrao.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.value;
                    option.textContent = item.text;
                    hospitalSelect.appendChild(option);
                });
            }
        }
        atualizarDisponibilidadeHorarios();
    });

    // --- Quando o Hospital ou a Data mudam, atualiza a disponibilidade ---
    hospitalSelect.addEventListener('change', atualizarDisponibilidadeHorarios);
    dataInput.addEventListener('change', atualizarDisponibilidadeHorarios);

    // --- Quando o formulário de pesquisa é enviado ---
    formPesquisa.addEventListener("submit", (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        if (estadoSelect.value && cidadeSelect.value && hospitalSelect.value && dataInput.value) {
            secaoHorarios.style.display = "block";
            setTimeout(() => { secaoHorarios.style.opacity = 1; }, 10);
            
            atualizarDisponibilidadeHorarios();
        } else {
            alert("Por favor, preencha todos os campos antes de pesquisar.");
        }
    });

    // --- Quando um Horário é selecionado ---
    horariosContainer.addEventListener("click", (event) => {
        const botaoClicado = event.target;
        if (botaoClicado.classList.contains("btn-horario") && !botaoClicado.disabled) {
            const todosOsBotoes = horariosContainer.querySelectorAll(".btn-horario");
            todosOsBotoes.forEach(btn => btn.classList.remove("selecionado"));
            
            botaoClicado.classList.add("selecionado");
            horarioSelecionado = botaoClicado.dataset.horario;
            
            btnConfirmar.style.display = "block";
        }
    });

    // --- Quando o agendamento é Confirmado ---
    btnConfirmar.addEventListener("click", () => {
        if (!horarioSelecionado) {
            alert("Por favor, selecione um horário.");
            return;
        }

        const agendamentoAtual = { 
            hospital: hospitalSelect.value, 
            data: dataInput.value, 
            horario: horarioSelecionado 
        };
        
        if (verificarAgendamentoDuplicado(agendamentoAtual)) {
            alert("❌ Erro! Você já possui um agendamento exatamente igual.");
            return;
        }

        const agendamentosAnteriores = JSON.parse(localStorage.getItem('agendamentosSalvos')) || [];
        agendamentosAnteriores.push(agendamentoAtual);
        localStorage.setItem('agendamentosSalvos', JSON.stringify(agendamentosAnteriores));

        const dataFormatada = new Date(agendamentoAtual.data + 'T00:00:00').toLocaleDateString('pt-BR');
        alert(
            `Agendamento Confirmado! ✅\n\n` +
            `Resumo:\n` +
            `- Hospital: ${agendamentoAtual.hospital}\n` +
            `- Data: ${dataFormatada}\n` +
            `- Horário: ${agendamentoAtual.horario}`
        );
        
        carregarAgendamentosSalvos();
        atualizarDisponibilidadeHorarios();
        
        btnConfirmar.style.display = 'none';
        horarioSelecionado = null;
        const botaoSelecionado = horariosContainer.querySelector('.btn-horario.selecionado');
        if (botaoSelecionado) {
            botaoSelecionado.classList.remove('selecionado');
        }
    });

    // --- Quando um agendamento é Excluído ---
    listaAgendamentosUI.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-excluir')) {
            const confirmar = confirm("Tem certeza que deseja excluir este agendamento?");
            if (confirmar) {
                const agendamentoId = parseInt(event.target.dataset.agendamentoId);
                let agendamentos = JSON.parse(localStorage.getItem('agendamentosSalvos')) || [];
                
                agendamentos.splice(agendamentoId, 1);
                
                localStorage.setItem('agendamentosSalvos', JSON.stringify(agendamentos));
                
                carregarAgendamentosSalvos();
                atualizarDisponibilidadeHorarios();
            }
        }
    });


    // ===================================================================
    //  6. INICIALIZAÇÃO DA APLICAÇÃO
    // ===================================================================

    // Define a data mínima do calendário para o dia de hoje
    dataInput.min = new Date().toISOString().split("T")[0];

    // Carrega os agendamentos que já existem no localStorage
    carregarAgendamentosSalvos();

    // Inicia um "relógio" que atualiza a disponibilidade dos horários a cada minuto
    setInterval(atualizarDisponibilidadeHorarios, 60000);

});