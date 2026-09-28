import { useEffect, useMemo, useRef, useState } from 'react'
import mascot from './assets/mascot.png'
import { CutePic } from './components/CutePic'
import { Hanzi } from './components/Hanzi'
import { topicById, topicHint, topicsForLevel, wordsForLevel, wordsForTopic, type Level, type TopicId, type Word } from './data/words'
import { addStars, knownCount, loadProgress, markKnown, setLevel, setShowJyutping } from './lib/progress'
import { buildQuestions, explainWrong, praiseForScore, type QuizMode } from './lib/quiz'
import { speak, speakWord, unlockSpeech } from './lib/speech'

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
          knownIds={progress.knownIds}
          stars={progress.stars}
          showJyutping={progress.showJyutping}
          onToggleJyutping={() => setProgress(setShowJyutping(!progress.showJyutping))}
          onPickLevel={(level) => {
            setProgress(setLevel(level))
            start()
          }}
          onHelp={() => setHelpOpen(true)}
        />
      )}
      {view.name === 'topics' && (
        <TopicScreen
          level={progress.level}
          knownIds={progress.knownIds}
          onBack={() => setView({ name: 'home' })}
          onPick={(topicId) => setView({ name: 'modes', topicId })}
        />
      )}
      {view.name === 'modes' && (
        <ModeScreen
          level={progress.level}
          topicId={view.topicId}
          onBack={() => setView({ name: 'topics' })}
          onStudy={() => setView({ name: 'study', topicId: view.topicId })}
          onQuiz={(mode) => setView({ name: 'quiz', topicId: view.topicId, mode })}
        />
      )}
      {view.name === 'study' && (
        <StudyScreen
          level={progress.level}
          topicId={view.topicId}
          showJyutping={progress.showJyutping}
          onBack={() => setView({ name: 'modes', topicId: view.topicId })}
          onKnown={(id) => setProgress(markKnown([id]))}
        />
      )}
      {view.name === 'quiz' && (
        <QuizScreen
          level={progress.level}
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
  knownIds,
  stars,
  showJyutping,
  onToggleJyutping,
  onPickLevel,
  onHelp,
}: {
  knownIds: string[]
  stars: number
  showJyutping: boolean
  onToggleJyutping: () => void
  onPickLevel: (level: Level) => void
  onHelp: () => void
}) {
  const k2 = wordsForLevel(2)
  const k3 = wordsForLevel(3)
  return (
    <section className="screen home">
      <header className="brand">
        <p className="eyebrow">香港幼稚園</p>
        <h1>字字樂</h1>
        <p className="tagline">用廣東話聽、用繁體字認，識字好好玩。</p>
      </header>
      <div className="hero-card">
        <img className="hero-mascot" src={mascot} alt="字字樂吉祥物" />
        <div className="hero-copy">
          <Hanzi char="字" size="md" tone="sun" />
          <strong>K2 低班 · K3 高班</strong>
          <span>家庭、動物、食物、天地……專為香港幼稚園細路揀。</span>
        </div>
      </div>
      <div className="stats">
        <div className="stat tone-peach">
          <b>{knownCount(3, knownIds)}</b>
          <span>識咗嘅字</span>
        </div>
        <div className="stat tone-sun">
          <b>{stars}</b>
          <span>累積星星</span>
        </div>
      </div>
      <div className="class-pick">
        <button className="class-card tone-mint" type="button" onClick={() => onPickLevel(2)}>
          <strong>K2 低班</strong>
          <small>淺字慢慢嚟 · {k2.length} 個字</small>
          <span>識咗 {knownCount(2, knownIds)} 個</span>
        </button>
        <button className="class-card tone-sky" type="button" onClick={() => onPickLevel(3)}>
          <strong>K3 高班</strong>
          <small>多啲常用字 · {k3.length} 個字</small>
          <span>識咗 {knownCount(3, knownIds)} 個</span>
        </button>
      </div>
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
  level,
  knownIds,
  onBack,
  onPick,
}: {
  level: Level
  knownIds: string[]
  onBack: () => void
  onPick: (topicId: TopicId | 'all') => void
}) {
  const all = wordsForTopic('all', level)
  return (
    <section className="screen">
      <TopBar title={level === 2 ? 'K2 揀課題' : 'K3 揀課題'} onBack={onBack} />
      <button className="topic-card all tone-grape" type="button" onClick={() => onPick('all')}>
        <CutePic name="game-die" emoji="🎲" label="全部字" className="topic-pic" />
        <span>
          <strong>全部字</strong>
          <small>隨機挑戰 {all.length} 個字</small>
        </span>
      </button>
      <div className="topic-grid">
        {topicsForLevel(level).map((topic) => {
          const list = wordsForTopic(topic.id, level)
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
                {topicHint(topic, level)} · {known}/{list.length}
              </small>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function ModeScreen({
  level,
  topicId,
  onBack,
  onStudy,
  onQuiz,
}: {
  level: Level
  topicId: TopicId | 'all'
  onBack: () => void
  onStudy: () => void
  onQuiz: (mode: QuizMode) => void
}) {
  const title = topicId === 'all' ? '全部字' : topicById(topicId).name
  const count = wordsForTopic(topicId, level).length
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
      <button
        className="mode-card tone-sun"
        type="button"
        onClick={() => {
          const first = wordsForTopic(topicId, level)[0]
          unlockSpeech()
          if (first) speakWord(first.say)
          onStudy()
        }}
      >
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
  level,
  topicId,
  showJyutping,
  onBack,
  onKnown,
}: {
  level: Level
  topicId: TopicId | 'all'
  showJyutping: boolean
  onBack: () => void
  onKnown: (id: string) => void
}) {
  const cards = useMemo(() => wordsForTopic(topicId, level), [topicId, level])
  const [index, setIndex] = useState(0)
  const word = cards[index]

  if (!word) return null

  const hear = () => {
    unlockSpeech()
    speakWord(word.say)
  }

  const prev = () => {
    const nextIndex = Math.max(0, index - 1)
    setIndex(nextIndex)
    const prevWord = cards[nextIndex]
    if (prevWord) speakWord(prevWord.say)
  }

  const next = () => {
    onKnown(word.id)
    if (index === cards.length - 1) {
      onBack()
      return
    }
    const nextIndex = index + 1
    setIndex(nextIndex)
    const nextWord = cards[nextIndex]
    if (nextWord) speakWord(nextWord.say)
  }

  return (
    <section className="screen">
      <TopBar title="認讀卡" onBack={onBack} meta={`${index + 1} / ${cards.length}`} />
      <div className="flash-card">
        <CutePic name={word.pic} emoji={word.emoji} label={word.meaning} className="flash-pic" />
        <Hanzi char={word.char} size="xl" tone="cream" />
        {showJyutping && <span className="flash-jyutping">{word.jyutping}</span>}
        <span className="flash-meaning">{word.meaning}</span>
        <button className="btn listen xl" type="button" onClick={hear}>
          🔊 聽「{word.char}」
        </button>
      </div>
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
  level,
  topicId,
  mode,
  showJyutping,
  onExit,
  onDone,
}: {
  level: Level
  topicId: TopicId | 'all'
  mode: QuizMode
  showJyutping: boolean
  onExit: () => void
  onDone: (correct: number, total: number, knownIds: string[]) => void
}) {
  const questions = useMemo(
    () => buildQuestions(topicId, level, level === 2 ? 6 : 8),
    [topicId, level],
  )
  const [index, setIndex] = useState(0)
  const [locked, setLocked] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [known, setKnown] = useState<string[]>([])
  const [lesson, setLesson] = useState<{ correct: Word; picked: Word } | null>(null)
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

  const goNext = (nextScore: number, nextKnown: string[]) => {
    const nextIndex = index + 1
    if (nextIndex >= questions.length) {
      onDone(nextScore, questions.length, nextKnown)
      return
    }
    setIndex(nextIndex)
    setLocked(false)
    setPicked(null)
    setLesson(null)
  }

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
      speak(`好叻呀。${question.correct.say}。`)
      timer.current = window.setTimeout(() => goNext(nextScore, nextKnown), 1100)
      return
    }
    setLesson({ correct: question.correct, picked: word })
    speak(explainWrong(question.correct, word).speak)
  }

  if (lesson) {
    return (
      <TeachScreen
        correct={lesson.correct}
        picked={lesson.picked}
        showJyutping={showJyutping}
        progress={`${index + 1} / ${questions.length}`}
        onExit={onExit}
        onContinue={() => goNext(score, known)}
      />
    )
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
          <button className="speaker" type="button" onClick={() => speakWord(question.correct.say)}>
            <CutePic name="speaker-high-volume" emoji="🔊" label="聽" className="speaker-pic" />
            <strong>聽下係邊個字</strong>
            <small>撳喇叭再聽一次</small>
          </button>
        ) : (
          <button className="picture-prompt" type="button" onClick={() => speakWord(question.correct.say)}>
            <CutePic
              name={question.correct.pic}
              emoji={question.correct.emoji}
              label={question.correct.meaning}
              className="picture-pic"
            />
            <strong>{question.correct.meaning}</strong>
            {showJyutping && <small>{question.correct.jyutping}</small>}
            <span className="listen-chip">🔊 聽呢個字</span>
          </button>
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

function TeachScreen({
  correct,
  picked,
  showJyutping,
  progress,
  onExit,
  onContinue,
}: {
  correct: Word
  picked: Word
  showJyutping: boolean
  progress: string
  onExit: () => void
  onContinue: () => void
}) {
  const tip = explainWrong(correct, picked)
  return (
    <section className="screen teach-screen">
      <TopBar title="記住呢個字" onBack={onExit} meta={progress} />
      <p className="teach-kicker">你揀咗「{picked.char}」，唔啱</p>
      <div className="teach-card">
        <CutePic name={correct.pic} emoji={correct.emoji} label={correct.meaning} className="teach-pic" />
        <Hanzi char={correct.char} size="xl" tone="cream" />
        <strong className="flash-meaning">{correct.meaning}</strong>
        {showJyutping && <span className="flash-jyutping">{correct.jyutping}</span>}
        <p className="teach-line">{tip.line}</p>
      </div>
      <button className="btn listen xl" type="button" onClick={() => speakWord(correct.say)}>
        🔊 聽「{correct.char}」
      </button>
      <button className="btn primary xl" type="button" onClick={onContinue}>
        記住喇
      </button>
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
          <li>先揀 K2 低班或者 K3 高班，再揀課題。</li>
          <li>「聽音認字」會用廣東話讀出嚟，你再揀漢字。</li>
          <li>「睇圖認字」睇圖同意思，再揀啱嗰個字。</li>
          <li>「認讀卡」可以慢慢學，撳卡就聽到讀音。</li>
          <li>答錯會解釋正確嗰個字，可以撳喇叭再聽一次。</li>
        </ol>
        <p>字係香港常用繁體字，讀音用廣東話。大人可以開拼音一齊睇。</p>
        <button className="btn primary" type="button" onClick={onClose}>
          知喇
        </button>
      </div>
    </div>
  )
}
