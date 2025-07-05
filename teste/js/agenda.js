document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("agendamentos");
  const lista = JSON.parse(localStorage.getItem("agendamentos") || "[]");

  if (lista.length === 0) {
    container.innerHTML = "<p>Nenhuma consulta agendada.</p>";
    return;
  }

  lista.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${item.hospital}</strong><br>
      ${item.cidade}/${item.estado} - ${item.data} às ${item.hora}</p>
      <button onclick="remover(${item.id})">Excluir</button>
      <hr>
    `;
    container.appendChild(div);
  });
});

function remover(id) {
  const lista = JSON.parse(localStorage.getItem("agendamentos") || "[]");
  const novaLista = lista.filter(item => item.id !== id);
  localStorage.setItem("agendamentos", JSON.stringify(novaLista));
  location.reload();
}
