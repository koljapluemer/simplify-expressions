import { describe, expect, it } from 'vitest'
import { isEquivalent, normalizeExpression, parseExpression } from './mathEngine'

describe('normalizeExpression', () => {
  it.each([
    ['3ab', '3*a*b'],
    ['25+15⋅a⋅b', '25+15*a*b'],
    ['2(a+b)', '2*(a+b)'],
    ['(a+b)(c+2b)', '(a+b)*(c+2*b)'],
    ['a2', 'a*2'],
    ['1.5ab', '1.5*a*b'],
    ['−3ab', '-3*a*b'],
    ['a b', 'a*b'],
    ['2x y', '2*x*y'],
    ['2(a+b)c', '2*(a+b)*c']
  ])('normalizes %s as %s', (input, expected) => {
    expect(normalizeExpression(input)).toBe(expected)
  })
})

describe('parseExpression', () => {
  it.each([
    ['3ab', '3 * a * b'],
    ['25+15ab', '25 + 15 * a * b'],
    ['2(a+b)c', '2 * (a + b) * c'],
    ['(a+b)(c+2b)', '(a + b) * (c + 2 * b)'],
    ['1.5ab', '1.5 * a * b'],
    ['2a^2b', '2 * a ^ 2 * b']
  ])('parses %s as %s', (input, expected) => {
    expect(parseExpression(input).toString()).toBe(expected)
  })
})

describe('isEquivalent', () => {
  it('treats compact and explicit products as equal', () => {
    expect(isEquivalent('25+15⋅a⋅b', '25+15ab')).toBe(true)
  })

  it('treats adjacent parenthesized products and explicit multiplication as equal', () => {
    expect(isEquivalent('(a+b)(c+2b)', '(a+b)*(c+2*b)')).toBe(true)
  })

  it('treats spaced and compact implicit products as equal', () => {
    expect(isEquivalent('3ab', '3 a b')).toBe(true)
  })
})
