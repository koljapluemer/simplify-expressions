<script setup lang="ts">
import { computed, ref } from 'vue'
import { CheckCircle2, CircleAlert, Lightbulb, RefreshCw } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import MathInput from '@/dumb/MathInput.vue'
import RenderedMath from '@/dumb/RenderedMath.vue'
import { generateExercise } from '@/entities/expression-exercise/exerciseGenerator'
import { gradeAnswer } from '@/entities/expression-exercise/exerciseGrader'
import type { GradeResult } from '@/entities/expression-exercise/exerciseTypes'

const { t } = useI18n()

const exercise = ref(generateExercise())
const answer = ref('')
const result = ref<GradeResult | null>(null)
const isTargetVisible = ref(false)

const feedbackKey = computed(() => {
  if (!result.value) return 'tutor.feedback.idle'
  return `tutor.feedback.${result.value.reason}`
})

const feedbackClass = computed(() => {
  if (!result.value) return 'alert-info'
  return result.value.isCorrect ? 'alert-success' : 'alert-warning'
})

const feedbackIcon = computed(() => {
  if (!result.value) return Lightbulb
  return result.value.isCorrect ? CheckCircle2 : CircleAlert
})

function checkAnswer() {
  result.value = gradeAnswer(exercise.value, answer.value)
}

function nextExercise() {
  exercise.value = generateExercise(exercise.value.id)
  answer.value = ''
  result.value = null
  isTargetVisible.value = false
}
</script>

<template>
  <section class="flex w-full max-w-2xl flex-col gap-6">
    <div class="space-y-2">
      <h1 class="text-3xl font-bold">
        {{ t('tutor.title') }}
      </h1>
      <p class="text-base-content/70">
        {{ t('tutor.intro') }}
      </p>
    </div>

    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between gap-3">
        <span class="font-medium">{{ t('tutor.exerciseLabel') }}</span>
        <span class="badge badge-outline">
          {{ t(`tutor.examples.${exercise.kind}`) }}
        </span>
      </div>
      <RenderedMath :expression="exercise.source" />
    </div>

    <label class="form-control gap-2">
      <span class="label p-0">
        <span class="label-text font-medium">{{ t('tutor.answerLabel') }}</span>
      </span>
      <MathInput
        v-model="answer"
        :label="t('tutor.answerLabel')"
        :placeholder="t('tutor.answerPlaceholder')"
      />
    </label>

    <div
      class="alert"
      :class="feedbackClass"
    >
      <component
        :is="feedbackIcon"
        :size="22"
        aria-hidden="true"
      />
      <span>{{ t(feedbackKey) }}</span>
    </div>

    <div class="flex flex-wrap gap-3">
      <button
        class="btn btn-primary"
        type="button"
        @click="checkAnswer"
      >
        <CheckCircle2
          :size="20"
          aria-hidden="true"
        />
        {{ t('tutor.check') }}
      </button>
      <button
        class="btn btn-outline"
        type="button"
        @click="nextExercise"
      >
        <RefreshCw
          :size="20"
          aria-hidden="true"
        />
        {{ t('tutor.next') }}
      </button>
      <button
        class="btn btn-ghost"
        type="button"
        @click="isTargetVisible = !isTargetVisible"
      >
        {{ t(isTargetVisible ? 'tutor.hideTarget' : 'tutor.showTarget') }}
      </button>
    </div>

    <div
      v-if="isTargetVisible"
      class="flex flex-col gap-3"
    >
      <span class="font-medium">{{ t('tutor.targetLabel') }}</span>
      <RenderedMath :expression="exercise.target" />
    </div>
  </section>
</template>
