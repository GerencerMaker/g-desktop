import { createApp } from 'vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import router from './router/router'
import '../../echo';
let currentChannel: any = null;

function initEchoListener(supplierId: number) {
  if (currentChannel) {
    currentChannel.stopListening('.order.printer');
    (window as any).Echo.leaveChannel(currentChannel.name);
    currentChannel = null;
  }

  currentChannel = (window as any).Echo.channel(`printer_location-g-desktop.${supplierId}`);
  currentChannel.listen('.order.printer', (event: any) => {
    (window as any).electron.ipcRenderer.invoke('print-order', event.order);
  });
  console.log(currentChannel);
}

function removeEchoListener() {
  if (currentChannel) {
    currentChannel.stopListening('.order.printer');
    (window as any).Echo.leaveChannel(currentChannel.name);
    currentChannel = null;
  }
}

window.addEventListener('supplier:changed', (event: any) => {
  if (event.detail) {
    initEchoListener(event.detail.id);
  } else {
    removeEchoListener();
  }
});

(window as any).initEchoListener = initEchoListener;
(window as any).removeEchoListener = removeEchoListener

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#FAFAFA',
          surface: '#FFFFFF',
        },
      },
    },
  },
})

createApp(App).use(router).use(vuetify).mount('#app')
