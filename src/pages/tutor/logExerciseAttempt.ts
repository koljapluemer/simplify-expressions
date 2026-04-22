import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { getLearnerId } from '@/app/storage/learnerId'
import { firestore } from '@/db/firebaseApp'
import type { ExerciseAttempt } from '@/entities/expression-exercise/exerciseTypes'

const collectionName = 'simplify-expressions-data'

export async function logExerciseAttempt(attempt: ExerciseAttempt) {
  const learnerId = getLearnerId()

  await setDoc(doc(firestore, collectionName, attempt.id), {
    learnerId,
    loggedAt: serverTimestamp(),
    timestamp: attempt.timestamp,
    exerciseAttemptId: attempt.id,
    exerciseId: attempt.exerciseId,
    topic: attempt.topic,
    difficultyBand: attempt.difficultyBand,
    difficultyScore: attempt.difficultyScore,
    features: attempt.features,
    source: attempt.source,
    target: attempt.target,
    answer: attempt.answer,
    resultReason: attempt.resultReason,
    isCorrect: attempt.isCorrect,
    latencyMs: attempt.latencyMs
  })
}
