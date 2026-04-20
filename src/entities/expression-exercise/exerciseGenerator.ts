import type { ExpressionExercise } from './exerciseTypes'
import { pickRandom } from '@/dumb/random'

type ExerciseTemplate = Omit<ExpressionExercise, 'id'>

const templates: [ExerciseTemplate, ...ExerciseTemplate[]] = [
  {
    kind: 'combineLikeTerms',
    source: '3*x + 5*x - 7*x',
    target: 'x'
  },
  {
    kind: 'powerProduct',
    source: '2*x*y - 5*x*y*y',
    target: '2*x*y - 5*x*y^2'
  },
  {
    kind: 'removeParentheses',
    source: '3*a - (2*b - c)',
    target: '3*a - 2*b + c'
  },
  {
    kind: 'distributeNumber',
    source: '5 * (5 + 3*a*b)',
    target: '25 + 15*a*b'
  },
  {
    kind: 'expandProduct',
    source: '(a + b) * (c + 2*b)',
    target: 'a*c + 2*a*b + b*c + 2*b^2'
  },
  {
    kind: 'combineLikeTerms',
    source: '4*a + 7*a - 2*a',
    target: '9*a'
  },
  {
    kind: 'removeParentheses',
    source: '8*x - (3*x + 2)',
    target: '5*x - 2'
  },
  {
    kind: 'distributeNumber',
    source: '3 * (2*x - 4*y)',
    target: '6*x - 12*y'
  },
  {
    kind: 'expandProduct',
    source: '(x + 3) * (x - 2)',
    target: 'x^2 + x - 6'
  }
]

export function generateExercise(previousId?: string): ExpressionExercise {
  const candidates = templates.filter((template) => getTemplateId(template) !== previousId)
  const template = pickRandom(candidates) ?? templates[0]

  return {
    ...template,
    id: getTemplateId(template)
  }
}

function getTemplateId(template: ExerciseTemplate): string {
  return `${template.kind}:${template.source}`
}
