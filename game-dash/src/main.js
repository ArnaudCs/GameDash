import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import HelloWorld from './components/HelloWorld.vue'
import Login from './components/LoginComp.vue'
import Register from './components/RegisterComp.vue'
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
      next()
    } else {
      next({ path: '/login' })
    }
  } else {
    next()
  }
})

createApp(App)
  .use(vuetify)
  .use(router)
  .mount('#app')