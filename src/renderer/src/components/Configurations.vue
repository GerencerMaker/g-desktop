<template>
  <v-btn color="red-accent-4" @click="logout">Sair</v-btn>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},
  props: {},
  methods: {
    logout() {
      this.$router.push('/login')
    }
  }
})
</script>
