import { createApp } from 'vue'
import 'mathlive'
import 'mathlive/static.css'
import 'mathlive/fonts.css'
import 'katex/dist/katex.min.css'

import App from './App.vue'
import { i18n } from './i18n'
import router from './router'

const app = createApp(App)

app.use(i18n)
app.use(router)

app.mount('#app')
