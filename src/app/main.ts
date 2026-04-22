import { createApp } from 'vue'
import 'mathlive'
import 'mathlive/static.css'
import 'mathlive/fonts.css'
import 'katex/dist/katex.min.css'
import type { VirtualKeyboardInterface } from 'mathlive'

import App from './App.vue'
import { i18n } from './i18n'
import router from './router'

const mathVirtualKeyboard = window.mathVirtualKeyboard as VirtualKeyboardInterface | undefined

if (mathVirtualKeyboard) {
  mathVirtualKeyboard.layouts = ['compact']
  mathVirtualKeyboard.editToolbar = 'none'
}

const app = createApp(App)

app.use(i18n)
app.use(router)

app.mount('#app')
