<template>
  <section>
    <div class="flex items-baseline justify-between mb-3 sm:mb-4">
      <h2 class="text-lg sm:text-xl font-semibold text-rocket-gray-900 dark:text-white">
        {{ title }}
      </h2>
      <span
        class="text-xs sm:text-sm font-medium text-rocket-gray-500 dark:text-rocket-gray-400"
      >
        {{ (tasks as Task[]).length }}
      </span>
    </div>
    <div
      :data-drop-zone="dropZone"
      class="space-y-3 min-h-[100px]"
      @dragover.prevent="handleDragOver"
      @drop.prevent="handleDrop"
      @dragleave="handleDragLeave"
      :class="[
        'transition-colors duration-200 rounded-lg',
        isDragOver
          ? 'bg-rocket-purple-50 dark:bg-rocket-purple-900/20 outline-2 outline-dashed outline-rocket-purple-400 p-2'
          : '',
      ]"
    >
      <TaskItem
        v-for="task in tasks as Task[]"
        :key="task.id as number"
        :task="task as Task"
        :editing-task-id="editingTaskId"
        :is-dragging="draggedTaskId === (task.id as number)"
        @toggle="(id: number, done: boolean) => $emit('toggle', id, done)"
        @edit="handleEdit"
        @update="(id: number, title: string) => $emit('update', id, title)"
        @delete="$emit('delete', $event as number)"
        @drag-start="handleDragStart"
        @drag-end="$emit('dragEnd')"
      />
      <div
        v-if="(tasks as Task[]).length === 0"
        class="text-center py-6 sm:py-8 text-sm text-rocket-gray-500 dark:text-rocket-gray-400 border border-dashed border-rocket-gray-200 dark:border-rocket-gray-700 rounded-lg"
      >
        <p>{{ emptyMessage }}</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import TaskItem from './TaskItem.vue'
import type { Task } from '@/services/tasksService'
import type { PropType } from 'vue'

export default {
  name: 'TaskList',
  components: {
    TaskItem,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    tasks: {
      type: Array,
      required: true,
    },
    dropZone: {
      type: String,
      required: true,
    },
    editingTaskId: {
      type: Number as PropType<number | null>,
      default: null,
    },
    draggedTaskId: {
      type: Number as PropType<number | null>,
      default: null,
    },
    isDragOver: {
      type: Boolean,
      default: false,
    },
    emptyMessage: {
      type: String,
      default: 'Nenhuma tarefa',
    },
  },
  emits: [
    'toggle',
    'edit',
    'update',
    'delete',
    'dragStart',
    'dragEnd',
    'dragOver',
    'drop',
    'dragLeave',
  ],
  setup(props, { emit }) {
    const handleEdit = (task: Task) => {
      emit('edit', task)
    }

    const handleDragStart = (event: DragEvent, task: Task) => {
      emit('dragStart', event, task)
    }

    const handleDragOver = (event: DragEvent) => {
      emit('dragOver', event)
    }

    const handleDrop = (event: DragEvent) => {
      emit('drop', event)
    }

    const handleDragLeave = () => {
      emit('dragLeave')
    }

    return {
      handleEdit,
      handleDragStart,
      handleDragOver,
      handleDrop,
      handleDragLeave,
    }
  },
}
</script>
