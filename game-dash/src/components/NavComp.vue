<template>
    <v-navigation-drawer color="#03539D" v-model="drawer" temporary class="drawer" style="width: 100%; opacity: 0.95; padding-top: 15vh;">
      <v-list class="drawer" nav v-for="(menu, index) in menus" :key="index">
        <v-list-item @click="drawer = null" :href=menu.link>
          <v-list-item-title class="mobileLinks" @click="drawer = null">{{menu.title}}</v-list-item-title>
        </v-list-item>
      </v-list>
      <div class="closeBtn d-flex align-center justify-center">
        <v-btn variant="text" :ripple="false" @click="drawer = false"><v-icon size="x-large" icon="mdi-tools" style="color: white;"></v-icon></v-btn>
      </div>
    </v-navigation-drawer>
    <v-app-bar
      app
      elevation="0"
      color="#03539D"
      elevate-on-scroll
      class="appBar">
    
      <v-toolbar-title v-if="windowWidth > 350" class="logoNav">
        <v-avatar class="logoAvatar mr-2"><router-link to="/" class="router-link">
          <v-img src="../assets/logo.png"></v-img></router-link></v-avatar>
          <router-link to="/" class="router-link" style="text-decoration: none; color: white;">FayatSoft</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="windowWidth > 945">
        <v-list class="d-flex align-center my-list" style="background-color: secondary;">
          <v-list-item link v-for="(menu, index) in menus" :key="index" :href=menu.link>
            <v-list-item-title class="menus">{{menu.title}}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <router-link to="/profile"><v-avatar><v-img src="../assets/profileWorker.png"></v-img></v-avatar><v-tooltip
              activator="parent"
              location="bottom"
            >Profil</v-tooltip>
          </router-link>
          </v-list-item>
        </v-list>
      </template>
      <v-menu v-if="windowWidth <= 960" right>
        <template v-slot:activator="{ on }">
          <v-btn color="white" v-bind="on" @click.stop="drawer = !drawer">
            <v-icon color="white">mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item link v-for="(menu, index) in menus" :key="index" :href=menu.link>
            <v-list-item-title>{{menu.title}}</v-list-item-title>
          </v-list-item> 
        </v-list>
      </v-menu>
      <div id="container" v-if="windowWidth <= 945" style="display: flex; justify-content: flex-end;">
        <v-list-item>
          <router-link to="/profile"><v-avatar><v-img src="../assets/profileWorker.png">
          </v-img></v-avatar></router-link>
        </v-list-item>
      </div>
    </v-app-bar>
  </template>
    
  <script>
    import { useTheme } from 'vuetify'
    export default {
      setup () {
        const theme = useTheme()
  
        return {
          theme,
          toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
        }
      },
      data() {
        return { 
          drawer: null,
          windowWidth: 0,
          isConnected: false,
          ex11: 'enable',
          menus: [
            {
              title: 'Mes Chantiers', // Ajoutez le bouton "Dashboard"
              link: '/dashboard',
              icon: 'mdi-view-dashboard',
            },
          ]
        }
      },
      mounted() {
        window.addEventListener('resize', this.getWindowWidth)
        this.getWindowWidth()
      },
      beforeUnmount() {
        window.removeEventListener('resize', this.getWindowWidth)
      },
      methods: {
        getWindowWidth() {
          this.windowWidth = window.innerWidth
        },
      }
    }
  </script>
  
  <style scoped>
  .mobileLinks{
    font-size: 1.5rem;
    line-height: 50px;
    color: white;
  }

  .menus{
    color: white;
  }
  
  .appBar{
    display: block;
    position: relative;
  }
  
  .closeBtn{
    margin-top: 6vh;
    scale: 1.7;
  }

  .logoNav {
    display: flex;
    align-items: center;
    font-size: 2vw;
    color: white;
    font-weight: 600;
  }
  
  .my-list {
    background-color: var(--v-card-background); /* utilise la variable de thème pour la couleur de fond */
    color: var(--v-text-primary-on-background); /* utilise la variable de thème pour la couleur du texte */
  }
  
  .colorLogo{
    text-decoration: none;
    color: var(--v-text-primary-on-background); /* utilise la variable de thème pour la couleur du texte */
  }
  
  @media only screen and (max-device-width : 450px) {
    .logo{
      font-size: 2em;
      font-weight: 700;
      margin-left: 4vw;
    }
    .logoNav {
      font-size: 4vw;
    }
  }

  @media only screen and (min-device-width : 450px) {
    .logoNav {
      font-size: 3vw;
    }
  }

  @media only screen and (min-device-width : 900px) {
    .logoNav {
      font-size: 2vw;
    }
  }
  
  @media only screen and (min-width: 1750px) {
    .logo{
      font-size: 1.2vw;
      font-weight: 500;
      margin-left: 2vw;
    }
    .menus{
      font-size: 1.1vw;
      color: white;
    }
  }
  
  .drawer{
    display: flex;
    justify-content: center;
    text-align: center;
    backdrop-filter: blur(10px);
  }
  </style>  