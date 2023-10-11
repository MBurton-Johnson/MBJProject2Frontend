<!-- src/components/NavBar.vue -->
<template>
    <nav>
      <router-link to="/homepage">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/user">My Podcasts</router-link>
      <router-link to="/podcast-search">Search</router-link>
      <button v-if="isLoggedIn" @click="handleLogOut">Log Out</button>
    </nav>
  </template>
  
  <script>
  import { decodeCredential, googleLogout } from 'vue3-google-login'
  
  export default {
      name: 'NavBar',
      data: () => ({
          isLoggedIn: false,
          userName: ''
      }),
      mounted() {
          if (this.$cookies.isKey('user_session')) {
              this.isLoggedIn = true
              const userData = decodeCredential(this.$cookies.get('user_session'))
              this.userName = userData.given_name
          } 
      },
      methods: {
          handleLogOut: function () {
              googleLogout()
              this.$cookies.remove('user_session')
              this.isLoggedIn = false
              // Maybe redirect to the homepage or login page after logout?
              this.$router.push('/homepage');  
          }
      }
  }
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
  