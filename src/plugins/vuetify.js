// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  theme: {
    // Définit le thème par défaut
    defaultTheme: 'dark',

    // Définit les couleurs pour chaque thème
    themes: {
      light: {
        colors: {
          secondary: '#f5f5f5',
          hamburger: '#000000',
          button: '#ffffff',
          primary: '#ffffff',
          btnText: '#ffffff',
          buttonDownload: '#1E3851',
          ghostPurple: '#8154AF',
          nesDown: '#5C5A5A',
          nesUpper: '#D2CFCB',
          box: '#353D46',
        }
      },
      dark: {
        colors: {
          primary: '#181E26',
          button: '#242C36',
          secondary: '#242C36',
          background: '#181E26',
          hamburger: '#ffffff',
          buttonDownload: '#242C36',
          ghostPurple: '#8154AF',
          nesDown: '#5C5A5A',
          nesUpper: '#D2CFCB',
          box: '#353D46',
        }
      },
    },
  },
})
