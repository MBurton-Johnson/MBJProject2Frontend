<template>
<div id="app">
        <NavBar />
    <router-view />
  </div>
  <div>
    <h1>Podcast Info</h1>
    
    <div v-if="error">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="podcast">
      <h2>{{ podcast.name }}</h2>
      <img :src="podcast.imageUrl" alt="Podcast Image" class="profile-img">
      <p>{{ podcast.description }}</p>
    </div>

  </div>
  </template>
  
  <script>
  import axios from 'axios';
  import NavBar from '@/components/NavBar.vue';
  
  export default {
    props: ['uuid'],
    data() {
      return {
        podcast: null,
        error: null
      };
    },
    components: {
        NavBar,
    },
    methods: {
      async fetchPodcast() {
        try {
          const response = await axios({
            method: 'post',
            url: 'https://api.taddy.org',
            headers: {
              'Content-Type': 'application/json',
              'X-USER-ID': '663',
              'X-API-KEY': 'a18840c2fceaa80cd538fc79cf8339952879ee1461e0e344185071f7ba7af8ad31a57db419206fdab5a65538eed9393a5a'
            },
            data: {
              query: `
                {
                  getPodcastSeries(uuid:"${this.uuid}") {
                    uuid
                    name
                    description
                    imageUrl
                    itunesInfo {
                      uuid
                      baseArtworkUrlOf(size:640)
                    }
                  }
                }
              `
            }
          });
          console.log('API Response:', response); // Log the API response
          this.podcast = response.data.data.getPodcastSeries;
        } catch (error) {
          this.error = 'An error occurred!';
          console.error(error);
        }
      }
    },
    mounted() {
        console.log('Podcast ID:', this.uuid); // Log the podcast ID
      this.fetchPodcast();
    }
  }
  </script>

<style scoped>
.profile-img {
    width: 100px;
    height: 100px;
  }
  </style>