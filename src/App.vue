<script setup>
import Navbar from './components/nav.vue'
</script>

<template>
  <Navbar />
  <router-view />   <!-- route จะ render หน้า Home / Dashboard / DiscordCallback -->
</template>
