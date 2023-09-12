const { banco, contas } = require('../bancodedados');
const { encontrarConta } = require('../functions/functions')

const validarSenha = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(400).json({ mensagem: "A senha do banco não foi informada." });
    }

    if (senha_banco !== banco.senha) {
        return res.status(403).json({ mensagem: "A senha do banco informada é inválida!" });
    }

    next();
}

const validacaoDeDados = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
    }

    const verificarCpf = contas.find((conta) => {
        return conta.usuario.cpf == cpf
    });

    if (verificarCpf !== undefined) {
        return res.status(403).json({ mensagem: "Já existe uma conta com o CPF ou e-mail informado!" });
    }

    const verificarEmail = contas.find((conta) => {
        return conta.usuario.email == email
    });

    if (verificarEmail !== undefined) {
        return res.status(403).json({ mensagem: "Já existe uma conta com o CPF ou e-mail informado!" });
    }

    next();
}

const validacaoAtualizacao = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numeroConta } = req.params;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
    }

    const conta = encontrarConta(numeroConta);

    if (!conta) {
        return res.status(404).json({ mensagem: "O número da conta informado é inválido!" })
    }

    const contaCpf = contas.find((conta) => {
        return conta.usuario.cpf == cpf
    });

    if (contaCpf && numeroConta != contaCpf.numero) {
        return res.status(403).json({ mensagem: "O CPF informado já existe cadastrado!" })
    }

    const contaEmail = contas.find((conta) => {
        return conta.usuario.email == email
    });

    if (contaEmail && numeroConta != contaEmail.numero) {
        return res.status(403).json({ mensagem: "O e-mail informado já existe cadastrado!" })
    }

    next();
}

const validacaoDeposito = (req, res, next) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || valor === undefined) {
        return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" });
    }

    const conta = encontrarConta(numero_conta);

    if (!conta) {
        return res.status(404).json({ mensagem: "O número da conta informado não existe!" });
    }

    if(valor <= 0) {
        return res.status(400).json({ mensagem: "O valor do depósito precisa ser maior que zero (0). " });
    }

    next();
}

const validacaoSaques = (req, res, next) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || valor === undefined || !senha) {
        return res.status(400).json({ mensagem: "O número da conta, o valor e a senha são obrigatórios!" });
    }

    const conta = encontrarConta(numero_conta);

    if (!conta) {
        return res.status(404).json({ mensagem: "O número da conta informado não existe!" });
    }

    if (senha !== conta.usuario.senha) {
        return res.status(403).json({ mensagem: "A senha da conta está incorreta!" });
    }

    if(valor <= 0) {
        return res.status(400).json({ mensagem: "O valor não pode ser menor que zero!" });
    }

    next();
}

const validacaoTransfer = (req, res, next) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || valor === undefined || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
    }

    const contaOrigem = encontrarConta(numero_conta_origem);

    if (!contaOrigem) {
        return res.status(404).json({ mensagem: "A conta de origem não existe!" });
    }

    if (numero_conta_origem == numero_conta_destino) {
        return res.status(400).json({ mensagem: "A conta de origem não pode ser igual a conta de destino." })
    }

    const contaDestino = encontrarConta(numero_conta_destino);

    if (!contaDestino) {
        return res.status(404).json({ mensagem: "A conta de destino não existe!" });
    }

    if (senha !== contaOrigem.usuario.senha) {
        return res.status(403).json({ mensagem: "A senha da conta de origem está incorreta!" });
    }

    next();
}

const validacaoSaldoeExtrato = (req, res, next) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "O número da conta e a senha são obrigatórios!" });
    }

    const conta = encontrarConta(numero_conta);

    if (!conta) {
        return res.status(404).json({ mensagem: "Conta bancária não encontada!" });
    }

    if (senha !== conta.usuario.senha) {
        return res.status(403).json({ mensagem: "A senha da conta está incorreta!" });
    }

    next();
}

module.exports = {
    validarSenha,
    validacaoDeDados,
    validacaoAtualizacao,
    validacaoDeposito,
    validacaoSaques,
    validacaoTransfer,
    validacaoSaldoeExtrato
};