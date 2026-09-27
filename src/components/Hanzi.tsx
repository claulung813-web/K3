export function Hanzi({
  char,
  size = 'md',
  tone = 'cream',
}: {
  char: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  tone?: string
}) {
  return (
    <span className={`hanzi hanzi-${size} hanzi-${tone}`}>
      <span className="hanzi-grid" aria-hidden="true" />
      <span className="hanzi-char">{char}</span>
    </span>
  )
}
