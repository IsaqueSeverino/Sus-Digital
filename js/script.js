document.addEventListener('DOMContentLoaded', function () {
    const usuarioLogadoId = sessionStorage.getItem('usuarioLogadoId');
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarios')).find(usuario => usuario.id === usuarioLogadoId);

    const nomeUsuario = usuarioLogado ? usuarioLogado.nome : 'Visitante';

    const nomeUsuarioElement = document.getElementById('perfil-span');
    nomeUsuarioElement.textContent = nomeUsuario;

});