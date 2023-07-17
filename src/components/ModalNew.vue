<template>
  <!-- template for the modal component -->
    <div id="modal-template">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">

                    <div class=" flex">
                        <h2>Novo envelope</h2>
                        <span><a href="/">X</a></span>
                    </div>

                    <div class="modal-body">
                        <form id="form">
                            <div class="espacado">
                                <label for="description">Descricao</label><br>
                                <input type="text" id="description" class="input" required>
                            </div>
                            <br>
                            <div class="espacado">
                                <label for="repository">Repositorio</label><br>
                                <select id="repository" class="input" required>
                                    <option v-for="option in data" :key="option.id" :value="option.id">
                                        {{ option.nome }}
                                    </option>
                                </select>
                            </div>
                            <div class="espacado">
                                <label for="file">Arquivo</label><br>
                                <input type="file" id="file" name="file" class="input" accept="application/pdf" required
                                       ref="file" v-on:change="selectFile">
                            </div>
                            <br>
                            <button class="blue-button" type="button" v-on:click="enviar">Enviar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";

export default {
    name: "ModalNew",
    data() {
        return {data: {}, file: {}}
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            axios.get("https://app.swaggerhub.com/apis-docs/BRUNACAETANO/desafio/1.0.0/repositorys").then(resp => {
                console.log(resp.data)
                this.data = resp.data
            }).catch(err => {
                console.log(err)
                throw err
            });
        },

        enviar() {
            let desc = document.getElementById("description").value
            let rep = document.getElementById("repository").value
            let arq = document.getElementById("file")

            if (!desc || !rep || !arq) {
                alert("preencha todos os campos!");
                return;
            }

            const doc = this.file.result.split('base64,')[1]

            const params = {
                "description": desc,
                "repository": rep,
                "docName": arq.files[0].name,
                "docType": arq.files[0].type,
                "file": doc
            };
            console.log()
            axios.post("https://app.swaggerhub.com/apis-docs/BRUNACAETANO/desafio/1.0.0/create-envelope", params)
                .then((msg) => {
                    console.log(msg)
                    alert(msg.statusText);
                    window.location = "/";
                }).catch(err => {
                console.log(err)
                throw err
            });
        },

        selectFile() {
            let file = this.$refs.file.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            this.file = reader;
        }

    }
}
</script>
<style scoped>
.input {
    border: 1px solid #1a1a1a;
    border-radius: 4px;
    padding: .3em .8em;
    margin-top: 10px;
}

.espacado {
    margin-bottom: 15px;
}

.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    width: 300px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
    margin-top: 0;
    color: #42b983;
}

.modal-body {
    margin: 20px 0;
}

.modal-default-button {
    display: block;
    margin-top: 1rem;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>
<script setup lang="ts">
</script>