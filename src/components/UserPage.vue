<template>
<div id="app">
    <NavBar />
    <router-view />
    <div class="podcasts-wrapper">
      <div class="podcast-headers">
        <h3>Cover</h3>
        <h3>Title</h3>
        <h3>Score</h3>
        <h3>Review</h3>
        <h3>Actions</h3>
      </div>
      <div class="podcast-container" v-for="podcast in podcasts" :key="podcast.uuid">
    <img :src="podcast.imageUrl" alt="Podcast Image" class="podcast-img">
    <h2>{{ podcast.name }}</h2>
    <p v-if="podcast.userReview">
  {{ convertRatingToStars(podcast.userReview.rating) }}
</p>
      <p v-else>&nbsp;</p> 
      <p v-if="podcast.userReview">
       {{ podcast.userReview.description }}
        </p>
        <p v-else>&nbsp;</p>
        <div class="button-container">
          <router-link 
    v-if="!podcast.userReview"
    :to="{ name: 'UserReviews', params: { podcastUuid: podcast.uuid } }" 
    class="router-link-button"
>
    <button>Add Review</button>
</router-link>
        <button v-if="podcast.userReview" @click="deleteReview(podcast.uuid)">Delete Review</button>
        <button v-if="podcast.userReview" @click="editReview(podcast.uuid, podcast.userReview)">Edit Review</button>
    </div>
    <button class="remove-podcast-button" @click="deletePodcast(podcast.uuid)">X<span class="tooltip-text">Remove Podcast</span></button>
</div>
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      </div>
    </div>
</div>
<div v-if="showDeleteConfirmationModal" class="modal">
    <div class="modal-content">
      <p>Are you sure you want to delete this podcast?</p>
      <button @click="confirmDelete">Yes</button>
      <button @click="cancelDelete">No</button>
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
        podcasts: [],
        showDeleteConfirmationModal: false,
        podcastToDelete: null,
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

    deletePodcast(podcastUuid) {
    this.podcastToDelete = podcastUuid;
    this.showDeleteConfirmationModal = true;
    },

    // New methods for confirming and canceling deletion
    async confirmDelete() {
      // Note: Moved the deletion logic here from `deletePodcast` method
      try {
        const userSession = this.$cookies.get('user_session');
        let userEmail = '';
        if (userSession) {
            const payload = JSON.parse(atob(userSession.split('.')[1]));
            userEmail = payload.email;
        }

        await axios.delete('http://localhost:4000/user/deletePodcast', { 
          data: { userEmail, podcastUuid: this.podcastToDelete } 
        });

        this.podcasts = this.podcasts.filter(
          podcast => podcast.uuid !== this.podcastToDelete
        );
      } catch (error) {
        console.error('Error deleting podcast:', error);
        this.error = 'Failed to delete podcast.';
      } finally {
        // Regardless of the outcome, close the modal and reset `podcastToDelete`
        this.showDeleteConfirmationModal = false;
        this.podcastToDelete = null;
      }
    },
    cancelDelete() {
      this.showDeleteConfirmationModal = false;
      this.podcastToDelete = null;
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
},
convertRatingToStars(rating) {
    const fullStar = '\u2605';
    const emptyStar = '\u2606';
    const maxStars = 5;

    const fullStars = fullStar.repeat(rating);
    const emptyStars = emptyStar.repeat(maxStars - rating);

    return fullStars + emptyStars;
  },

},

  mounted() {
    this.fetchPodcasts();
  },
}

</script>

<style scoped>
.router-link-button {
  /* Remove the background color from here */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
}

/* Apply the background color to the button element */
.router-link-button button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
}

.router-link-button:hover {
  background-color: white;
  color: black;
  border: 1px solid #4CAF50;
}


.router-link-button:hover {
  background-color: white;
  color: black;
  border: 1px solid #4CAF50;
}

#app {
  margin-top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.podcasts-wrapper {
  width: 75%; 
}

.podcast-headers,
.podcast-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.podcast-container img,
.podcast-container h2,
.podcast-container p {
    margin: 0;
    padding: 0;
}

.podcast-headers h3,
.podcast-container img,
.podcast-container h2,
.podcast-container p {
    width: 20%; 
}

.podcast-headers h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
}
.remove-podcast-button {
  position: absolute;  
  right: -110px;
  background-color: #e44d25;
  border: none;
  color: white;
  padding: 5px 10px; 
  font-size: 12px;   
  cursor: pointer;
  transition-duration: 0.4s;
  display: inline-block;
}

.tooltip-text {
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 3px;
  position: absolute;
  z-index: 1;
  bottom: 125%; /* Place it above the button */
  left: 50%;
  margin-left: -60px; /* Shift it left by half its width */
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.remove-podcast-button:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.remove-podcast-button:hover {
    background-color: white;
    color: #e44d25;
    border: 1px solid #e44d25;
}

.podcast-container:nth-child(1) .remove-podcast-button {
    top: 20px;  /* Lower the button to avoid the headers */
}

.podcast-container + .podcast-container {
    margin-top: 50px;  
}
.podcast-headers h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.podcast-img {
  max-width: 150px;
  height: auto;
  object-fit: cover; 
}

.button-container {
  display: flex;
  gap: 10px;
}

.error-message {
  color: red;
  padding: 10px;
  margin-top: 20px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

podcast-container p {
  color: gold;
  font-size: 1.5em;
}
</style>



