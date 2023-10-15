<template>
    <div id="app">
        <NavBar />
        <div class="content">
            <div class="image-container">
                <img src="@/assets/zoom-podcast.jpg" alt="Descriptive alt text">
            </div>
            <div class="right-side">
                <div class="text-container">
                    <p class="slogan">"Where Conversations Echo"</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
    name: 'HomePage',
    components: {
        NavBar,
    }
}
</script>

<style scoped>
#app {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.content {
    flex-grow: 1;
    display: flex;
}

.image-container {
    flex: 1;
    position: relative;
}

.image-container img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
}

.right-side {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center; /* Centering content horizontally */
    background-color: #f8f8f8;
}

.text-container {
    text-align: center; /* Centering text within the container */
}

.slogan {
    font-family: 'Playfair Display', serif;
    font-size: 6rem;
    font-weight: 600;
    color: #333;
}

</style>
