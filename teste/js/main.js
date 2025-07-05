document.addEventListener("DOMContentLoaded", () => {
  const estados = ["SP", "RJ", "MG"];
  const cidadesPorEstado = {
    "SP": ["São Paulo", "Campinas"],
    "RJ": ["Rio de Janeiro", "Niterói"],
    "MG": ["Belo Horizonte", "Uberlândia"]
  };
  const hospitaisPorCidade = {
    "São Paulo": ["Hospital das Clínicas", "Santa Casa"],
    "Campinas": ["Hospital de Campinas"],
    "Rio de Janeiro": ["Copa D'Or", "Hospital Central"],
    "Niterói": ["Hospital Icaraí"],
    "Belo Horizonte": ["Hospital das Gerais"],
    "Uberlândia": ["Hospital Municipal"]
  };

  const estadoSel = document.getElementById("estado");
  const cidadeSel = document.getElementById("cidade");
  const hospitalSel = document.getElementById("hospital");
  const form = document.getElementById("formAgendamento");
  const mensagem = document.getElementById("mensagem");

  estados.forEach(uf => {
    const opt = document.createElement("option");
    opt.value = uf;
    opt.textContent = uf;
    estadoSel.appendChild(opt);
  });

  estadoSel.addEventListener("change", () => {
    cidadeSel.innerHTML = "<option value=''>Selecione</option>";
    hospitalSel.innerHTML = "<option value=''>Selecione</option>";
    hospitalSel.disabled = true;

    const cidades = cidadesPorEstado[estadoSel.value] || [];
    cidades.forEach(cidade => {
      const opt = document.createElement("option");
      opt.value = cidade;
      opt.textContent = cidade;
      cidadeSel.appendChild(opt);
    });
    cidadeSel.disabled = false;
  });

  cidadeSel.addEventListener("change", () => {
    hospitalSel.innerHTML = "<option value=''>Selecione</option>";
    const hospitais = hospitaisPorCidade[cidadeSel.value] || [];
    hospitais.forEach(h => {
      const opt = document.createElement("option");
      opt.value = h;
      opt.textContent = h;
      hospitalSel.appendChild(opt);
    });
    hospitalSel.disabled = false;
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const estado = estadoSel.value;
    const cidade = cidadeSel.value;
    const hospital = hospitalSel.value;
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;

    if (!estado || !cidade || !hospital || !data || !hora) {
      mensagem.textContent = "Preencha todos os campos.";
      mensagem.style.color = "red";
      return;
    }

    const agendamento = {
      id: Date.now(),
      estado, cidade, hospital, data, hora
    };

    const lista = JSON.parse(localStorage.getItem("agendamentos") || "[]");
    lista.push(agendamento);
    localStorage.setItem("agendamentos", JSON.stringify(lista));

    mensagem.textContent = "Consulta agendada com sucesso!";
    mensagem.style.color = "green";
    form.reset();
    cidadeSel.disabled = true;
    hospitalSel.disabled = true;
  });
});
