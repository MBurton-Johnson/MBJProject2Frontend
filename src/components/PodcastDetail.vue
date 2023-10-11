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
  <button @click="addToLibrary">Add to Library</button>
  </template>
  
  <script> 
  import axios from 'axios';
  import NavBar from '@/components/NavBar.vue';
  
  export default {
    props: ['uuid'],
    data() {
      return {
        podcast: null,
        error: null,
        userEmail: ''
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
      },
      async addToLibrary() {
        try {

            const userSession = this.$cookies.get('user_session');
            
            // Log the userSession to the console
            console.log('User Session:', userSession);

            if (userSession) {
                // Decode the payload of the JWT
                const base64Url = userSession.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(atob(base64));

                // Log the payload to the console
                console.log('Decoded Payload:', payload);

                // Extract userEmail from the payloadaddadd
                this.userEmail = payload.email;


            }
            const response = await axios.post('http://localhost:4000/podcast/add', this.podcast);            
            console.log('Response:', response);
              alert('Podcast added to library!');

          const podcastUuid = this.podcast.uuid;
          await axios.post('http://localhost:4000/user/addPodcast', { userEmail: this.userEmail, podcastUuid });
        } catch (error) {
            console.error('Error adding podcast to library:', error);
            alert('Failed to add podcast to library.');
        }
      }
    },

      mounted() {
        console.log("UUID:", this.uuid);
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

  //       addToLibrary() {
//     // Retrieve user credentials securely
//     const userSession = this.$cookies.get('user_session');
    
//     // Log the userSession to the console
//     console.log('User Session:', userSession);

//     if (userSession) {
//         // Decode the payload of the JWT
//         const base64Url = userSession.split('.')[1];
//         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         const payload = JSON.parse(atob(base64));

//         // Log the payload to the console
//         console.log('Decoded Payload:', payload);

//         // Extract userEmail from the payloadaddadd
//         const userEmail = payload.email;

//         // Additional check to ensure userEmail is defined
//         if (!userEmail) {
//             console.error('Email is not defined in the token payload!');
//             return;
//         }

//         // Send a request to add the podcast to the user's library
//         fetch('http://localhost:4000/user/addPodcast', {
//             method: 'POST',
//             headers: { "Content-Type": 'application/json' },
//             body: JSON.stringify({ userEmail, podcastUuid: this.uuid })
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Podcast added:', data);
//             this.$router.push('/user');
//         })
//         .catch(error => console.error('Error:', error));
//     } else {
//         alert('You need to be logged in to add podcasts to your library.');
//         this.$router.push('/login');
//     }
// }


// },
//     async mounted() {
//   // if (!this.userId) {
//   //   console.error('UserId is null!');
//   //   return;
//   // }
//   try {
//     const response = await axios.get(`http://localhost:4000/user/${this.userId}/podcasts`);
//     console.log('Podcasts response:', response.data);
//   } catch (error) {
//     console.error('Error fetching podcasts:', error);
//   }
//   console.log('Podcast ID:', this.uuid); // Log the podcast ID
//   this.fetchPodcast();
// }

  // }