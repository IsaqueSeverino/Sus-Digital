document.addEventListener('DOMContentLoaded', function () {

    const cpfInput = document.getElementById('cpf');
    const nomeInput = document.getElementById('nome');
    const senhaInput = document.getElementById('senha');
    const senhaConfirmeInput = document.getElementById('senhaConfirme');
    const registrarButton = document.getElementById('registrar-button');

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

    registrarButton.addEventListener('click', function (e) {

        if (cpfInput.value === '') {
            alert('❌ Preencha o campo de CPF.');
            return;
        }

        if (nomeInput.value === '') {
            alert('❌ Preencha o campo de nome.');
            return;
        }

        if (senhaInput.value === '') {
            alert('❌ Preencha o campo de senha.');
            return;
        }

        if (senhaConfirmeInput.value === '') {
            alert('❌ Preencha o campo de confirmação de senha.');
            return;
        }

        if (senhaInput.value !== senhaConfirmeInput.value) {
            alert('❌ As senhas não são iguais! Por favor, tente novamente.');
            return;
        }

        if (senhaInput.value.length < 8) {
            alert('❌ A senha precisa ter no mínimo 8 caracteres.');
            return;
        }

        const nome = nomeInput.value;
        const cpf = cpfInput.value;
        const senha = senhaInput.value;

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        const usuarioExistente = usuarios.find(usuario => usuario.cpf === cpf);
        if (usuarioExistente) {
            alert('❌ Este CPF já está cadastrado!');
            return;
        }

        const novoUsuario = {
            id: crypto.randomUUID(),
            nome: nome,
            cpf: cpf,
            senha: senha
        };

        usuarios.push(novoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        alert('✅ Cadastro realizado com sucesso!');
        console.log('Usuário salvo com ID:', novoUsuario);

        window.location.href = '../index.html';
    })

});