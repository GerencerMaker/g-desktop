<script>
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {},
  props: {},
  setup() {
    const route = useRoute()
    
    const currentLayout = computed(() => {
      return route.path === '/login' ? 'div' : 'v-app'
    })

    return {
      currentLayout
    }
  }
})
</script>

<template>
  <component :is="currentLayout">
    <router-view></router-view>
  </component>
</template>

<style>
/* Estilos globais para garantir que o login ocupe toda a tela */
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
