<template>
    <h1>Login page</h1>
    <div v-if="isLoggedIn">
        <h2>Hello {{ userName }}</h2>
        <button class="btn btn-primary" @click="handleLogOut">Log Out</button>
    </div>
    <div v-else>
        <GoogleLogin :callback="callback" />
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