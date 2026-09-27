let unlocked = false

function pickCantoneseVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  const ranked = [
    (voice: SpeechSynthesisVoice) => voice.lang.toLowerCase() === 'zh-hk',
    (voice: SpeechSynthesisVoice) => voice.lang.toLowerCase().startsWith('zh-hk'),
    (voice: SpeechSynthesisVoice) => /hong kong|yue|cantonese|sinji|meijia/i.test(`${voice.name} ${voice.lang}`),
    (voice: SpeechSynthesisVoice) => voice.lang.toLowerCase() === 'zh-tw',
    (voice: SpeechSynthesisVoice) => voice.lang.toLowerCase().startsWith('zh'),
  ]

  for (const match of ranked) {
    const voice = voices.find(match)
    if (voice) return voice
  }
  return undefined
}

export function unlockSpeech() {
  if (unlocked || typeof window === 'undefined' || !window.speechSynthesis) return
  unlocked = true
  const warmup = new SpeechSynthesisUtterance(' ')
  warmup.volume = 0
  window.speechSynthesis.speak(warmup)
  window.speechSynthesis.cancel()
}

export function speak(text: string, rate = 0.88) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-HK'
  utterance.rate = rate
  utterance.pitch = 1.05
  const voice = pickCantoneseVoice()
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    pickCantoneseVoice()
  })
}
