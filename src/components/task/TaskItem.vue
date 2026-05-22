<template>
  <div
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="$emit('dragEnd')"
    :class="[
      'bg-white dark:bg-rocket-gray-800 p-3 sm:p-4 rounded-lg border border-rocket-gray-200 dark:border-rocket-gray-700',
      'flex items-center gap-3 sm:gap-4 transition-all cursor-move shadow-sm',
      isDragging ? 'opacity-50 ring-2 ring-rocket-purple-500' : 'hover:shadow-md',
      task.completed ? 'opacity-70' : '',
    ]"
  >
    <label class="relative inline-flex items-center cursor-pointer shrink-0">
      <input
        type="checkbox"
        :checked="task.completed"
        @change="handleToggle"
        :aria-label="task.completed ? 'Marcar como pendente' : 'Marcar como concluída'"
        class="sr-only peer"
      />
      <div
        :class="[
          'w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center',
          task.completed
            ? 'bg-rocket-purple-500 border-rocket-purple-500'
            : 'bg-transparent border-rocket-gray-300 dark:border-rocket-gray-600',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-rocket-purple-500 peer-focus-visible:ring-offset-2',
        ]"
      >
        <svg
          v-if="task.completed"
          class="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </label>

    <div class="flex-1 min-w-0">
      <input
        v-if="isEditing"
        v-model="editingTitle"
        @blur="handleUpdate"
        @keyup.enter="handleUpdate"
        @keyup.esc="cancelEdit"
        :class="[
          'w-full px-3 py-2 border border-rocket-gray-300 dark:border-rocket-gray-700',
          'rounded bg-white dark:bg-rocket-gray-900 text-rocket-gray-900 dark:text-white',
          'focus:outline-none focus:ring-2 focus:ring-rocket-purple-500 focus:border-rocket-purple-500',
        ]"
        autofocus
      />
      <p
        v-else
        @dblclick="startEdit"
        :class="[
          'cursor-pointer select-none break-words',
          task.completed
            ? 'line-through text-rocket-gray-500 dark:text-rocket-gray-400'
            : 'text-rocket-gray-900 dark:text-white',
        ]"
      >
        {{ task.title }}
      </p>
    </div>

    <div class="flex gap-1 sm:gap-2 shrink-0">
      <button
        v-if="!isEditing"
        type="button"
        @click="startEdit"
        aria-label="Editar tarefa"
        class="inline-flex items-center justify-center w-10 h-10 text-rocket-purple-500 hover:bg-rocket-purple-50 dark:hover:bg-rocket-purple-900/30 rounded-lg transition-colors"
      >
        <Edit class="w-5 h-5" />
      </button>
      <button
        type="button"
        @click="$emit('delete', task.id)"
        aria-label="Excluir tarefa"
        class="inline-flex items-center justify-center w-10 h-10 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
      >
        <Trash2 class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Edit, Trash2 } from 'lucide-vue-next'
import { computed, ref, type PropType } from 'vue'
import type { Task } from '@/services/tasksService'

export default {
  name: 'TaskItem',
  components: {
    Edit,
    Trash2,
  },
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true,
    },
    editingTaskId: {
      type: Number as PropType<number | null>,
      default: null,
    },
    isDragging: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['toggle', 'edit', 'update', 'delete', 'dragStart', 'dragEnd'],
  setup(props, { emit }) {
    const editingTitle = ref('')

    const isEditing = computed(() => props.editingTaskId === props.task.id)

    const startEdit = () => {
      editingTitle.value = props.task.title
      emit('edit', props.task)
    }

    const cancelEdit = () => {
      editingTitle.value = ''
      emit('edit', null)
    }

    const handleUpdate = () => {
      if (!editingTitle.value.trim()) {
        cancelEdit()
        return
      }
      emit('update', props.task.id, editingTitle.value.trim())
    }

    const handleToggle = () => {
      emit('toggle', props.task.id, !props.task.completed)
    }

    const handleDragStart = (event: DragEvent) => {
      emit('dragStart', event, props.task as Task)
    }

    return {
      editingTitle,
      isEditing,
      startEdit,
      cancelEdit,
      handleUpdate,
      handleToggle,
      handleDragStart,
    }
  },
}
</script>
