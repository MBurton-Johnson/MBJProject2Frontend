<template>
    <div id="app">
        <NavBar />
    <router-view />
  </div>

  <h1>ABOUT</h1>

</template>

<script>
import NavBar from '@/components/NavBar.vue';


export default { // the name of your component
name: 'AboutPage',
data: () => ({ 
        error: '',
    }),
    components: {
        NavBar,
    }

}
</script>

<style scoped>
#app {
    margin-top: 0;
}
</style>

