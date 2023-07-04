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
  
      <v-divider></v-divider>
  
      <div>
        {{ new Date().getFullYear() }} — <strong>GameDash</strong>
      </div>
    </v-footer>
  </template>

<script>
export default {

    name: 'FooterComp',

    data: () => ({
        links: [
                { icon: 'mdi-email-edit ', 
                web: 'mailto:arnaud.cossu@gmail.com?subject=Message GameDash'},

                { icon: 'mdi-github', 
                web: 'https://github.com/ArnaudCs'},

                { icon: 'mdi-linkedin', 
                web: 'https://www.linkedin.com/in/arnaud-c-65357215a/'},

                { icon: 'mdi-web', 
                web: 'https://arnaudcs.github.io/'},
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