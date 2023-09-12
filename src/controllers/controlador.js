let { contas, depositos, saques, transferencias } = require('../bancodedados');
const { format } = require('date-fns')
const { encontrarConta } = require('../functions/functions');

const listarContas = (req, res) => {
    return res.status(200).json(contas);
}

const criarConta = (req, res) => {
    let { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    let id = 1;

    if (contas.length > 0) {
        id = contas[contas.length - 1].numero + 1;
    }

    const conta = {
        numero: id,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    contas.push(conta);

    return res.status(201).json();
}

const atualizarConta = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha  } = req.body;

    const conta = encontrarConta(numeroConta);

    conta.usuario.nome = nome;
    conta.usuario.cpf = cpf;
    conta.usuario.data_nascimento = data_nascimento;
    conta.usuario.telefone = telefone;
    conta.usuario.email = email;
    conta.usuario.senha = senha;

    return res.status(204).json();
}

const deletarConta = (req, res) => {
    const { numeroConta } = req.params;

    const conta = encontrarConta(numeroConta);

    if (!conta) {
        return res.status(404).json({ mensagem: "Não existe conta com o número informado para deletar!" })
    }

    if(conta.saldo > 0) {
        return res.status(403).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" })
    }

    const contaIndice = contas.findIndex((conta) => {
        return Number(conta.numero) === Number(numeroConta)
    });

    contas.splice(contaIndice, 1);

    return res.status(204).json();
}

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    const conta = encontrarConta(numero_conta);

    conta.saldo += valor

    const dadosDeposito = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta,
        valor
    }

    depositos.push(dadosDeposito);

    return res.status(201).json();
}


const sacar = (req, res) => {
    const { numero_conta, valor} = req.body;

    const conta = encontrarConta(numero_conta);

    if (conta.saldo <= 0 || valor > conta.saldo) {
        return res.status(403).json({ mensagem: "Não há saldo disponível para o saque." })
    }

    conta.saldo -= valor;

    const dadosSaque = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta,
        valor
    };

    saques.push(dadosSaque);

    return res.status(204).json();
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor } = req.body;

    const contaOrigem = encontrarConta(numero_conta_origem);

    if (contaOrigem.saldo <= 0 || valor > contaOrigem.saldo) {
        return res.status(403).json({ mensagem: "Saldo Insuficiente!" });
    };

    contaOrigem.saldo -= valor;

    const contaDestino = encontrarConta(numero_conta_destino);

    contaDestino.saldo += valor;

    const dadosTransfer = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta_origem,
        numero_conta_destino,
        valor,
    }

    transferencias.push(dadosTransfer);

    return res.status(201).json();
}

const saldo = (req, res) => {
    const { numero_conta } = req.query;

    const conta = encontrarConta(numero_conta);

    const saldoTotal = conta.saldo;

    return res.status(200).json({ saldo: saldoTotal });
}

const extrato = (req, res) => {
    const { numero_conta } = req.query;

    const depositoExtrato = depositos.filter((deposito) => {
        return deposito.numero_conta == numero_conta
    });

    const saquesExtrato = saques.filter((saque) => {
        return saque.numero_conta == numero_conta
    });

    const transferenciasEnviadas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_origem == numero_conta
    });

    const transferenciasRecebidas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_destino == numero_conta
    });


    return res.status(200).json({
        depositos: depositoExtrato,
        saques: saquesExtrato,
        transferenciasEnviadas,
        transferenciasRecebidas
    });
}

module.exports = {
    listarContas,
    criarConta,
    atualizarConta,
    deletarConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
};