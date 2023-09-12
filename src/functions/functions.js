const { contas } = require('../bancodedados');

const encontrarConta = (numeroConta) => {
    return contas.find((conta) => {
        return Number(conta.numero) === Number(numeroConta);
    });
}

module.exports = {
    encontrarConta,
};