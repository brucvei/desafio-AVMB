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
            <td class="button">grupo de botoes que vou por dps</td>
        </tr>
    </table>
</template>
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
td.buttons:hover{
    cursor: pointer;
}
</style>
<script>
import axios from "axios";
import moment from 'moment';

export default {
    name: "TableCenter",
    data() {
        return {data: []}
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            axios.get("http://localhost:3000").then(resp => {
                console.log(resp.data)
                this.data = resp.data
            }).catch(err => {
                console.log(err)
                throw err
            });
        },
        format(date) {
            return moment(String(date)).format('DD/MM/YYYY HH:mm')
        }
    }
}
</script>