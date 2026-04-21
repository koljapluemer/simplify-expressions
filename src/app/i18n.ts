import { createI18n } from 'vue-i18n'
import { getStoredLocale, setStoredLocale, type AppLocale } from './storage/selectedLocale'

const messages = {
  de: {
    app: {
      title: 'Termtrainer',
      practice: 'Üben',
      language: 'Sprache'
    },
    tutor: {
      title: 'Terme vereinfachen',
      intro: 'Vereinfache den Term so weit wie möglich.',
      exerciseLabel: 'Aufgabe',
      answerLabel: 'Deine Antwort',
      answerPlaceholder: 'Vereinfachten Term eingeben',
      check: 'Prüfen',
      giveUp: 'Aufgeben & Lösung zeigen',
      next: 'Nächste Aufgabe',
      feedback: {
        idle: 'Vereinfache den Term.',
        revealed: 'Eine mögliche Lösung:',
        empty: 'Gib zuerst eine Antwort ein.',
        parseError: 'Ich kann diese Eingabe noch nicht lesen.',
        notEquivalent: 'Der Term ist nicht gleichwertig.',
        copied: 'Der Term ist gleichwertig, aber noch nicht vereinfacht.',
        tooComplex: 'Das ist richtig, aber noch nicht einfach genug.',
        correct: 'Richtig. Eine mögliche Lösung:'
      },
      examples: {
        combineLikeTerms: 'Gleichartige Terme zusammenfassen',
        removeParentheses: 'Klammern auflösen',
        distributeNumber: 'Ausmultiplizieren',
        expandProduct: 'Produkte ausmultiplizieren',
        powerProduct: 'Potenzen in Produkten kürzen'
      }
    },
    locale: {
      de: 'Deutsch',
      en: 'English'
    }
  },
  en: {
    app: {
      title: 'Expression Tutor',
      practice: 'Practice',
      language: 'Language'
    },
    tutor: {
      title: 'Simplify expressions',
      intro: 'Simplify the expression as far as possible.',
      exerciseLabel: 'Exercise',
      answerLabel: 'Your answer',
      answerPlaceholder: 'Enter the simplified expression',
      check: 'Check',
      giveUp: 'Give up & Show Solution',
      next: 'Next exercise',
      feedback: {
        idle: 'Simplify the expression.',
        revealed: 'One possible answer:',
        empty: 'Enter an answer first.',
        parseError: 'I cannot read that input yet.',
        notEquivalent: 'The expression is not equivalent.',
        copied: 'The expression is equivalent, but not simplified yet.',
        tooComplex: 'That is correct, but not simple enough yet.',
        correct: 'Correct. One possible answer:'
      },
      examples: {
        combineLikeTerms: 'Combine like terms',
        removeParentheses: 'Remove parentheses',
        distributeNumber: 'Distribute numbers',
        expandProduct: 'Expand products',
        powerProduct: 'Simplify powers in products'
      }
    },
    locale: {
      de: 'Deutsch',
      en: 'English'
    }
  }
} as const

export const i18n = createI18n({
  legacy: false,
  locale: getStoredLocale(),
  fallbackLocale: 'de',
  messages
})

export function setAppLocale(locale: AppLocale) {
  i18n.global.locale.value = locale
  setStoredLocale(locale)
  document.documentElement.lang = locale
}

document.documentElement.lang = getStoredLocale()

export type MessageSchema = typeof messages.de
