<template>
    <div id="app">
        <NavBar />
    <router-view />
  </div>
  <div v-if="error">
      <p>{{ error }}</p>
    </div>
    
    <div v-else>
      <div v-for="podcast in podcasts" :key="podcast.uuid">
        <h2>{{ podcast.name }}</h2>
        <img :src="podcast.imageUrl" alt="Podcast Image" class="podcast-img">
        <p>{{ podcast.description }}</p>
      </div>
    </div>

</template>

<script>
import NavBar from '@/components/NavBar.vue';
import axios from 'axios';

export default { // the name of your component
name: 'UserPage',
data: () => ({ 
        error: '',
        userEmail: '',
        podcasts: []
    }),

    components: {
        NavBar,
    },
    methods: {
    async fetchPodcasts() {
      try {
        const userSession = this.$cookies.get('user_session');


            if (userSession) {
                // Decode the payload of the JWT
                const base64Url = userSession.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(atob(base64));

                // Extract userEmail from the payload
                this.userEmail = payload.email;

            }
        const response = await axios.post('http://localhost:4000/user/podcasts', { userEmail: this.userEmail });
        this.podcasts = response.data.podcasts;
      } catch (error) {
        console.error('Error fetching podcasts:', error);
        this.error = 'Failed to fetch podcasts.';
      }
    },
  },
  mounted() {
    this.fetchPodcasts();
  },

}
</script>

<style scoped>
#app {
    margin-top: 0;
}
.podcast-img {
  width: 150px;
  height: 150px;
}
</style>

