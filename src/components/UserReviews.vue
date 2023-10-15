<template>
    <div>
      <h1>Review: {{ podcast.name }}</h1>
      <form @submit.prevent="submitReview">
        <label for="rating">Rating:</label>
        <select v-model="rating" id="rating" required>
          <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
        </select>
        
        <label for="description">Review:</label>
        <textarea v-model="description" id="description" required></textarea>
        
        <button type="submit">Submit Review</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data: () => ({
      podcast: {},
      rating: 1,
      description: ''
    }),
    async mounted() {
      const { podcastUuid } = this.$route.params;
      
      // Fetch podcast data
      // This is a hypothetical endpoint, modify as per your actual implementation
      const podcastResponse = await axios.get(`http://localhost:4000/podcasts/${podcastUuid}`);
      this.podcast = podcastResponse.data;
    },
    methods: {
      async submitReview() {
        try {
          // Assuming user email is stored in a cookie, replace as necessary
          const userSession = this.$cookies.get('user_session');

            if (userSession) {
                // Decode the payload of the JWT
                const base64Url = userSession.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(atob(base64));

                // Extract userEmail from the payload
                this.userEmail = payload.email;
            }
          
          await axios.post('http://localhost:4000/review/add', {
            rating: this.rating,
            description: this.description,
            podcastUuid: this.podcast.uuid,
            userEmail: this.userEmail
          });
          
          // Redirect to the user page after submitting the review
          this.$router.push({ name: 'UserPage' });
        } catch (error) {
          console.error('Error submitting review:', error.response || error);
          // Handle error, maybe with a user-friendly error message
        }
      }
    }
  };
  </script>
  