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
  }
})
</script>
<template>
  <v-app-bar dark>
    <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
    <v-toolbar-title>Gerenciador</v-toolbar-title>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" absolute temporary>
    <v-list nav dense>
      <v-list-item
        v-model="group"
        active-class="deep-purple--text text--accent-4"
        @click="group = 0"
      >
        <v-list-item-title>Impressoras</v-list-item-title>
      </v-list-item>
    </v-list>
    <v-list nav dense>
      <v-list-item
        v-model="group"
        active-class="deep-purple--text text--accent-4"
        @click="group = 1"
      >
        <v-list-item-title>Configurações</v-list-item-title>
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
</template>
