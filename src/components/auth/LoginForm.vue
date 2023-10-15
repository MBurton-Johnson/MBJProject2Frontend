
<template>
    <div class="login-page">
      <div class="brand">Good<span class="accent-text">Listens</span></div>
      <div class="login-container">
        <h2 class="login-heading">Sign In</h2>
        <div class="login-box">
            <GoogleLogin :callback="callback" />
        </div>
      </div>
    </div>
  </template>
  

<script>
import { decodeCredential, googleLogout } from 'vue3-google-login'
import { useRouter } from 'vue-router';

export default {
    name: "LoginForm",
    data: () => ({
        isInit: false,
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
    setup() {
        const router = useRouter(); // Use router instance

        const navigateToHome = () => {
            router.push('/homepage'); // Navigate to the homepage
        };

        return {
            navigateToHome, // Expose the method to template
        };
    },
    methods: {
        callback: function (response) {
            this.isLoggedIn = true
            const userData = decodeCredential(response.credential)
            console.log(userData);
            this.userName = userData.given_name
            this.$cookies.set('user_session', response.credential);

            fetch('http://localhost:4000/user/login', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    email: userData.email
                })
            })
            .then((response) => {
                console.log('Raw response:', response);
                if (!response.ok) { // if HTTP-status is 404, 500 or such
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Session saved', data);
                this.navigateToHome();
            })
            .catch((error) => {
                console.error('Fetching failed: ', error.message);
            });
        },
        handleLogOut: function () {
            googleLogout()
            this.$cookies.remove('user_session')
            this.isLoggedIn = false
        }
    }
}
</script>

<style scoped>
.login-page {
    background-color: #4CAF50;  /* Green background */
    height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 5%;  /* Adjusted space from top */
}

.brand {
    font-family: 'Montserrat', sans-serif;
    font-size: 3rem;
    color: white;
    position: absolute;
    top: 1rem;
    left: 1rem;
}

.accent-text {
    font-weight: bold;
    color: #004d00;  /* dark dark green */
}

.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.login-heading {
    color: black;
    font-size: 1.5rem;
    margin-bottom: 1rem; /* Space between heading and box */
}

.login-box {
    background-color: white;
    padding: 3rem;  /* Bigger padding for larger box */
    border-radius: 10px; /* Rounded corners */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

/* Add styling for your login content if needed */
</style>
