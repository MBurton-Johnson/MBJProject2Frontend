<template>
      <div id="app">
        <NavBar />
    <router-view />
  </div>
  <div>
    <input v-model="searchTerm" @keyup.enter="searchPodcasts" placeholder="Search for podcasts...">
    <button @click="searchPodcasts">Search</button>

    <div v-for="podcast in podcasts" :key="podcast.uuid" @click="goToPodcastDetail(podcast)">
      <h2 class="header2">{{ podcast.name }}</h2>
      <img :src="podcast.imageUrl" alt="Podcast Image" class="profile-img">
      <!-- <p class="details">Click for details</p> -->
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import NavBar from '@/components/NavBar.vue';
import router from '@/router'; // Assuming you're using Vue Router

export default {
  data() {
    return {
      searchTerm: '',
      podcasts: []
    };
  },
  components: {
        NavBar,
    },
  methods: {
    async searchPodcasts() {
      const query = `
      {
        searchForTerm(term:"${this.searchTerm}", filterForTypes:PODCASTSERIES){
          searchId 
          podcastSeries{
            uuid
            name
            rssUrl
            imageUrl
          }
        }
      }
      `;

      const headers = {
        'X-USER-ID': '663',
        'X-API-KEY': 'a18840c2fceaa80cd538fc79cf8339952879ee1461e0e344185071f7ba7af8ad31a57db419206fdab5a65538eed9393a5a',
        'Content-Type': 'application/json',
      };

      try {
        const response = await axios({
          url: 'https://api.taddy.org',
          method: 'post',
          headers: headers,
          data: {
            query: query,
          },
        });
        
        this.podcasts = response.data.data.searchForTerm.podcastSeries || [];
      } catch (error) {
        console.error('An error occurred while fetching data: ', error);
        console.error(error.response.data.errors); // GraphQL errors
      }
    },

    goToPodcastDetail(podcast) {
      router.push({ name: 'PodcastDetail', params: { uuid: podcast.uuid } });
    }
  },
};
</script>

  
<style scoped>

.header2:hover {
    text-decoration: underline;
    cursor: pointer;
}

.profile-img {
    width: 100px;
    height: 100px;
    cursor: pointer;
  }

  .details:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  </style>