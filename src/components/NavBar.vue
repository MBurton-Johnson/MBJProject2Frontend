<!-- src/components/NavBar.vue -->
<template>
    <nav>
      <router-link to="/homepage">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/user">My Podcasts</router-link>
      <router-link to="/podcast-search">Search</router-link>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'NavBar',
  };
  </script>
  
  <style scoped>

  nav {
    background-color: green;
    padding: 1rem;
  }
  
  router-link {
    color: white;
    margin-right: 1rem;
    text-decoration: none;
  }
  
  router-link.exact-active {
    font-weight: bold;
  }
  </style>
  