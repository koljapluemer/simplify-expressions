export type ExerciseKind =
  | 'combineLikeTerms'
  | 'removeParentheses'
  | 'distributeNumber'
  | 'expandProduct'
  | 'powerProduct'

export type ExpressionExercise = {
  id: string
  kind: ExerciseKind
  source: string
  target: string
}

export type GradeReason =
  | 'empty'
  | 'parseError'
  | 'notEquivalent'
  | 'copied'
  | 'tooComplex'
  | 'correct'

export type GradeResult = {
  isCorrect: boolean
  reason: GradeReason
}
