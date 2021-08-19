import { createApp } from 'vue'
import App from './App.vue'
import Vue3NativeNotification from 'vue3-native-notification'

const app = createApp(App)

app.use(Vue3NativeNotification, {
  // Automatic permission request before
  // showing notification (default: true)
  requestOnNotify: true,
})

app.mount('#app')