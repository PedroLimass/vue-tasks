<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
        @click.self="$emit('close')"
        @keydown.esc="$emit('close')"
      >
        <div
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="messageId"
          class="w-full sm:max-w-md bg-white dark:bg-rocket-gray-800 rounded-t-2xl sm:rounded-2xl border border-rocket-gray-200 dark:border-rocket-gray-700 shadow-2xl p-5 sm:p-6 space-y-4"
        >
          <h2
            :id="titleId"
            class="text-lg sm:text-xl font-bold text-rocket-gray-900 dark:text-white"
          >
            {{ title }}
          </h2>

          <p
            :id="messageId"
            class="text-sm sm:text-base text-rocket-gray-600 dark:text-rocket-gray-300"
          >
            {{ message }}
          </p>

          <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2">
            <button
              type="button"
              :disabled="loading"
              class="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-lg font-medium text-rocket-gray-700 dark:text-rocket-gray-200 border border-rocket-gray-200 dark:border-rocket-gray-700 hover:bg-rocket-gray-50 dark:hover:bg-rocket-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              @click="$emit('close')"
            >
              {{ cancelText }}
            </button>
            <button
              type="button"
              :disabled="loading"
              class="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 active:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              @click="$emit('confirm')"
            >
              {{ loading ? 'Processando...' : confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { useId } from 'vue'

export default {
  name: 'ConfirmModal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    confirmText: {
      type: String,
      default: 'Confirmar',
    },
    cancelText: {
      type: String,
      default: 'Cancelar',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'confirm'],
  setup() {
    const baseId = useId()

    return {
      titleId: `${baseId}-title`,
      messageId: `${baseId}-message`,
    }
  },
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 180ms ease;
}
.modal-enter-active > div,
.modal-leave-active > div {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div,
.modal-leave-to > div {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

@media (min-width: 640px) {
  .modal-enter-from > div,
  .modal-leave-to > div {
    transform: translateY(0) scale(0.98);
  }
}
</style>
