<template>
    <Navbar/>
    <div class="container">
        <div class="flex">
            <h2>Envelopes</h2>
            <button type="button" class="blue-button" v-on:click="modal">+ Novo</button>
        </div>
        <TableCenter/>
    </div>
    <div v-if="showModal == 1">
        <ModalNew/>
    </div>
</template>

<script>
import Navbar from "@/components/NavBar.vue";
import TableCenter from "@/components/TableCenter.vue";
import ModalNew from "@/components/ModalNew.vue";

export default {
    name: 'App',
    components: {
        ModalNew,
        TableCenter,
        Navbar,
    },
    data() {
        return {showModal: -1}
    },
    methods: {
        modal: function () {
            this.showModal *= -1;
        }
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    /*margin-top: 60px;*/
}

.container {
    /*width: 100%;*/
    /*height: 100%;*/
    margin: 0;
    padding: 0 70px;
}

.flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.blue-button {
    background: #0d6efd;
    color: white;
    border-radius: 0.375rem;
    padding: 10px;
    border: 0;
}

.blue-button:hover {
    cursor: pointer;
    background: #01398a;
}
</style>
