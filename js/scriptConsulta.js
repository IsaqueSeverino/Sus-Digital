document.addEventListener("DOMContentLoaded", () => {
  const estadoSelect = document.getElementById("estado");
  const cidadeSelect = document.getElementById("cidade");
  const hospitalSelect = document.getElementById("hospital");
  const dataInput = document.getElementById("data"); // Pega o elemento de data

  // --- NOVO: Define a data mínima para hoje ---
  const hoje = new Date().toISOString().split("T")[0];
  dataInput.min = hoje;
  // --- FIM DA NOVA ADIÇÃO ---


  // Objeto com os dados das cidades prioritárias (inalterado)
  const dadosLocais = {
    "1502105": { // Código IBGE de Canaã dos Carajás
      nome: "Canaã dos Carajás",
      hospitais: [
        "HOSPITAL MUNICIPAL DANIEL GONCALVES",
        "HOSPITAL 5 DE OUTUBRO"
      ]
    },
    "1504200": { // Código IBGE de Marabá
      nome: "Marabá",
      hospitais: [
        "HOSPITAL REGIONAL DO SUDESTE DO PARA DR GERALDO VELOSO",
        "HOSPITAL MATERNO INFANTIL DE MARABA",
        "HOSPITAL MUNICIPAL DE MARABA"
      ]
    },
    "1505530": { // Código IBGE de Parauapebas
      nome: "Parauapebas",
      hospitais: [
        "HOSPITAL GERAL DE PARAUAPEBAS",
        "HOSPITAL SANTA TEREZINHA",
        "YUTAKA Takeda"
      ]
    }
  };

  // Lista padrão para as outras cidades (inalterado)
  const hospitaisPadrao = [
    { value: "HOSPITAL_REGIONAL", text: "Verificar no Hospital Regional mais próximo" },
    { value: "POSTO_SAUDE", text: "Consultar Posto de Saúde local para encaminhamento" },
    { value: "OUTRO", text: "Outro - especificar na consulta" }
  ];

  // Carrega os Estados (inalterado)
  const urlEstados = "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome";
  fetch(urlEstados)
    .then((res) => res.json())
    .then((estados) => {
      estados.forEach((estado) => {
        const option = document.createElement("option");
        option.value = estado.id;
        option.textContent = estado.nome;
        estadoSelect.appendChild(option);
      });
    });

  // Escutador para o select de Estado (inalterado)
  estadoSelect.addEventListener("change", () => {
    const estadoSelecionadoId = estadoSelect.value;
    resetCidadeEHospital();

    if (estadoSelecionadoId) {
        cidadeSelect.disabled = false;
        if (estadoSelecionadoId === "15") {
            for (const codigoCidade in dadosLocais) {
                const cidade = dadosLocais[codigoCidade];
                const option = document.createElement("option");
                option.value = codigoCidade;
                option.textContent = cidade.nome;
                cidadeSelect.appendChild(option);
            }
        } else {
            const urlCidades = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionadoId}/municipios?orderBy=nome`;
            fetch(urlCidades)
                .then(res => res.json())
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

  // Escutador para o select de Cidade (inalterado)
  cidadeSelect.addEventListener("change", () => {
    const codigoCidade = cidadeSelect.value;
    resetHospital();

    if (!codigoCidade) return;
    
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
  });

  // Funções de ajuda (inalteradas)
  function resetCidadeEHospital() {
    cidadeSelect.innerHTML = '<option value="">Selecione a Cidade</option>';
    cidadeSelect.disabled = true;
    resetHospital();
  }

  function resetHospital() {
    hospitalSelect.innerHTML = '<option value="">Selecione o Hospital</option>';
    hospitalSelect.disabled = true;
  }
});