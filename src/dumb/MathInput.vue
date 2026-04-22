<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { MathfieldElement } from 'mathlive'
import { useI18n } from 'vue-i18n'

type ToolbarAction = {
  id: 'square' | 'power' | 'leftParen' | 'rightParen' | 'plus' | 'minus' | 'multiply' | 'divide'
  label: string
  insertLatex: string
  selectionMode?: 'placeholder' | 'after'
}

const props = defineProps<{
  modelValue: string
  label: string
  placeholder: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: []
}>()

const { t } = useI18n()
const mathField = ref<MathfieldElement | null>(null)
const mathPlaceholder = computed(() => `\\text{${escapeLatexText(props.placeholder)}}`)
const toolbarActions = computed<ToolbarAction[]>(() => [
  {
    id: 'square',
    label: t('tutor.mathInputToolbar.squareSymbol'),
    insertLatex: '^{2}',
    selectionMode: 'after'
  },
  {
    id: 'power',
    label: t('tutor.mathInputToolbar.powerSymbol'),
    insertLatex: '^{#0}'
  },
  {
    id: 'leftParen',
    label: t('tutor.mathInputToolbar.leftParenSymbol'),
    insertLatex: '(#0)'
  },
  {
    id: 'rightParen',
    label: t('tutor.mathInputToolbar.rightParenSymbol'),
    insertLatex: ')',
    selectionMode: 'after'
  },
  {
    id: 'plus',
    label: t('tutor.mathInputToolbar.plusSymbol'),
    insertLatex: '+',
    selectionMode: 'after'
  },
  {
    id: 'minus',
    label: t('tutor.mathInputToolbar.minusSymbol'),
    insertLatex: '-',
    selectionMode: 'after'
  },
  {
    id: 'multiply',
    label: t('tutor.mathInputToolbar.multiplySymbol'),
    insertLatex: '\\cdot',
    selectionMode: 'after'
  },
  {
    id: 'divide',
    label: t('tutor.mathInputToolbar.divideSymbol'),
    insertLatex: '/',
    selectionMode: 'after'
  }
])

onMounted(() => {
  if (!mathField.value) return

  mathField.value.value = props.modelValue
  mathField.value.smartFence = true
  mathField.value.mathVirtualKeyboardPolicy = 'auto'
  mathField.value.readOnly = props.disabled ?? false
  mathField.value.addEventListener('input', handleInput)
  mathField.value.addEventListener('keydown', handleKeydown)
})

watch(
  () => props.modelValue,
  (value) => {
    if (mathField.value && mathField.value.getValue('ascii-math') !== value) {
      mathField.value.value = value
    }
  }
)

watch(
  () => props.disabled,
  (disabled) => {
    if (mathField.value) {
      mathField.value.readOnly = disabled ?? false
    }
  }
)

function handleInput() {
  emit('update:modelValue', mathField.value?.getValue('ascii-math') ?? '')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
    return
  }

  event.preventDefault()
  emit('submit')
}

function insertToolbarAction(
  action: ToolbarAction,
  event: MouseEvent | PointerEvent | KeyboardEvent
) {
  event.preventDefault()

  if (!mathField.value || props.disabled) {
    return
  }

  mathField.value.focus()
  mathField.value.insert(action.insertLatex, {
    format: 'latex',
    focus: true,
    selectionMode: action.selectionMode ?? 'placeholder'
  })
  emit('update:modelValue', mathField.value.getValue('ascii-math'))
}

function escapeLatexText(value: string): string {
  return value.replace(/[\\{}]/g, '\\$&')
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      class="flex flex-wrap gap-2"
      :aria-label="t('tutor.mathInputToolbar.label')"
      role="toolbar"
    >
      <button
        v-for="action in toolbarActions"
        :key="action.id"
        class="btn btn-sm btn-outline"
        type="button"
        :disabled="disabled"
        :aria-label="t(`tutor.mathInputToolbar.${action.id}`)"
        @pointerdown="insertToolbarAction(action, $event)"
        @keydown.enter.prevent="insertToolbarAction(action, $event)"
        @keydown.space.prevent="insertToolbarAction(action, $event)"
      >
        {{ action.label }}
      </button>
    </div>
    <math-field
      ref="mathField"
      class="min-h-14 w-full rounded-box border border-base-300 bg-base-100 px-3 py-2 text-xl focus-within:outline focus-within:outline-2 focus-within:outline-primary aria-disabled:cursor-not-allowed aria-disabled:bg-base-200 aria-disabled:text-base-content/70"
      :aria-label="label"
      :aria-disabled="disabled"
      :placeholder="mathPlaceholder"
    />
  </div>
</template>

<style scoped>
:deep(math-field::part(virtual-keyboard-toggle)) {
  display: none;
}
</style>
