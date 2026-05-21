<template>
  <div
    class="min-h-screen bg-rocket-gray-50 dark:bg-rocket-gray-900 transition-colors duration-200"
  >
    <NavBar />

    <main class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- <router-view /> -->
      <RouterView />
    </main>
  </div>
</template>

<script lang="ts">
import NavBar from '@/components/NavBar.vue'
export default {
  name: 'App',
  components: {
    NavBar,
  },
}
</script>
