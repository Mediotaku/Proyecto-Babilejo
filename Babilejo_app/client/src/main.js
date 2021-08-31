import { createApp } from 'vue'
import App from './App.vue'
import Vue3NativeNotification from 'vue3-native-notification'
import Vue3TouchEvents from "vue3-touch-events";

const app = createApp(App)

app.use(Vue3NativeNotification, {
  // Automatic permission request before
  // showing notification (default: true)
  requestOnNotify: true,
})
app.use(Vue3TouchEvents)

app.mount('#app')