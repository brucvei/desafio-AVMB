<template>
    <table>
        <tr>
            <th>Codigo</th>
            <th>Descricao</th>
            <th>Criado em</th>
            <th>Atribuido a</th>
            <th>Acoes</th>
        </tr>
        <tr v-for="(envelope, i) in data" :key="i">
            <td class="c">{{ envelope.id }}</td>
            <td>{{ envelope.descricao }}</td>
            <td>{{ format(envelope.dataHoraCriacao) }}</td>
            <td>{{ envelope.Usuario.nome }}</td>
            <td class="button">
                <button type="button" class="blue-button buttons" v-on:click="modal(envelope.id)"
                        title="Adicionar signatarios">Signatarios
                </button>
                <button type="button" class="blue-button buttons" v-on:click="enviar(envelope.id)"
                        title="Encaminhar para assinatura">Encaminhar
                </button>
                <button type="button" class="blue-button buttons" v-on:click="status(envelope.id)"
                        title="Verificar status">Status
                </button>
                <button type="button" class="blue-button buttons" v-on:click="download(envelope.hashSHA256)"
                        title="Download do arquivo">Download
                </button>
            </td>
        </tr>
    </table>
    <div v-if="showModalSig == 1">
        <ModalSignatario :id="id"/>
    </div>
</template>

<script>
import axios from "axios";
import moment from 'moment';
import ModalSignatario from "@/components/ModalSignatario.vue";

export default {
    name: "TableCenter",
    components: {
        ModalSignatario
    },
    data() {
        return {data: [], showModalSig: -1, id: ""}
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            axios.get("https://virtserver.swaggerhub.com/BRUNACAETANO/desafio/1.0.0").then(resp => {
                console.log(resp.data)
                this.data = resp.data
            }).catch(err => {
                console.log(err)
                throw err
            });
        },
        format(date) {
            return moment(String(date)).format('DD/MM/YYYY HH:mm')
        },
        modal(id) {
            this.showModalSig *= -1;
            this.id = id;
        },
        enviar(id) {
            console.log(id)
            axios.post("https://virtserver.swaggerhub.com/BRUNACAETANO/desafio/1.0.0/forward", {"id": id}).then(msg => {
                console.log(msg)
                if (msg.data != "Envelope encaminhado para coleta de assinaturas!" || msg.data != "") {
                    alert(msg.data);
                    // window.location = "/";
                } else {
                    alert("Envelope encaminhado para coleta de assinaturas!");
                }
            });
        },
        status(id) {
            console.log(id)
            axios.post("https://virtserver.swaggerhub.com/BRUNACAETANO/desafio/1.0.0/get-status", {"id": id}).then(msg => {
                alert(msg.data);
            });
        },
        download(hash) {
            axios.post("https://virtserver.swaggerhub.com/BRUNACAETANO/desafio/1.0.0/download", {"code": hash}).then(msg => {
                const linkSource = `data:${msg.data.mimeType};base64,${msg.data.envelopeContent}`;
                const downloadLink = document.createElement("a");
                downloadLink.href = linkSource;
                downloadLink.download = msg.data.nomeArquivo;
                downloadLink.click();
            }).catch(console.error);
        },
    }
}
</script>
<style scoped>

table {
    border-spacing: 1;
    border-collapse: collapse;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    width: 100%;
    margin: auto;
    position: relative
}

table * {
    position: relative
}

table td, table th {
    padding-left: 8px
}

tr th {
    height: 60px;
    background: #36304a;
    color: white;
}

tr td {
    height: 50px
}

table td, table th {
    text-align: left
}

table td.c, table th.c {
    text-align: center
}

tr:nth-child(even) {
    background-color: #f5f5f5
}

tr {
    font-size: 15px;
    color: gray;
    line-height: 1.2;
    font-weight: unset
}

tr:hover {
    color: #555;
    background-color: #f5f5f5;
}

td.buttons:hover {
    cursor: pointer;
}

.buttons {
    margin: 2px;
}
</style>