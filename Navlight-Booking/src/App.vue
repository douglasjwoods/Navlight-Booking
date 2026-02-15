<script setup lang="ts">
import Home from './views/Home.vue'
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <h1>Navlight Booking</h1>
      <p>Book sets, view availability, and manage returns in one place.</p>
    </header>
    <main class="content-card">
      <Home />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(180deg, #eef4ff 0%, #f7f9fc 60%);
  font-family: Inter, Segoe UI, Arial, sans-serif;
}

.app-header {
  max-width: 1080px;
  margin: 0 auto 18px auto;
}

.app-header h1 {
  margin: 0;
  font-size: 30px;
  color: #1d2a44;
}

.app-header p {
  margin: 8px 0 0;
  color: #52607a;
}

.content-card {
  max-width: 1080px;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #e6eaf2;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(17, 24, 39, 0.08);
}

@media (max-width: 768px) {
  .app-shell {
    padding: 14px;
  }

  .app-header h1 {
    font-size: 24px;
  }
}
</style>
