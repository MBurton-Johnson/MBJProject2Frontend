<template>
    <div id="app">
        <NavBar />
    <router-view />
  </div>
  <h1>HOMEPAGE</h1>

</template>

<script>
import NavBar from '@/components/NavBar.vue';


export default { // the name of your component
name: 'HomePage',
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

