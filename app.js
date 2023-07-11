const express = require('express')
const app = express()
const port = 3000

var axios = require('axios')
const URL = "https://plataforma.astenassinatura.com.br/api/"
const token = "56ht9p-Li8k5zHaQ2Dzxzijr..."

var mysql      = require('mysql')
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : ''
});


// get all envelopes
app.get('/', (req, res) => {
    // salva todos dados dos envelopes
    connection.connect();
    axios.post(URL + "/getRepositoriosDoUsuario", {"token": token, "params": { "idProprietario": 1}}).then((response) => {
        var tmp = response.forEach(elem => elem.id);
        tmp.forEach((id) => {
            axios.post(URL + "/getEnvelopesByRepositorioOuPasta", {"token": token, "params": { "idRepositorio": id}}).then((list) => {
                list.forEach(envelope => {
                    connection.query('INSERT INTO `envelope` (`id`, `descricao`, `dataExpiracao`, `listaSignatariosEnvelope`) VALUES (envelope.id, envelope.descricao, envelope.dataHoraCriacao, envelope.usuario.id)', function(err, rows, fields) {
                        if (err) throw err;
                        console.log('Linhas modificadas ', rows);
                    });
                })
                res.send(list)
            })
        })
    })
    connection.end();
})

// criacao de envelopes
app.post('/create-envelop', (req, res) => {
    var obj = req.body;
    var params = {"token": token,"params":{"Envelope":{"descricao":obj.descricao,"Repositorio":{"id":obj.repositorio.id},"mensagem": obj.mensagem,"mensagemObservadores": obj.mensagemObservadores,"mensagemNotificacaoSMS": obj.mensagemNotificacaoSMS,"dataExpiracao": obj.dataExpiracao,"horaExpiracao": obj.horaExpiracao,"usarOrdem": obj.usarOrdem,"ConfigAuxiliar":{"documentosComXMLs": obj.ConfigAuxiliar.documentosComXMLs,"urlCarimboTempo": obj.ConfigAuxiliar.urlCarimboTempo},"listaDocumentos":{"Documento":[{"nomeArquivo":obj.listaDocumentos.Documento.nome,"mimeType":"application/pdf","conteudo":obj.listaDocumentos.Documento.conteudo}]}}}}
    axios.post(URL+"/inserirEnvelope", params).then(response => res.send(response.mensagem));
})

// configuracao de signatarios
app.get('/set-peploe/:id',(req, res) => {
    connection.connect();

    connection.query("SELECT * FROM ")
    connection.end();

})
// encaminhamento para assinatura
app.get('/foward/{id}',(req, res) => {
    connection.connect();

    connection.query("SELECT * FROM ")
    connection.end();
})
// consulta de status
app.get('/get-status/{id}',(req, res) => {
    connection.connect();

    connection.query("SELECT * FROM ")
    connection.end();

})
// download do envelope
app.get('/download/{id}',(req, res) => {
    connection.connect();

    connection.query("SELECT * FROM ")
    connection.end();

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
