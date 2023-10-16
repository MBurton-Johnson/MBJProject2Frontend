<template>
    <div id="app">
        <NavBar />
    <router-view />

  <div class="about-container">
  <h1>ABOUT US</h1>
  <p>Welcome to <span>GoodListens</span>, your ultimate destination for <span class="podcast">podcast</span> enthusiasts. Founded in 2023, we are passionate about the art of <span class="podcast">podcasting</span> and dedicated to helping you discover, enjoy, and engage with your favorite <span class="podcast">podcasts</span>.

In this rapidly growing audio landscape, finding the perfect <span class="podcast">podcast</span> can sometimes feel like searching for a needle in a haystack. That's where we come in. Our mission is simple: to curate and connect <span class="podcast">podcast</span> lovers with the content that resonates with them the most.

Our platform is designed with you in mind. Whether you're a seasoned <span class="podcast">podcast</span> connoisseur or just embarking on your audio journey, we offer a user-friendly space where you can explore a diverse range of <span class="podcast">podcasts</span> across genres. Discover hidden gems, revisit old favorites, and stay updated on the latest releases.

But we're more than just a directory. We believe in the power of community, which is why we encourage you to share your thoughts, opinions, and reviews. Your voice matters, and your insights can help others find their next obsession.

Join us on this exciting <span class="podcast">podcasting</span> adventure. <span>GoodListens</span> is your trusted companion in the world of <span class="podcast">podcasts</span>, and we can't wait to embark on this sonic journey together. Happy listening!</p>
</div>
</div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';


export default { // the name of your component
name: 'AboutPage',
data: () => ({ 
        error: '',
    }),
    components: {
        NavBar,
    }

}
</script>

<style scoped>
#app {
    margin-top: 0;
}

.about-container {
    width: 65%;
    margin: auto;
    text-align: center;
    background-color: #f8f8f8;  /* Suggested: light gray background for the box */
    padding: 20px;  /* Spacing inside the box */
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);  /* Optional: a light box shadow */
}

h1 {
    margin-bottom: 20px;  
    text-decoration: underline;
}

span {
    color: #4CAF50;
    font-weight: bolder;
}

p {
    text-align: justify;
    font-size: large;
}

.podcast {
    color: orangered;
    font-weight: bolder;
}
</style>


