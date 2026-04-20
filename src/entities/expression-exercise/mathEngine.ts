import { all, create, type MathNode } from 'mathjs'

export const math = create(all ?? {})

export function parseExpression(expression: string): MathNode {
  return math.parse(normalizeExpression(expression))
}

export function toLatex(expression: string): string {
  return parseExpression(expression).toTex({
    parenthesis: 'keep',
    implicit: 'hide'
  })
}

export function normalizeExpression(expression: string): string {
  return expression
    .replace(/−/g, '-')
    .replace(/·/g, '*')
    .trim()
}

export function isEquivalent(left: string, right: string): boolean {
  try {
    return math.symbolicEqual(parseExpression(left), parseExpression(right))
  } catch {
    return false
  }
}

export function expressionComplexity(expression: string): number {
  const node = parseExpression(expression)
  return scoreNode(node)
}

function scoreNode(node: MathNode): number {
  let score = baseScore(node)

  node.forEach((child) => {
    score += scoreNode(child)
  })

  return score
}

function baseScore(node: MathNode): number {
  if (math.isOperatorNode(node)) {
    return operatorScore(node.op)
  }

  if (math.isSymbolNode(node)) return 1
  if (math.isConstantNode(node)) return 1

  return 2
}

function operatorScore(operator: string): number {
  if (operator === '+' || operator === '*') return 3
  if (operator === '-') return 4
  if (operator === '/') return 5
  if (operator === '^') return 4

  return 4
}
