<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { MathfieldElement } from 'mathlive'

const props = defineProps<{
  modelValue: string
  label: string
  placeholder: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const mathField = ref<MathfieldElement | null>(null)

onMounted(() => {
  if (!mathField.value) return

  mathField.value.value = props.modelValue
  mathField.value.smartFence = true
  mathField.value.addEventListener('input', handleInput)
})

watch(
  () => props.modelValue,
  (value) => {
    if (mathField.value && mathField.value.getValue('ascii-math') !== value) {
      mathField.value.value = value
    }
  }
)

function handleInput() {
  emit('update:modelValue', mathField.value?.getValue('ascii-math') ?? '')
}
</script>

<template>
  <math-field
    ref="mathField"
    class="min-h-14 w-full rounded-box border border-base-300 bg-base-100 px-3 py-2 text-xl focus-within:outline focus-within:outline-2 focus-within:outline-primary"
    :aria-label="label"
    :placeholder="placeholder"
  />
</template>
