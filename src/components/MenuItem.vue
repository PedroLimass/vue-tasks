<template>
  <router-link
    :to="redirectTo"
    :class="[
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors',
      'text-rocket-purple-500 dark:text-rocket-purple-400',
      'border border-transparent',
      'hover:bg-rocket-purple-500 dark:hover:bg-rocket-purple-600 hover:text-white',
      'hover:border-rocket-purple-500',
      fullWidth ? 'w-full px-4 py-3' : 'px-4 py-2',
    ]"
  >
    {{ title }}
  </router-link>
</template>

<script lang="ts">
export default {
  name: 'MenuItem',
  props: {
    redirectTo: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
