// main.ts
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from '~/layouts/Default.vue'

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark',
    },
})

createApp(App)
    .use(vuetify)
    .mount('#app')
