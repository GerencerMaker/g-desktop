<script>
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},
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
  <v-app>
    <router-view></router-view>
  </v-app>
</template>
