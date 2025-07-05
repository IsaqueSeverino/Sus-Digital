const inputData = document.getElementById("data");
const horariosDiv = document.getElementById("horarios");
const containerHorarios = document.getElementById("horariosContainer");

inputData.addEventListener("change", () => {
  const dataSelecionada = inputData.value;

  if (dataSelecionada) {
    mostrarHorarios(dataSelecionada);
    containerHorarios.classList.remove("hidden");
  } else {
    containerHorarios.classList.add("hidden");
  }
});

function mostrarHorarios(data) {
  horariosDiv.innerHTML = "";
  const horarios = [
    "08:00", "09:00", "10:00", "11:00",
    "13:00", "14:00", "15:00", "16:00"
  ];

  horarios.forEach(horario => {
    const btn = document.createElement("div");
    btn.className = "horario";
    btn.textContent = horario;
    btn.onclick = () => {
      alert(`Consulta agendada para ${formatarData(data)} às ${horario}`);
    };
    horariosDiv.appendChild(btn);
  });
}

function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}
