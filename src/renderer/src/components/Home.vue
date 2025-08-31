<script>
import Configurations from './Configurations.vue'
import Printers from './Printers.vue'

import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    Printers,
    Configurations
  },
  props: {},
  data() {
    return {
      drawer: false,
      group: 0
    }
  },
  methods: {
    async handleLogout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('supplier')

      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=')
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      })

      await window.electron.ipcRenderer.invoke('resize-to-login')
      window.dispatchEvent(new CustomEvent('supplier:changed', { detail: null}))
      this.$router.push('/login')
    },
    async resizeToMainWindow() {
      await window.electron.ipcRenderer.invoke('resize-window')
    }
  },
  mounted() {
    this.resizeToMainWindow()
  }
})
</script>
<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>Gerenciador</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="handleLogout" title="Sair">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item
          v-model="group"
          active-class="primary--text"
          @click="group = 0"
        >
          <template v-slot:prepend>
            <v-icon>mdi-printer</v-icon>
          </template>
          <v-list-item-title>Impressoras</v-list-item-title>
        </v-list-item>

        <v-list-item
          v-model="group"
          active-class="primary--text"
          @click="group = 1"
        >
          <template v-slot:prepend>
            <v-icon>mdi-cog</v-icon>
          </template>
          <v-list-item-title>Configurações</v-list-item-title>
        </v-list-item>

        <v-divider class="my-2"></v-divider>

        <v-list-item @click="handleLogout">
          <template v-slot:prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
          <v-list-item-title>Sair</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container>
        <Printers v-if="group === 0" />
      </v-container>
      <v-container>
        <Configurations v-if="group === 1" />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-list-item {
  border-radius: 8px;
  margin: 4px 8px;
}

.v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
}
</style>