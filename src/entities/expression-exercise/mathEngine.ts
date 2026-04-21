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

  return insertImplicitMultiplication(tokenizeExpression(normalizedSymbols))
}

type Token =
  | { type: 'number'; value: string }
  | { type: 'symbol'; value: string }
  | { type: 'operator'; value: string }
  | { type: 'leftParen'; value: '(' }
  | { type: 'rightParen'; value: ')' }

function tokenizeExpression(expression: string): Token[] {
  const tokens: Token[] = []
  let index = 0

  while (index < expression.length) {
    const char = expression[index]
    if (!char) break

    if (/\s/.test(char)) {
      index += 1
      continue
    }

    if (/[0-9.]/.test(char)) {
      const end = findNumberEnd(expression, index)
      tokens.push({ type: 'number', value: expression.slice(index, end) })
      index = end
      continue
    }

    if (/[a-zA-Z]/.test(char)) {
      const end = findSymbolEnd(expression, index)
      for (const symbol of expression.slice(index, end)) {
        tokens.push({ type: 'symbol', value: symbol })
      }
      index = end
      continue
    }

    if (char === '(') {
      tokens.push({ type: 'leftParen', value: char })
      index += 1
      continue
    }

    if (char === ')') {
      tokens.push({ type: 'rightParen', value: char })
      index += 1
      continue
    }

    tokens.push({ type: 'operator', value: char })
    index += 1
  }

  return tokens
}

function findNumberEnd(expression: string, start: number): number {
  let index = start
  let hasDecimalPoint = false

  while (index < expression.length) {
    const char = expression[index]
    if (!char) break

    if (char === '.') {
      if (hasDecimalPoint) break
      hasDecimalPoint = true
      index += 1
      continue
    }

    if (!/[0-9]/.test(char)) break

    index += 1
  }

  return index
}

function findSymbolEnd(expression: string, start: number): number {
  let index = start

  while (index < expression.length) {
    const char = expression[index]
    if (!char || !/[a-zA-Z]/.test(char)) break
    index += 1
  }

  return index
}

function insertImplicitMultiplication(tokens: Token[]): string {
  const normalized: string[] = []

  tokens.forEach((token, index) => {
    const previousToken = tokens[index - 1]

    if (previousToken && needsImplicitMultiplication(previousToken, token)) {
      normalized.push('*')
    }

    normalized.push(token.value)
  })

  return normalized.join('')
}

function needsImplicitMultiplication(left: Token, right: Token): boolean {
  return canEndFactor(left) && canStartFactor(right)
}

function canEndFactor(token: Token): boolean {
  return token.type === 'number' || token.type === 'symbol' || token.type === 'rightParen'
}

function canStartFactor(token: Token): boolean {
  return token.type === 'number' || token.type === 'symbol' || token.type === 'leftParen'
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
