import { wordsForLevel, wordsForTopic, type Level, type TopicId, type Word } from '../data/words'

export type QuizMode = 'listen' | 'picture'

export type Question = {
  correct: Word
  choices: Word[]
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swap]] = [next[swap], next[index]]
  }
  return next
}

export function buildQuestions(topicId: TopicId | 'all', level: Level = 3, count = 8): Question[] {
  const topicWords = wordsForTopic(topicId, level)
  const pool = wordsForLevel(level)
  const selected = shuffle(topicWords).slice(0, Math.min(count, topicWords.length))

  return selected.map((correct) => {
    const sameTopic = topicWords.filter((word) => word.id !== correct.id)
    const extras = pool.filter(
      (word) => word.id !== correct.id && !sameTopic.some((item) => item.id === word.id),
    )
    const distractors = shuffle([...sameTopic, ...extras]).slice(0, 3)
    return {
      correct,
      choices: shuffle([correct, ...distractors]),
    }
  })
}

export function explainWrong(correct: Word, picked: Word) {
  return {
    title: '記住呢個字',
    line: `你揀咗「${picked.char}」，唔啱。正確係「${correct.char}」，即係${correct.meaning}。`,
    speak: `唔係${picked.say}呀。係${correct.say}。${correct.say}。`,
  }
}

export function praiseForScore(correct: number, total: number) {
  const ratio = total === 0 ? 0 : correct / total
  if (ratio === 1) return { title: '滿分！', line: '你全部都識，好叻呀！', emoji: '🏆', pic: 'trophy' }
  if (ratio >= 0.75) return { title: '好叻呀！', line: '差唔多全中，繼續加油。', emoji: '🌟', pic: 'glowing-star' }
  if (ratio >= 0.5) return { title: '唔錯呀！', line: '再玩多次就更加叻。', emoji: '💪', pic: 'flexed-biceps' }
  return { title: '再試下啦', line: '慢慢嚟，識多幾個就得。', emoji: '🌈', pic: 'rainbow' }
}
