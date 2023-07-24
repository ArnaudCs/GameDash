import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import HelloWorld from './components/HelloWorld.vue'
import Login from './components/LoginComp.vue'
import Register from './components/RegisterComp.vue'
import AddItem from './components/AddItemComp.vue'
import addGame from './components/AddGameComp.vue'
import addAccessories from './components/AddAccessoriesComp.vue'
import MyAccessoriesCollection from './components/MyAccessoriesCollectionComp.vue'
import MyGameCollection from './components/MyGameCollectionComp.vue'
import MyCollection from './components/MyCollectionComp.vue'
import { createRouter, createWebHistory } from 'vue-router';

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCJ1BwXUBe4_itvJviVZwuqOzhDz3J43mE",
  authDomain: "gamedash-27ea0.firebaseapp.com",
  projectId: "gamedash-27ea0",
  storageBucket: "gamedash-27ea0.appspot.com",
  messagingSenderId: "318785995771",
  appId: "1:318785995771:web:b66d8b3e2d2c46e497415e",
  measurementId: "G-46LGEEZCZG"
};

initializeApp(firebaseConfig);

loadFonts()

import { getAuth, onAuthStateChanged } from "firebase/auth";

const routes = [
  { path: '/', component: HelloWorld, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/profile', component: Register, meta: { requiresAuth: true }},
  { path: '/additem', component: AddItem, meta: { requiresAuth: true }},
  { path: '/dashboard', component: MyCollection, meta: { requiresAuth: true }},
  { path: '/addgame', component: addGame, meta: { requiresAuth: true }},
  { path: '/dashboard-games', component: MyGameCollection, meta: { requiresAuth: true }},
  { path: '/dashboard-accessories', component: MyAccessoriesCollection, meta: { requiresAuth: true }},
  { path: '/addaccessories', component: addAccessories, meta: { requiresAuth: true }},
];

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(getAuth(), (user) => {
      removeListener()
      resolve(user)
    },
    reject,
    );
  });
};
  
const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      // Utilisateur connecté
      next()
    } else {
      // Utilisateur non connecté
      next({ path: '/login' })
    }
  } else {
    // Vérification spécifique pour les routes /register et /login
    if ((to.path === '/register' || to.path === '/login') && await getCurrentUser()) {
      // Utilisateur connecté essayant d'accéder à /register ou /login
      next({ path: '/' }) // Redirection vers une autre page, par exemple la page d'accueil
    } else {
      next() // Autoriser l'accès à la route normalement
    }
  }
})

createApp(App)
  .use(vuetify)
  .use(router)
  .mount('#app')