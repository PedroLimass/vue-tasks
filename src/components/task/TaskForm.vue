<template>
  <form
    @submit.prevent="handleSubmit"
    class="bg-white dark:bg-rocket-gray-800 p-4 sm:p-6 rounded-lg border border-rocket-gray-200 dark:border-rocket-gray-700 shadow-sm"
  >
    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <label for="task-title" class="sr-only">Título da tarefa</label>
      <input
        id="task-title"
        type="text"
        placeholder="Digite o título da tarefa"
        v-model="taskTitle"
        :disabled="loading"
        required
        :class="[
          'flex-1 min-w-0 px-4 py-3 border border-rocket-gray-300 dark:border-rocket-gray-700',
          'rounded-lg bg-white dark:bg-rocket-gray-900 text-rocket-gray-900 dark:text-white',
          'placeholder-rocket-gray-500 dark:placeholder-rocket-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-rocket-purple-500 focus:border-rocket-purple-500 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        ]"
      />
      <button
        type="submit"
        :disabled="loading || !taskTitle.trim()"
        :class="[
          'inline-flex items-center justify-center gap-2 px-5 py-3',
          'bg-rocket-purple-500 hover:bg-rocket-purple-600 active:bg-rocket-purple-700 text-white',
          'rounded-lg font-medium transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'shrink-0',
        ]"
      >
        <Plus class="w-5 h-5" />
        <span>Adicionar</span>
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { Plus } from 'lucide-vue-next'
import { ref } from 'vue'

export default {
  name: 'TaskForm',
  components: {
    Plus,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['submit'],
  setup(_props, { emit }) {
    const taskTitle = ref('')

    const handleSubmit = () => {
      const title = taskTitle.value.trim()
      if (!title) return
      emit('submit', title)
      taskTitle.value = ''
    }

    return {
      taskTitle,
      handleSubmit,
    }
  },
}
</script>
