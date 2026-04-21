<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { MathfieldElement } from 'mathlive'

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

const mathField = ref<MathfieldElement | null>(null)
const mathPlaceholder = computed(() => `\\text{${escapeLatexText(props.placeholder)}}`)

onMounted(() => {
  if (!mathField.value) return

  mathField.value.value = props.modelValue
  mathField.value.smartFence = true
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

function escapeLatexText(value: string): string {
  return value.replace(/[\\{}]/g, '\\$&')
}
</script>

<template>
  <math-field
    ref="mathField"
    class="min-h-14 w-full rounded-box border border-base-300 bg-base-100 px-3 py-2 text-xl focus-within:outline focus-within:outline-2 focus-within:outline-primary aria-disabled:cursor-not-allowed aria-disabled:bg-base-200 aria-disabled:text-base-content/70"
    :aria-label="label"
    :aria-disabled="disabled"
    :placeholder="mathPlaceholder"
  />
</template>
