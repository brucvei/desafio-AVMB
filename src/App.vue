<template>
  <Navbar/>
    <div class="container">
        <h2>Envelopes</h2>
        <TableCenter data=""/>
    </div>
</template>

<script>
import Navbar from "@/components/NavBar.vue";
import TableCenter from "@/components/TableCenter.vue";

export default {
  name: 'App',
  components: {
      TableCenter,
      Navbar
      // HelloWorld
  },
  data(){}
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
.container{
    width: 100%;
    height: 100%;
    margin: auto;
}
</style>
