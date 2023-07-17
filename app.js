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
connection.connect(function (err) {
    if (err) throw err
});

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

// get all envelopes
app.get('/', (req, res) => {
    console.log("/")
    axios.post(URL + "getIdentificador", {"token": token, "params": {}}).then(resp => {
        user = resp.data.response.Usuario.id;
        // console.log("User: " + user);
        axios.post(URL + "getRepositoriosDoUsuario", {
            "token": token,
            "params": {"idProprietario": user}
        }).then((aaaaaa) => {
            let tmp = [];
            aaaaaa.data.response.forEach(elem => tmp.push(elem.id));
            tmp.forEach((id) => {
                // console.log("Repositorio: " + id);
                axios.post(URL + "getEnvelopesByRepositorioOuPasta", {
                    "token": token,
                    "params": {"idRepositorio": id, "maxRegistros": "1000"}
                }).then((list) => {
                    let obj = list.data.response;
                    obj.forEach(envelope => {
                        connection.query('SELECT id FROM envelope WHERE id = ' + envelope.id, function (err, results) {
                            if (!results || results == "") {
                                connection.query('INSERT INTO envelope (`id`, `descricao`, `dataExpiracao`, `repositorio`, `hash`) VALUES (' + envelope.id + ', "' + envelope.descricao + '", "' + envelope.dataHoraCriacao + '", ' + id + ', "' + envelope.hashSHA256 + '")', function (err, rows) {
                                    if (err) throw err;
                                    console.log('Linhas modificadas ', rows);
                                });
                            }
                        });
                    });
                    // console.log(obj);
                    res.send(obj);
                })
            })
        })
    }).catch(err => {
        throw err
    });
})

// criacao de envelopes
app.post('/create-envelope', (req, res) => {
    console.log("/create-envelop")
    const obj = req.body;

    const params = {
        "token": token,
        "params": {
            "Envelope": {
                "descricao": obj.description,
                "Repositorio": {
                    "id": obj.repository
                },
                "usarOrdem": "S",
                "listaDocumentos": {
                    "Documento": [
                        {
                            "nomeArquivo": obj.docName,
                            "mimeType": obj.docType,
                            "conteudo": obj.file
                        }
                    ]
                },
                "incluirHashTodasPaginas": "S",
                "permitirDespachos": "S",
                "ignorarNotificacoes": "N",
                "ignorarNotificacoesPendentes": "N",
                "bloquearDesenhoPaginas": "S"
            },
            "gerarTags": "S",
            "encaminharImediatamente": "N",
            "detectarCampos": "N",
            "verificarDuplicidadeConteudo": "N"
        }
    };

    axios.post(URL + "inserirEnvelope", params)
        .then(response => res.send(response.response.message))
        .catch(err => {
            console.log("erro - ", err.response.data.error)
            res.send(err.response.data.error.data)
        });
})

// configuracao de signatarios
app.post('/set-people', (req, res) => {
    console.log("/set-people")
    const obj = req.body;
    const params = {
        "token": token,
        "params": {
            "SignatarioEnvelope": {
                "Envelope": {"id": obj.id},
                "ConfigAssinatura": {"emailSignatario": obj.email}
            }
        }
    };

    axios.post(URL + "inserirSignatarioEnvelope", params).then(response => {
        res.send(response.response.data)
    }).catch(err => res.send(err));
})

// encaminhamento para assinatura
app.post('/forward', (req, res) => {
    console.log("/forward")
    const obj = req.body;
    const params = {"token": token, "params": {"Envelope": {"id": obj.id}}};
    axios.post(URL + "encaminharEnvelopeParaAssinaturas", params).then(response => {
        // console.log(response.response)
        res.send(response.response)
    }).catch(err => {
        console.log(err.response.data)
        res.send(err.response.data.error)
    });
})

// consulta de status
app.post('/get-status', (req, res) => {
    console.log("/get-status")
    const arr = ["?", "Em construção", " Aguardando Assinaturas", "Concluído", "Arquivado", "Cancelado", "Expirado"];
    const obj = req.body;
    const params = {"token": token, "params": {"idEnvelope": obj.id, "getLobs": "N"}};
    axios.post(URL + "getDadosEnvelope", params).then(response => {
        const status = response.data.response.status;
        res.send(arr[status]);
    }).catch(err => res.send(err));
})

// download do envelope
app.post('/download', (req, res) => {
    console.log("/download")
    const obj = req.body;
    const params = {"token": token, "params": {"hashSHA256": obj.code}};
    axios.post(URL + "downloadPDFEnvelope", params).then(response => {
        // console.log(response.data.response)
        res.send(response.data.response);
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
