<template>
  <nav>
    <div class="brand">GoodListens</div>
    <div class="nav-links">
      <router-link to="/homepage" class="nav-link">Home</router-link>
      <router-link to="/about" class="nav-link">About</router-link>
      <router-link to="/user" class="nav-link">My Podcasts</router-link>
      <router-link to="/podcast-search" class="nav-link">Search</router-link>
    </div>
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
                this.$router.push('/login');  
            }
        }
    }
    </script>
    
    
    <style scoped>
nav {
  background-color: green;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.5rem;
  color: white;
}

.nav-links {
  display: flex;
  align-items: center;
}

.nav-link {
  color: white;
  margin-right: 2rem; 
  text-decoration: none;
  transition: font-weight 0.3s ease;
}

.nav-link:hover,
.nav-link--exact-active {
  font-weight: bold;
}

button {
    background-color: #4CAF50;  /* Green background */
    color: white;  /* White text */
    padding: 10px 20px;  /* Spacious padding */
    text-align: center;  /* Center-aligned text */
    text-decoration: none;  /* No underlines */
    display: inline-block;  /* Inline-block level element */
    font-size: 16px;  /* Readable font size */
    margin: 4px 2px;  /* Slight margin */
    transition-duration: 0.4s;  /* Transition effects */
    cursor: pointer;  /* Cursor pointer */
    border-radius: 12px;  /* Rounded corners */
    border: 2px solid transparent; 
}

button:hover {
    background-color: white;
    color: black;
    border-color: #4CAF50;   /* Green border on hover */
}

</style>
    
    
    
    