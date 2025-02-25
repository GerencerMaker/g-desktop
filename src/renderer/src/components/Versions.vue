<script setup lang="ts">
import { reactive } from 'vue'

const versions = reactive({ ...window.electron.process.versions })
const printers = reactive<{ name: string }[]>([])

async function listPrinters() {
  console.log(await window.electron.ipcRenderer.invoke('list-printers'));
  printers.splice(0, printers.length, ...(await window.electron.ipcRenderer.invoke('list-printers')))
}
</script>

<template>
  <button @click="listPrinters">Listar Impressoras</button>
</template>
