import { createWebHistory, createRouter } from 'vue-router'
import HomePage from '../components/HomePage'
import AboutPage from '../components/AboutPage'
import UserPage from '../components/UserPage'
import PodcastDetail from '../components/PodcastDetail'
import PodcastSearch from '../components/PodcastSearch'
import LoginForm from '../components/auth/LoginForm'
import UserReviews from '../components/UserReviews'
import EditReview from '../components/EditReview'

const routes = [
    {
        name: 'LoginForm',
        path: '/',
        component: LoginForm
    },
    {
        name: 'HomePage', 
        path: '/homepage',
        component: HomePage
    },
    {
        name: 'AboutPage', 
        path: '/about',
        component: AboutPage
    },    
    {
        name: 'UserPage', 
        path: '/user',
        component: UserPage
    },
    {
        name: 'PodcastSearch', 
        path: '/podcast-search',
        component: PodcastSearch,
    },
    {
        name: 'PodcastDetail', 
        path: '/podcast/:uuid',
        component: PodcastDetail,
        props: true
    },
    {
        name: 'UserReviews',
        path: '/user-reviews',
        component: UserReviews
    },
    {
        name: 'EditReview',
        path: '/edit-review',
        component: EditReview
    },

]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router