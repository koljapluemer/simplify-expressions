import { describe, expect, it } from 'vitest'
import { gradeAnswer } from './exerciseGrader'
import type { ExpressionExercise } from './exerciseTypes'

const distributeExercise: ExpressionExercise = {
  id: 'distribute',
  kind: 'distributeNumber',
  source: '5 * (5 + 3*a*b)',
  target: '25 + 15*a*b'
}

const parenthesesExercise: ExpressionExercise = {
  id: 'parentheses',
  kind: 'distributeNumber',
  source: '3 * (2*x - 4*y)',
  target: '6*x - 12*y'
}

describe('gradeAnswer', () => {
  it.each([
    ['25+15ab'],
    ['25+15⋅a⋅b'],
    ['25 + 15 a b']
  ])('accepts distributed answers written as %s', (answer) => {
    expect(gradeAnswer(distributeExercise, answer)).toEqual({
      isCorrect: true,
      reason: 'correct'
    })
  })

  it('accepts simplified answers that stay equivalent to the original task', () => {
    expect(gradeAnswer(parenthesesExercise, '6x-12y')).toEqual({
      isCorrect: true,
      reason: 'correct'
    })
  })

  it('rejects an unchanged answer even if written with different spacing', () => {
    expect(gradeAnswer(parenthesesExercise, '3(2x-4y)')).toEqual({
      isCorrect: false,
      reason: 'copied'
    })
  })
})
