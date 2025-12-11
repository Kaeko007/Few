<template>
  <div class="server-list-area">
    <h1 class="welcome">Welcome to Astralis Dashboard</h1>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <div>
      HI
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.welcome {
  font-size: 24px;
  margin-bottom: 20px;
  color: black;
}
</style>
