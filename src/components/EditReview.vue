<template>
    <div class="edit-review">
        <h2>Edit Your Review for {{ podcastName }}</h2>
        <form @submit.prevent="updateReview">
            <label for="rating">Rating:</label>
            <select v-model="review.rating" id="rating" required>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>

            <label for="description">Review:</label>
            <textarea v-model="review.description" id="description" required></textarea>

            <button type="submit">Update Review</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            podcastName: '',
            review: {
                rating: '',
                description: ''
            }
        }
    },
    async mounted() {
        // Fetch the podcast name
        try {
            const podcastResponse = await axios.get(`http://localhost:4000/podcasts/${this.$route.params.podcastUuid}`);
            this.podcastName = podcastResponse.data.name;
        } catch (error) {
            console.error('Error fetching podcast data:', error);
            // Handle error accordingly...
        }

        // Fetch the review
        const userSession = this.$cookies.get('user_session');
        let userEmail = '';
        if (userSession) {
            const payload = JSON.parse(atob(userSession.split('.')[1]));
            userEmail = payload.email;
        }

        try {
            const reviewResponse = await axios.post('http://localhost:4000/review/user', {
                userEmail: userEmail,
                podcastUuid: this.$route.params.podcastUuid
            });
            this.review = reviewResponse.data;
        } catch (error) {
            console.error('Error fetching review data:', error);
            // Handle error accordingly...
        }
    },
    methods: {
        async updateReview() {
            // Update the review
            const userSession = this.$cookies.get('user_session');
            let userEmail = '';
            if (userSession) {
                const payload = JSON.parse(atob(userSession.split('.')[1]));
                userEmail = payload.email;
            }

            try {
                await axios.put('http://localhost:4000/review/update', {
                    userEmail: userEmail,
                    podcastUuid: this.$route.params.podcastUuid,
                    rating: this.review.rating,
                    description: this.review.description
                });

                // Navigate back to the podcast listing or show a success message
                this.$router.push({name: 'UserPage'}); // Assuming your user page route is named 'UserPage'
            } catch (error) {
                console.error('Error updating review:', error);
                // Handle error accordingly...
            }
        }
    }
}
</script>

<style scoped>

</style>
