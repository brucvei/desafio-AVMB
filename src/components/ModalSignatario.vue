<template>
  <!-- template for the modal component -->
    <div id="modal-template">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">

                    <div class=" flex">
                        <h2>Novo signatario do envelope {{ this.id }}</h2>
                        <span><a href="/">X</a></span>
                    </div>

                    <div class="modal-body">
                        <form id="form">
                            <div class="espacado">
                                <label for="email">Email</label><br>
                                <input type="email" id="email" class="input" required>
                            </div>
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
    name: "ModalSignatario",
    // eslint-disable-next-line vue/require-prop-type-constructor
    props: {id: ""},
    methods: {
        enviar() {
            let email = document.getElementById("email").value

            if (!email ) {
                alert("preencha todos os campos!");
                return;
            }

            const params = {
                "id": this.id,
                "email": email
            };
            console.log(params)
            axios.post("https://virtserver.swaggerhub.com/BRUNACAETANO/desafio/1.0.0/set-people", params)
                .then((msg) => {
                    console.log(msg)
                    if (msg.error) {
                        alert(msg.error);
                    } else {
                        alert("Signatario adicionado com sucesso!");
                        window.location = "/";
                    }
                }).catch(err => {
                console.log(err)
                throw err
            });
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