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
  const normalizedSymbols = expression
    .replace(/−/g, '-')
    .replace(/[·⋅]/g, '*')
    .trim()

  return expandCompactProducts(markSpacedProducts(normalizedSymbols))
}

function markSpacedProducts(expression: string): string {
  return expression.replace(/([0-9A-Za-z)])\s+(?=[0-9A-Za-z(])/g, '$1*')
}

function expandCompactProducts(expression: string): string {
  return expression
    .replace(/(\d)([a-zA-Z])/g, '$1*$2')
    .replace(/([a-zA-Z])(\d)/g, '$1*$2')
    .replace(/([a-zA-Z])([a-zA-Z])/g, '$1*$2')
    .replace(/([a-zA-Z])\(/g, '$1*(')
    .replace(/\)([a-zA-Z])/g, ')*$1')
    .replace(/(\d)\(/g, '$1*(')
    .replace(/\)(\d)/g, ')*$1')
    .replace(/\)\(/g, ')*(')
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
