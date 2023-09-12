const { Router } = require('express');
const { validarSenha, 
        validacaoDeDados,
        validacaoAtualizacao,
        validacaoDeposito, 
        validacaoSaques, 
        validacaoTransfer, 
        validacaoSaldoeExtrato } = require('./middlewares/middleware');

const controlador = require('./controllers/controlador')

const rotas = Router();

rotas.get('/contas', validarSenha, controlador.listarContas);
rotas.post('/contas', validacaoDeDados, controlador.criarConta);
rotas.put('/contas/:numeroConta/usuario', validacaoAtualizacao, controlador.atualizarConta);
rotas.delete('/contas/:numeroConta', controlador.deletarConta);
rotas.post('/transacoes/depositar', validacaoDeposito, controlador.depositar);
rotas.post('/transacoes/sacar', validacaoSaques, controlador.sacar);
rotas.post('/transacoes/transferir', validacaoTransfer, controlador.transferir);
rotas.get('/contas/saldo', validacaoSaldoeExtrato, controlador.saldo);
rotas.get('/contas/extrato', validacaoSaldoeExtrato, controlador.extrato);

module.exports = rotas;