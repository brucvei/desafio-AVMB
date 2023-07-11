const express = require('express')
const app = express()
const port = 3000
var axios = require('axios')
const URL = "https://plataforma.astenassinatura.com.br/api/"
var params = {
    "token": "56ht9p-Li8k5zHaQ2Dzxzijr...",
    "params": {}
}
var mysql      = require('mysql')
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : ''
});


// get all envelopes
app.get('/', (req, res) => {
    res.send('Hello World!')
    // salva todos dados dos envelopes
    axios.get(URL + "/")
    connection.connect();

    connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
        if (err) throw err;
        console.log('The solution is: ', rows[0].solution);
    });

    connection.end();
})

// criacao de envelopes
app.get('/create-envelop/{id}', (req, res) => {
    connection.connect();

    connection.query("SELECT * FROM ")
    connection.end();

})
// configuracao de signatarios
app.get('/set-peploe/{id}',(req, res) => {
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
