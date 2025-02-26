<script>
import Configurations from './components/Configurations.vue'
import Printers from './components/Printers.vue'

import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    Printers,
    Configurations
  },
  props: {
    name: String,
    msg: { type: String, required: true }
  },
  data() {
    return {
      drawer: false,
      group: 0
    }
  }
})
</script>

<template>
  <v-app>
    <v-app-bar dark>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>Gerenciador</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
          <v-list-item @click="group = 0">
            <v-list-item-title>Impressoras</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-list nav dense>
        <v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
          <v-list-item @click="group = 1">
            <v-list-item-title>Configurações</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
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
