<template>
    <v-footer
      class="text-center d-flex flex-column footer"
      color="secondary"
    >
      <div>
        <v-btn
          v-for="link in links"
          :key="link"
          class="mx-4"
          :icon="link.icon"
          target="_blank"
          :href="link.web"
          variant="text"
        ></v-btn>
      </div>
  
      <div class="pt-0">
        <v-container>
            <v-card color="primary" class="phoneCard py-3 px-8">
                <v-icon class="phoneIcon pr-2" icon="mdi-cellphone-sound"></v-icon>
                Nous contacter<p class="px-2 text" style="color: #757367;"> 8:30-12:30 / 13:30-17:15 (Ven 15:30)</p>+33 (0)4 92 08 40 40
            </v-card>
        </v-container>  
      </div>
  
      <v-divider></v-divider>
  
      <div>
        {{ new Date().getFullYear() }} — <strong>Fayat Bâtiment</strong>
      </div>
    </v-footer>
  </template>

<script>
export default {

    name: 'FooterComp',

    data: () => ({
        links: [
                { icon: 'mdi-twitter', 
                web: 'https://twitter.com/GroupeFayat'},

                { icon: 'mdi-instagram', 
                web: 'https://www.instagram.com/fayatbatiment/'},

                { icon: 'mdi-facebook', 
                web: 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Ffayat.com%2Ffr%2Fmetiers'},

                { icon: 'mdi-linkedin', 
                web: 'https://www.linkedin.com/company/fayatbatiment/'},
            ],
    }),
}
</script>

<style scoped>
    .phoneCard {
        justify-content: center;
        display: flex;
        flex-wrap: wrap;
        color: white;
        font-weight: bold;
        text-align: center;
        border-radius: 2em;
        font-size: 1vw;
    }

    .phoneIcon{
        color: #FFD700;
    }

    @media only screen and (max-width: 870px) {
        .phoneCard {
            font-size: 1.5vw;
        }
    }

    @media only screen and (max-width: 567px) {
        .phoneCard {
            font-size: 2.8vw;
        }
    }

    @media only screen and (max-width: 350px) {
        .phoneCard {
            font-size: 3.5vw;
        }
    }
</style>