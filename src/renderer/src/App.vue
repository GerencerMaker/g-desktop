<script setup lang="ts">
import { ref } from 'vue'
import Printers from './components/Printers.vue'

const drawer = ref(true)
const selectedTab = ref('printers')
</script>

<template>
    <Printers></Printers>
</template>