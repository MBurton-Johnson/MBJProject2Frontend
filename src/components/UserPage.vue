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
    <h2>{{ podcast.name }} <button @click="deletePodcast(podcast.uuid)">Remove</button></h2>
    <img :src="podcast.imageUrl" alt="Podcast Image" class="podcast-img">
    <router-link :to="{ name: 'UserReviews', params: { podcastUuid: podcast.uuid } }">
        Add Review
    </router-link>
        <p v-if="podcast.userReview">
      Your Review: {{ podcast.userReview.rating }} - {{ podcast.userReview.description }}
      <button @click="deleteReview(podcast.uuid)">Delete Review</button>
      <button @click="editReview(podcast.uuid, podcast.userReview)">Edit Review</button>
    </p>
    <p v-else>You haven't reviewed this podcast yet.</p>
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
                const base64Url = userSession.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(atob(base64));
                this.userEmail = payload.email;
              }

              // Fetch podcasts
              const response = await axios.post('http://localhost:4000/user/podcasts', { userEmail: this.userEmail });
              this.podcasts = response.data.podcasts;

              // Fetch and assign reviews with Promise.all
              try {
                await Promise.all(
                  this.podcasts.map(async (podcast) => {
                    try {
                      const reviewResponse = await axios.post('http://localhost:4000/review/user', { 
                          userEmail: this.userEmail, 
                          podcastUuid: podcast.uuid 
                      });
                      // Check if reviewResponse.data contains expected data
                      if(reviewResponse.data && 'rating' in reviewResponse.data && 'description' in reviewResponse.data){
                        podcast.userReview = reviewResponse.data;
                      } else {
                        console.warn(`No review data for podcast UUID: ${podcast.uuid}`);
                        podcast.userReview = null; // or {} depending on your preference
                      }
                    } catch (reviewError) {
                      // Check if error response status is 404, handle it gracefully
                      if(reviewError.response && reviewError.response.status === 404) {
                        console.warn('Review not found for podcast UUID:', podcast.uuid);
                        podcast.userReview = null;
                      } else {
                        // Log other errors as they are unexpected
                        console.error('Error fetching review for podcast UUID:', podcast.uuid, reviewError);
                        podcast.userReview = { rating: 'Error', description: 'Failed to fetch review.' };
                      }
                    }
                  })
                );
                console.log("Fetched Podcasts:", this.podcasts);
              } catch (error) {
                console.error('Error with Promise.all:', error);
              }


                  // Trigger a re-render by assigning, instead of modifying the objects in-place
                  this.podcasts = [...this.podcasts];
                } catch (error) {
                  console.error('Error fetching podcasts:', error);
                  this.error = 'Failed to fetch podcasts.';
                }
              },

    async deletePodcast(podcastUuid) {
      try {
        const userSession = this.$cookies.get('user_session');
        let userEmail = '';
        if (userSession) {
            const payload = JSON.parse(atob(userSession.split('.')[1]));
            userEmail = payload.email;
        }

        // Sending delete request to API
        await axios.delete('http://localhost:4000/user/deletePodcast', { data: { userEmail, podcastUuid } });
        
        // Removing the podcast from local data
        this.podcasts = this.podcasts.filter(podcast => podcast.uuid !== podcastUuid);
      } catch (error) {
        console.error('Error deleting podcast:', error);
        this.error = 'Failed to delete podcast.';
      }
    },
    async deleteReview(podcastUuid) {
    try {
      const userSession = this.$cookies.get('user_session');
      let userEmail = '';
      if (userSession) {
        const payload = JSON.parse(atob(userSession.split('.')[1]));
        userEmail = payload.email;
      }

      // Sending delete request to API
      await axios.delete('http://localhost:4000/review/delete', { data: { userEmail, podcastUuid } });
      
      // Updating the local data
      const podcast = this.podcasts.find(p => p.uuid === podcastUuid);
      if (podcast) podcast.userReview = null;

    } catch (error) {
      console.error('Error deleting review:', error);
      this.error = 'Failed to delete review.';
    }
  },
  editReview(podcastUuid, userReview) {
  if (!podcastUuid || !userReview) {
    console.error('Podcast UUID or user review is undefined');
    return;
  }
  this.$router.push({ name: 'EditReview', params: { podcastUuid, userReview } });
}},
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

