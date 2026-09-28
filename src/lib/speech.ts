let playTimer = 0
let resumeTimer = 0

function isCantoneseVoice(voice: SpeechSynthesisVoice) {
  const tag = `${voice.name} ${voice.lang}`.toLowerCase()
  if (/zh-cn|cmn|mandarin|putonghua|國語|普通话/.test(tag)) return false
  return (
    tag.includes('zh-hk') ||
    tag.includes('hong kong') ||
    tag.includes('cantonese') ||
    tag.includes('yue') ||
    tag.includes('sinji') ||
    tag.includes('sin-ji') ||
    tag.includes('meijia') ||
    tag.includes('mei-jia')
  )
}

function pickCantoneseVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((voice) => voice.lang.toLowerCase() === 'zh-hk') ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith('zh-hk')) ||
    voices.find(isCantoneseVoice)
  )
}

function play(text: string, rate: number) {
  const synth = window.speechSynthesis
  if (synth.paused) synth.resume()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-HK'
  utterance.rate = rate
  utterance.pitch = 1.05
  const voice = pickCantoneseVoice()
  if (voice) utterance.voice = voice
  synth.speak(utterance)
  window.clearInterval(resumeTimer)
  resumeTimer = window.setInterval(() => {
    if (synth.speaking && synth.paused) synth.resume()
    if (!synth.speaking) window.clearInterval(resumeTimer)
  }, 250)
}

export function unlockSpeech() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.getVoices()
  if (window.speechSynthesis.paused) window.speechSynthesis.resume()
}

export function speak(text: string, rate = 0.86) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text.trim()) return
  unlockSpeech()
  window.clearTimeout(playTimer)
  window.speechSynthesis.cancel()
  playTimer = window.setTimeout(() => play(text, rate), 80)
}

export function speakWord(text: string) {
  speak(text, 0.74)
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    pickCantoneseVoice()
  })
}
