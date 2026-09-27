import { useEffect, useMemo, useRef, useState } from 'react'
import mascot from './assets/mascot.png'
import { CutePic } from './components/CutePic'
import { Hanzi } from './components/Hanzi'
import { topicById, topics, words, wordsForTopic, type TopicId, type Word } from './data/words'
import { addStars, loadProgress, markKnown, setShowJyutping } from './lib/progress'
import { buildQuestions, praiseForScore, type QuizMode } from './lib/quiz'
import { speak, unlockSpeech } from './lib/speech'

const choiceTones = ['peach', 'mint', 'sun', 'sky'] as const

type View =
  | { name: 'home' }
  | { name: 'topics' }
  | { name: 'modes'; topicId: TopicId | 'all' }
  | { name: 'study'; topicId: TopicId | 'all' }
  | { name: 'quiz'; topicId: TopicId | 'all'; mode: QuizMode }
  | { name: 'result'; topicId: TopicId | 'all'; mode: QuizMode; correct: number; total: number }

export default function App() {
  const [view, setView] = useState<View>({ name: 'home' })
  const [progress, setProgress] = useState(() => loadProgress())
  const [helpOpen, setHelpOpen] = useState(false)

  useEffect(() => {
    const refresh = () => setProgress(loadProgress())
    window.addEventListener('storage', refresh)
    return () => window.removeEventListener('storage', refresh)
  }, [])

  const start = () => {
    unlockSpeech()
    setView({ name: 'topics' })
  }

  return (
    <div className="app">
      <div className="confetti" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      {view.name === 'home' && (
        <HomeScreen
          known={progress.knownIds.length}
          stars={progress.stars}
          showJyutping={progress.showJyutping}
          onToggleJyutping={() => setProgress(setShowJyutping(!progress.showJyutping))}
          onStart={start}
          onHelp={() => setHelpOpen(true)}
        />
      )}
      {view.name === 'topics' && (
        <TopicScreen
          knownIds={progress.knownIds}
          onBack={() => setView({ name: 'home' })}
          onPick={(topicId) => setView({ name: 'modes', topicId })}
        />
      )}
      {view.name === 'modes' && (
        <ModeScreen
          topicId={view.topicId}
          onBack={() => setView({ name: 'topics' })}
          onStudy={() => setView({ name: 'study', topicId: view.topicId })}
          onQuiz={(mode) => setView({ name: 'quiz', topicId: view.topicId, mode })}
        />
      )}
      {view.name === 'study' && (
        <StudyScreen
          topicId={view.topicId}
          showJyutping={progress.showJyutping}
          onBack={() => setView({ name: 'modes', topicId: view.topicId })}
          onKnown={(id) => setProgress(markKnown([id]))}
        />
      )}
      {view.name === 'quiz' && (
        <QuizScreen
          topicId={view.topicId}
          mode={view.mode}
          showJyutping={progress.showJyutping}
          onExit={() => setView({ name: 'modes', topicId: view.topicId })}
          onDone={(correct, total, knownIds) => {
            setProgress(markKnown(knownIds))
            setProgress(addStars(correct))
            setView({
              name: 'result',
              topicId: view.topicId,
              mode: view.mode,
              correct,
              total,
            })
          }}
        />
      )}
      {view.name === 'result' && (
        <ResultScreen
          correct={view.correct}
          total={view.total}
          onHome={() => setView({ name: 'home' })}
          onAgain={() => setView({ name: 'quiz', topicId: view.topicId, mode: view.mode })}
          onTopics={() => setView({ name: 'topics' })}
        />
      )}
      {helpOpen && <HelpOverlay onClose={() => setHelpOpen(false)} />}
    </div>
  )
}

function HomeScreen({
  known,
  stars,
  showJyutping,
  onToggleJyutping,
  onStart,
  onHelp,
}: {
  known: number
  stars: number
  showJyutping: boolean
  onToggleJyutping: () => void
  onStart: () => void
  onHelp: () => void
}) {
  return (
    <section className="screen home">
      <header className="brand">
        <p className="eyebrow">香港幼稚園 K3</p>
        <h1>字字樂</h1>
        <p className="tagline">用廣東話聽、用繁體字認，識字好好玩。</p>
      </header>
      <div className="hero-card">
        <img className="hero-mascot" src={mascot} alt="字字樂吉祥物" />
        <div className="hero-copy">
          <Hanzi char="字" size="md" tone="sun" />
          <strong>{words.length} 個常用字</strong>
          <span>家庭、動物、食物、天地……專為香港 K3 細路揀。</span>
        </div>
      </div>
      <div className="stats">
        <div className="stat tone-peach">
          <b>{known}</b>
          <span>識咗嘅字</span>
        </div>
        <div className="stat tone-sun">
          <b>{stars}</b>
          <span>累積星星</span>
        </div>
      </div>
      <button className="btn primary xl" type="button" onClick={onStart}>
        開始認字
      </button>
      <div className="home-row">
        <button className="btn ghost" type="button" onClick={onHelp}>
          點樣玩
        </button>
        <button className="btn ghost" type="button" onClick={onToggleJyutping}>
          拼音 {showJyutping ? '開' : '關'}
        </button>
      </div>
    </section>
  )
}

