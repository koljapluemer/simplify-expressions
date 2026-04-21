<script setup lang="ts">
import { computed, ref } from 'vue'
import { CheckCircle2, CircleAlert, Lightbulb, RefreshCw } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import MathInput from '@/dumb/MathInput.vue'
import RenderedMath from '@/dumb/RenderedMath.vue'
import { generateExercise } from '@/entities/expression-exercise/exerciseGenerator'
import { gradeAnswer } from '@/entities/expression-exercise/exerciseGrader'
import { normalizeExpression } from '@/entities/expression-exercise/mathEngine'
import type { GradeResult } from '@/entities/expression-exercise/exerciseTypes'

const { t } = useI18n()

const exercise = ref(generateExercise())
const answer = ref('')
const resolution = ref<{ kind: 'revealed' } | { kind: 'graded'; result: GradeResult } | null>(null)

type TutorState =
  | { mode: 'editing'; hasInput: boolean }
  | { mode: 'resolved'; resolution: NonNullable<typeof resolution.value> }

const tutorState = computed<TutorState>(() => {
  if (resolution.value) {
    return { mode: 'resolved', resolution: resolution.value }
  }

  if (answer.value.trim().length > 0) {
    return { mode: 'editing', hasInput: true }
  }

  return { mode: 'editing', hasInput: false }
})

const feedbackKey = computed(() => {
  if (tutorState.value.mode === 'resolved') {
    if (tutorState.value.resolution.kind === 'revealed') {
      return 'tutor.feedback.revealed'
    }

    return `tutor.feedback.${tutorState.value.resolution.result.reason}`
  }

  return 'tutor.feedback.idle'
})

const feedbackClass = computed(() => {
  if (tutorState.value.mode === 'resolved') {
    if (tutorState.value.resolution.kind === 'revealed') {
      return 'alert-info'
    }

    return tutorState.value.resolution.result.isCorrect ? 'alert-success' : 'alert-warning'
  }

  return 'alert-info'
})

const feedbackIcon = computed(() => {
  if (tutorState.value.mode === 'resolved') {
    if (tutorState.value.resolution.kind === 'revealed') {
      return Lightbulb
    }

    return tutorState.value.resolution.result.isCorrect ? CheckCircle2 : CircleAlert
  }

  return Lightbulb
})

const isResolved = computed(() => tutorState.value.mode === 'resolved')
const isSolutionVisible = computed(() => isResolved.value)

const actionConfig = computed(() => {
  if (tutorState.value.mode === 'resolved') {
    return {
      label: t('tutor.next'),
      icon: RefreshCw,
      handler: nextExercise
    }
  }

  if (tutorState.value.mode === 'editing' && !tutorState.value.hasInput) {
    return {
      label: t('tutor.giveUp'),
      icon: Lightbulb,
      handler: revealSolution
    }
  }

  return {
    label: t('tutor.check'),
    icon: CheckCircle2,
    handler: checkAnswer
  }
})

function checkAnswer() {
  if (import.meta.env.DEV) {
    console.log('grading expression answer', {
      rawAnswer: answer.value,
      normalizedAnswer: normalizeExpression(answer.value),
      source: exercise.value.source,
      normalizedSource: normalizeExpression(exercise.value.source),
      target: exercise.value.target,
      normalizedTarget: normalizeExpression(exercise.value.target)
    })
  }

  resolution.value = {
    kind: 'graded',
    result: gradeAnswer(exercise.value, answer.value)
  }
}

function revealSolution() {
  resolution.value = { kind: 'revealed' }
}

function nextExercise() {
  exercise.value = generateExercise(exercise.value.id)
  answer.value = ''
  resolution.value = null
}
</script>

<template>
  <section class="flex w-full max-w-xl flex-col gap-5">
    <div
      class="alert"
      :class="feedbackClass"
    >
      <component
        :is="feedbackIcon"
        :size="22"
        aria-hidden="true"
      />
      <div class="flex min-w-0 flex-1 flex-col gap-3">
        <span>{{ t(feedbackKey) }}</span>
        <RenderedMath
          v-if="isSolutionVisible"
          :expression="exercise.target"
        />
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <RenderedMath :expression="exercise.source" />
    </div>

    <div class="flex flex-col gap-3">
      <MathInput
        v-model="answer"
        :disabled="isResolved"
        :label="t('tutor.answerLabel')"
        :placeholder="t('tutor.answerPlaceholder')"
      />
      <button
        class="btn btn-primary"
        type="button"
        @click="actionConfig.handler"
      >
        <component
          :is="actionConfig.icon"
          :size="20"
          aria-hidden="true"
        />
        {{ actionConfig.label }}
      </button>
    </div>
  </section>
</template>
