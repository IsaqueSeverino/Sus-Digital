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