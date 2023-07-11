const express = require('express')
const mysql = require('mysql');
const axios = require('axios');
const config = require('./config');
const cors = require("cors");
const app = express();
// const bodyParser = require('body-parser');
const port = 3000;

const URL = "https://plataforma.astenassinatura.com.br/api/";
const token = config.token;
var user;
const connection = mysql.createConnection(config.banco);
connection.connect(function(err) {
    if (err) throw err
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

// get all envelopes
app.get('/', (req, res) => {
    axios.post(URL + "getIdentificador", {"token": token, "params": {}}).then(resp => {
        user = resp.data.response.Usuario.id;
        console.log("User: " + user);
        axios.post(URL + "getRepositoriosDoUsuario", {
            "token": token,
            "params": {"idProprietario": user}
        }).then((aaaaaa) => {
            let tmp = [];
            aaaaaa.data.response.forEach(elem => tmp.push(elem.id));
            tmp.forEach((id) => {
                console.log("Repositorio: " + id);
                axios.post(URL + "getEnvelopesByRepositorioOuPasta", {
                    "token": token,
                    "params": {"idRepositorio": id}
                }).then((list) => {
                    let obj = list.data.response;
                    obj.forEach(envelope => {
                        connection.query('SELECT id FROM envelope WHERE id = ' + envelope.id, function (err, results) {
                            if (!results || results == "") {
                                connection.query('INSERT INTO envelope (`id`, `descricao`, `dataExpiracao`, `repositorio`, `hash`) VALUES (' + envelope.id + ', "' + envelope.descricao + '", "' + envelope.dataHoraCriacao + '", ' + id + ', "'+ envelope.hashSHA256 +'")', function (err, rows) {
                                    if (err) throw err;
                                    console.log('Linhas modificadas ', rows);
                                });
                            }
                        });
                    });
                    console.log(obj);
                    res.send(obj);
                })
            })
        })
    }).catch(err => {
        throw err
    });
})

// criacao de envelopes
app.post('/create-envelop', (req, res) => {
    console.log("aqui")
    // const obj = req.body;
    console.log(req.body)
    // const params = {
    //     "token": token,
    //     "params": {
    //         "Envelope": {
    //             "descricao": obj.description,
    //             "Repositorio": {
    //                 "id": obj.repository
    //             },
    //             "usarOrdem": "S",
    //             "listaDocumentos": {
    //                 "Documento": [
    //                     {
    //                         "nomeArquivo": obj.docName,
    //                         "mimeType": "application/pdf",
    //                         "conteudo": obj.docContent
    //                     }
    //                 ]
    //             },
    //             "incluirHashTodasPaginas": "S",
    //             "permitirDespachos": "S",
    //             "ignorarNotificacoes": "N",
    //             "ignorarNotificacoesPendentes": "N",
    //             "bloquearDesenhoPaginas": "S"
    //         },
    //         "gerarTags": "S",
    //         "encaminharImediatamente": "N",
    //         "detectarCampos": "N",
    //         "verificarDuplicidadeConteudo": "N"
    //     }
    // };
    // console.log(params)
// PAREI AQUI
//     axios.post(URL + "inserirEnvelope", params).then(response => res.send(response.response.mensagem)).catch(err => res.send(err));
})

// configuracao de signatarios
app.post('/set-people', (req, res) => {
    const obj = req.body;
    const params = {
        "token": token,
        "params": {
            "SignatarioEnvelope": {
                "Envelope": {"id": obj.id},
                "ordem": 1,
                "ConfigAssinatura": {"emailSignatario": obj.email, "nomeSignatario": obj.nome}
            }
        }
    };

    axios.post(URL + "inserirSignatarioEnvelope", params).then(response => {
        connection.query("UPDATE envelope SET listaSignatariosEnvelope = JSON_SET(listaSignatariosEnvelope, '$.signatario', obj.email) WHERE id = obj.id")
        res.send(response.response.mensagem)
    }).catch(err => res.send(err));
})

// encaminhamento para assinatura
app.post('/forward', (req, res) => {
    const obj = req.body;
    const params = {"token": token, "params": {"Envelope": {"id": obj.id}}};
    axios.post(URL + "encaminharEnvelopeParaAssinaturas", params).then(response => {
        res.send(response.response.mensagem)
    }).catch(err => res.send(err));
})

// consulta de status
app.post('/get-status', (req, res) => {
    const arr = ["?", "Em construção", " Aguardando Assinaturas", "Concluído", "Arquivado", "Cancelado", "Expirado"];
    const obj = req.body;
    const params = {"token": token, "params": {"idEnvelope": obj.id, "getLobs": "N"}};
    axios.post(URL + "getDadosEnvelope", params).then(response => {
        const status = response.response.status;
        res.send(arr[status]);
    }).catch(err => res.send(err));
})

// download do envelope
app.post('/download', (req, res) => {
    const obj = req.body;
    const params = {"token": token, "params": {"hashSHA256": obj.hash}};
    axios.post(URL + "getDadosEnvelope", params).then(response => {
        res.send(response.response);
    }).catch(err => res.send(err));
})

app.get('/repositorys', (req, res) => {
    axios.post(URL + "getIdentificador", {"token": token, "params": {}}).then(resp => {
        user = resp.data.response.Usuario.id;
        console.log("User: " + user);
        axios.post(URL + "getRepositoriosDoUsuario", {
            "token": token,
            "params": {"idProprietario": user}
        }).then((aaaaaa) => {
            res.send(aaaaaa.data.response)
        })
    }).catch(err => res.send(err));
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