function TopicScreen({
  knownIds,
  onBack,
  onPick,
}: {
  knownIds: string[]
  onBack: () => void
  onPick: (topicId: TopicId | 'all') => void
}) {
  return (
    <section className="screen">
      <TopBar title="揀課題" onBack={onBack} />
      <button className="topic-card all tone-grape" type="button" onClick={() => onPick('all')}>
        <CutePic name="game-die" emoji="🎲" label="全部字" className="topic-pic" />
        <span>
          <strong>全部字</strong>
          <small>隨機挑戰 {words.length} 個字</small>
        </span>
      </button>
      <div className="topic-grid">
        {topics.map((topic) => {
          const list = wordsForTopic(topic.id)
          const known = list.filter((word) => knownIds.includes(word.id)).length
          return (
            <button
              key={topic.id}
              className={`topic-card tone-${topic.tone}`}
              type="button"
              onClick={() => onPick(topic.id)}
            >
              <CutePic name={topic.pic} emoji={topic.emoji} label={topic.name} className="topic-pic" />
              <strong>{topic.name}</strong>
              <small>
                {topic.hint} · {known}/{list.length}
              </small>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function ModeScreen({
  topicId,
  onBack,
  onStudy,
  onQuiz,
}: {
  topicId: TopicId | 'all'
  onBack: () => void
  onStudy: () => void
  onQuiz: (mode: QuizMode) => void
}) {
  const title = topicId === 'all' ? '全部字' : topicById(topicId).name
  const count = wordsForTopic(topicId).length
  return (
    <section className="screen">
      <TopBar title={title} onBack={onBack} />
      <p className="lead">呢個課題有 {count} 個字，你想點玩？</p>
      <button className="mode-card tone-sky" type="button" onClick={() => onQuiz('listen')}>
        <CutePic name="speaker-high-volume" emoji="🔊" label="聽音認字" className="mode-pic" />
        <span>
          <strong>聽音認字</strong>
          <small>聽廣東話，揀返啱嗰個字</small>
        </span>
      </button>
      <button className="mode-card tone-mint" type="button" onClick={() => onQuiz('picture')}>
        <CutePic name="framed-picture" emoji="🖼️" label="睇圖認字" className="mode-pic" />
        <span>
          <strong>睇圖認字</strong>
          <small>睇圖同意思，再揀漢字</small>
        </span>
      </button>
      <button className="mode-card tone-sun" type="button" onClick={onStudy}>
        <CutePic name="bookmark-tabs" emoji="🃏" label="認讀卡" className="mode-pic" />
        <span>
          <strong>認讀卡</strong>
          <small>慢慢睇字、聽音、記拼音</small>
        </span>
      </button>
    </section>
  )
}

function StudyScreen({
  topicId,
  showJyutping,
  onBack,
  onKnown,
}: {
  topicId: TopicId | 'all'
  showJyutping: boolean
  onBack: () => void
  onKnown: (id: string) => void
}) {
  const cards = useMemo(() => wordsForTopic(topicId), [topicId])
  const [index, setIndex] = useState(0)
  const word = cards[index]

  useEffect(() => {
    if (word) speak(word.say)
  }, [word])

  if (!word) return null

  const prev = () => setIndex((value) => Math.max(0, value - 1))
  const next = () => {
    onKnown(word.id)
    if (index === cards.length - 1) {
      onBack()
      return
    }
    setIndex((value) => value + 1)
  }

  return (
    <section className="screen">
      <TopBar title="認讀卡" onBack={onBack} meta={`${index + 1} / ${cards.length}`} />
      <button className="flash-card" type="button" onClick={() => speak(word.say)}>
        <CutePic name={word.pic} emoji={word.emoji} label={word.meaning} className="flash-pic" />
        <Hanzi char={word.char} size="xl" tone="cream" />
        {showJyutping && <span className="flash-jyutping">{word.jyutping}</span>}
        <span className="flash-meaning">{word.meaning}</span>
        <span className="flash-hint">撳一下聽廣東話</span>
      </button>
      <div className="pager">
        <button className="btn ghost" type="button" onClick={prev} disabled={index === 0}>
          上一張
        </button>
        <button className="btn primary" type="button" onClick={next}>
          {index === cards.length - 1 ? '學完啦' : '下一張'}
        </button>
      </div>
    </section>
  )
}

function QuizScreen({
  topicId,
  mode,
  showJyutping,
  onExit,
  onDone,
}: {
  topicId: TopicId | 'all'
  mode: QuizMode
  showJyutping: boolean
  onExit: () => void
  onDone: (correct: number, total: number, knownIds: string[]) => void
}) {
  const questions = useMemo(() => buildQuestions(topicId), [topicId])
  const [index, setIndex] = useState(0)
  const [locked, setLocked] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [known, setKnown] = useState<string[]>([])
  const timer = useRef<number | null>(null)
  const question = questions[index]

  useEffect(() => {
    if (question && mode === 'listen') speak(question.correct.say)
  }, [question, mode])

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  if (!question) return null

  const choose = (word: Word) => {
    if (locked) return
    setPicked(word.id)
    setLocked(true)
    const right = word.id === question.correct.id
    const nextScore = score + (right ? 1 : 0)
    const nextKnown = right ? [...known, question.correct.id] : known
    if (right) {
      setScore(nextScore)
      setKnown(nextKnown)
      speak('好叻呀')
    } else {
      speak('再試下')
    }
    timer.current = window.setTimeout(() => {
      const nextIndex = index + 1
      if (nextIndex >= questions.length) {
        onDone(nextScore, questions.length, nextKnown)
        return
      }
      setIndex(nextIndex)
      setLocked(false)
      setPicked(null)
    }, 1100)
  }

  return (
    <section className="screen quiz">
      <TopBar
        title={mode === 'listen' ? '聽音認字' : '睇圖認字'}
        onBack={onExit}
        meta={`${index + 1} / ${questions.length}`}
      />
      <div className="prompt">
        {mode === 'listen' ? (
          <button className="speaker" type="button" onClick={() => speak(question.correct.say)}>
            <CutePic name="speaker-high-volume" emoji="🔊" label="聽" className="speaker-pic" />
            <strong>聽下係邊個字</strong>
            <small>撳喇叭再聽一次</small>
          </button>
        ) : (
          <div className="picture-prompt">
            <CutePic
              name={question.correct.pic}
              emoji={question.correct.emoji}
              label={question.correct.meaning}
              className="picture-pic"
            />
            <strong>{question.correct.meaning}</strong>
            {showJyutping && <small>{question.correct.jyutping}</small>}
          </div>
        )}
      </div>
      <div className="choices">
        {question.choices.map((word, choiceIndex) => {
          const state =
            picked && word.id === question.correct.id
              ? 'right'
              : picked === word.id
                ? 'wrong'
                : ''
          return (
            <button
              key={word.id}
              className={`choice ${state}`}
              type="button"
              onClick={() => choose(word)}
              disabled={locked}
            >
              <Hanzi char={word.char} size="lg" tone={choiceTones[choiceIndex % choiceTones.length]} />
            </button>
          )
        })}
      </div>
    </section>
  )
}

function ResultScreen({
  correct,
  total,
  onHome,
  onAgain,
  onTopics,
}: {
  correct: number
  total: number
  onHome: () => void
  onAgain: () => void
  onTopics: () => void
}) {
  const praise = praiseForScore(correct, total)
  useEffect(() => {
    speak(praise.line)
  }, [praise.line])

  return (
    <section className="screen result">
      <CutePic name={praise.pic} emoji={praise.emoji} label={praise.title} className="result-pic" />
      <h2>{praise.title}</h2>
      <p className="lead">{praise.line}</p>
      <div className="score-pill">
        今次答中 <b>{correct}</b> / {total}
      </div>
      <button className="btn primary xl" type="button" onClick={onAgain}>
        再玩一次
      </button>
      <div className="home-row">
        <button className="btn ghost" type="button" onClick={onTopics}>
          換課題
        </button>
        <button className="btn ghost" type="button" onClick={onHome}>
          返屋企
        </button>
      </div>
    </section>
  )
}

function TopBar({
  title,
  meta,
  onBack,
}: {
  title: string
  meta?: string
  onBack: () => void
}) {
  return (
    <header className="topbar">
      <button className="back" type="button" onClick={onBack} aria-label="返回">
        ←
      </button>
      <h2>{title}</h2>
      <span className="meta">{meta ?? ''}</span>
    </header>
  )
}

function HelpOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="overlay" role="dialog" aria-label="點樣玩">
      <div className="overlay-card">
        <h3>點樣玩</h3>
        <ol>
          <li>先揀一個課題，例如家庭或者動物。</li>
          <li>「聽音認字」會用廣東話讀出嚟，你再揀漢字。</li>
          <li>「睇圖認字」睇圖同意思，再揀啱嗰個字。</li>
          <li>「認讀卡」可以慢慢學，撳卡就聽到讀音。</li>
        </ol>
        <p>字係香港常用繁體字，讀音用廣東話。大人可以開拼音一齊睇。</p>
        <button className="btn primary" type="button" onClick={onClose}>
          知喇
        </button>
      </div>
    </div>
  )
}
