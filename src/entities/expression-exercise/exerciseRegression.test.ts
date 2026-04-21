import { describe, expect, it } from 'vitest'
import { generateExercise } from './exerciseGenerator'
import { gradeAnswer } from './exerciseGrader'
import { toLatex } from './mathEngine'
import type { ExpressionExercise } from './exerciseTypes'

const visuallyCollapsedExercise: ExpressionExercise = {
  id: 'visually-collapsed',
  topic: 'remove-parentheses-with-sign',
  source: '4*z + (5*n + a)',
  target: '4*z + 5*n + a',
  difficultyBand: 1,
  difficultyScore: 8,
  features: ['split-coefficient'],
  seed: 'visual-collapse'
}

function createDeterministicRandomSource(value: number) {
  return {
    next: () => value
  }
}

describe('exercise regressions', () => {
  it('should reject exercises whose source and target render identically', () => {
    expect(toLatex(visuallyCollapsedExercise.source)).not.toBe(toLatex(visuallyCollapsedExercise.target))
  })

  it('should not generate a remove-parentheses exercise that already renders as the solved form', () => {
    const exercise = generateExercise(
      'remove-parentheses-with-sign',
      1,
      createDeterministicRandomSource(0)
    )

    expect(toLatex(exercise.source)).not.toBe(toLatex(exercise.target))
  })

  it('should not end in a copied verdict when the student only sees the target form in the UI', () => {
    expect(gradeAnswer(visuallyCollapsedExercise, 'a+5n+4z')).toEqual({
      isCorrect: true,
      reason: 'correct'
    })
  })
})
