document.addEventListener('DOMContentLoaded', function () {

    const cpfInput = document.getElementById('cpf');

    cpfInput.addEventListener('input', function (e) {

        let value = e.target.value;

        value = value.replace(/\D/g, '');

        value = value.substring(0, 11);

        if (value.length > 3 && value.length <= 6) {

            value = value.replace(/(\d{3})(\d)/, '$1.$2');
        } else if (value.length > 6 && value.length <= 9) {

            value = value.replace(/(\d{3})(\d{3})(\d)/, '$1.$2.$3');
        } else if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d)/, '$1.$2.$3-$4');
        }

        e.target.value = value;
    });

    const loginSenhaInput = document.getElementById('senha');
    const entrarButton = document.getElementById('login-button');

    entrarButton.addEventListener('click', function () {
        const cpfDigitado = cpfInput.value;
        const senhaDigitada = loginSenhaInput.value;

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        const usuarioEncontrado = usuarios.find(usuario =>
            usuario.cpf === cpfDigitado && usuario.senha === senhaDigitada
        );
        if (usuarioEncontrado) {
            alert(`✅ Bem-vindo(a), ${usuarioEncontrado.nome}!`);

            sessionStorage.setItem('usuarioLogadoId', usuarioEncontrado.id);

            window.location.href = 'html/index.html';
        } else {
            alert('❌ CPF ou senha incorretos.');
        }
    });

    const toggleContrasteBtn = document.getElementById('toggle-contraste');

    if (toggleContrasteBtn) {
        toggleContrasteBtn.addEventListener('click', function(event) {
            event.preventDefault();
            
            document.documentElement.classList.toggle('alto-contraste');

            if (document.documentElement.classList.contains('alto-contraste')) {
                localStorage.setItem('modoContraste', 'ativo');
            } else {
                localStorage.setItem('modoContraste', 'inativo');
            }
        });
    }
});