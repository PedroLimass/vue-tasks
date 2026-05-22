<template>
  <div>
    <div class="max-w-4xl mx-auto space-y-5 sm:space-y-6">
      <div class="flex items-center justify-between gap-3">
        <h1 class="text-2xl sm:text-3xl font-bold text-rocket-gray-900 dark:text-white">
          Minhas Tarefas
        </h1>
        <span
          v-if="tasksStore.tasks.length > 0"
          class="text-sm font-medium text-rocket-gray-500 dark:text-rocket-gray-400 shrink-0"
        >
          {{ tasksStore.pendingTasks.length }} / {{ tasksStore.tasks.length }}
        </span>
      </div>

      <TaskForm :loading="tasksStore.loading" @submit="handleCreateTask" />

      <div
        v-if="tasksStore.error"
        role="alert"
        class="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 p-4 text-center font-medium rounded-lg"
      >
        <p>{{ tasksStore.error }}</p>
      </div>

      <div v-if="tasksStore.loading && tasksStore.tasks.length === 0" class="text-center py-8">
        <p class="text-rocket-gray-600 dark:text-rocket-gray-400">Carregando tarefas...</p>
      </div>

      <div v-else-if="tasksStore.tasks.length === 0" class="text-center py-10 sm:py-14">
        <p class="text-rocket-gray-600 dark:text-rocket-gray-400">
          Nenhuma tarefa cadastrada ainda.
        </p>
      </div>

      <div v-else class="space-y-6 sm:space-y-8">
        <TaskList
          title="Pendentes"
          :tasks="tasksStore.pendingTasks"
          drop-zone="pending"
          :editing-task-id="tasksStore.editingTaskId"
          :dragged-task-id="tasksStore.draggedTaskId"
          :is-drag-over="tasksStore.dragOverTarget === 'pending'"
          empty-message="Nenhuma tarefa pendente"
          @toggle="handleToggleTask"
          @edit="handleEdit"
          @update="handleUpdateTask"
          @delete="handleDeleteTask"
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
          @drag-over="handleDragOver"
          @drop="(e) => handleDrop(e, false)"
          @drag-leave="tasksStore.setDragOverTarget(null)"
        />

        <TaskList
          title="Concluídas"
          :tasks="tasksStore.completedTasks"
          drop-zone="completed"
          :editing-task-id="tasksStore.editingTaskId"
          :dragged-task-id="tasksStore.draggedTaskId"
          :is-drag-over="tasksStore.dragOverTarget === 'completed'"
          empty-message="Nenhuma tarefa concluída"
          @toggle="handleToggleTask"
          @edit="handleEdit"
          @update="handleUpdateTask"
          @delete="handleDeleteTask"
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
          @drag-over="handleDragOver"
          @drop="(e) => handleDrop(e, true)"
          @drag-leave="tasksStore.setDragOverTarget(null)"
        />
      </div>
    </div>

    <ConfirmModal
      :show="tasksStore.showDeleteModal"
      title="Confirmar exclusão"
      message="Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
      confirm-text="Excluir"
      cancel-text="Cancelar"
      :loading="tasksStore.loading"
      @close="tasksStore.closeDeleteModal"
      @confirm="tasksStore.confirmDelete"
    />
  </div>
</template>

<script lang="ts">
import ConfirmModal from '@/components/ConfirmModal.vue'
import TaskForm from '@/components/task/TaskForm.vue'
import TaskList from '@/components/task/TaskList.vue'
import type { Task } from '@/services/tasksService'
import { useTasksStore } from '@/stores/tasksStore'
import { onMounted } from 'vue'

export default {
  name: 'TasksView',
  components: {
    TaskForm,
    TaskList,
    ConfirmModal,
  },
  setup() {
    const tasksStore = useTasksStore()

    const handleCreateTask = async (title: string) => {
      try {
        await tasksStore.createTask(title)
      } catch (err) {
        console.error('Erro ao criar tarefa:', err)
      }
    }

    const handleToggleTask = async (id: number, completed: boolean) => {
      try {
        await tasksStore.toggleTask(id, completed)
      } catch (err) {
        console.error('Erro ao atualizar tarefa:', err)
      }
    }

    const handleEdit = (task: Task) => {
      tasksStore.setEditingTask(task)
    }

    const handleUpdateTask = async (id: number, title: string) => {
      try {
        await tasksStore.updateTask(id, title)
      } catch (err) {
        console.error('Erro ao atualizar tarefa:', err)
      }
    }

    const handleDeleteTask = (id: number) => {
      tasksStore.openDeleteModal(id)
    }

    const handleDragStart = (event: DragEvent, task: Task) => {
      if (!event.dataTransfer) return
      tasksStore.setDraggedTask(task.id)
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', task.id.toString())
    }

    const handleDragEnd = () => {
      tasksStore.clearDraggedTask()
    }

    const handleDragOver = (event: DragEvent) => {
      if (!event.currentTarget) return
      event.preventDefault()
      const target = event.currentTarget as HTMLElement
      const dropZone = target.getAttribute('data-drop-zone')
      if (dropZone === 'pending' || dropZone === 'completed') {
        tasksStore.setDragOverTarget(dropZone)
      }
    }

    const handleDrop = async (event: DragEvent, targetDone: boolean) => {
      if (!event.dataTransfer) return
      event.preventDefault()
      const taskId = parseInt(event.dataTransfer.getData('text/plain'))
      await tasksStore.handleDrop(taskId, targetDone)
    }

    onMounted(() => {
      tasksStore.loadTasks()
    })

    return {
      tasksStore,
      handleCreateTask,
      handleToggleTask,
      handleEdit,
      handleUpdateTask,
      handleDeleteTask,
      handleDragStart,
      handleDragEnd,
      handleDragOver,
      handleDrop,
    }
  },
}
</script>
