const KEY = 'k3-zi-zi-lok'

type Progress = {
  stars: number
  knownIds: string[]
  showJyutping: boolean
}

const empty: Progress = {
  stars: 0,
  knownIds: [],
  showJyutping: true,
}

function read(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty
    const parsed = JSON.parse(raw) as Partial<Progress>
    return {
      stars: Number(parsed.stars) || 0,
      knownIds: Array.isArray(parsed.knownIds) ? parsed.knownIds : [],
      showJyutping: parsed.showJyutping !== false,
    }
  } catch {
    return empty
  }
}

function write(progress: Progress) {
  localStorage.setItem(KEY, JSON.stringify(progress))
}

export function loadProgress() {
  return read()
}

export function addStars(amount: number) {
  const progress = read()
  progress.stars += amount
  write(progress)
  return progress
}

export function markKnown(ids: string[]) {
  const progress = read()
  const set = new Set(progress.knownIds)
  ids.forEach((id) => set.add(id))
  progress.knownIds = [...set]
  write(progress)
  return progress
}

export function setShowJyutping(show: boolean) {
  const progress = read()
  progress.showJyutping = show
  write(progress)
  return progress
}
