import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { getLearnerId } from '@/app/storage/learnerId'
import { firestore } from '@/db/firebaseApp'
import type { AppLocale } from '@/app/storage/selectedLocale'

const collectionName = 'simplify-expressions-feedback'

export async function submitFeedback(input: {
  helpfulForLearning: string
  improveUsefulness: string
  anythingElse: string
  website: string
  locale: AppLocale
}) {
  if (input.website.trim().length > 0) {
    return
  }

  await addDoc(collection(firestore, collectionName), {
    learnerId: getLearnerId(),
    submittedAt: serverTimestamp(),
    locale: input.locale,
    helpfulForLearning: input.helpfulForLearning.trim(),
    improveUsefulness: input.improveUsefulness.trim(),
    anythingElse: input.anythingElse.trim()
  })
}
