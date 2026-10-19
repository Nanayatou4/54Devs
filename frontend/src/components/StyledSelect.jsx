import { Children, isValidElement, useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

/** Theme-matched select menu that avoids the browser's blue native option highlight. */
export default function StyledSelect({ value, onChange, className = '', children, disabled = false, required = false, ...props }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const options = Children.toArray(children)
    .filter(child => isValidElement(child) && child.type === 'option')
    .map(child => ({ value: String(child.props.value ?? child.props.children), label: child.props.children, disabled: child.props.disabled }))
  const selected = options.find(option => option.value === String(value ?? ''))

  useEffect(() => {
    if (!open) return
    const onPointerDown = event => { if (!rootRef.current?.contains(event.target)) setOpen(false) }
    const onKeyDown = event => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function moveFocus(event) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const items = [...event.currentTarget.querySelectorAll('[role="option"]:not(:disabled)')]
    const index = items.indexOf(document.activeElement)
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1
      : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
    items[next]?.focus()
  }

  return (
    <div ref={rootRef} className={`relative min-w-0 ${open ? 'z-20' : ''}`}>
      <button
        type="button"
        {...props}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-required={required || undefined}
        onClick={() => setOpen(current => !current)}
        className={`${className} flex items-center justify-between gap-2 text-left disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <span className="min-w-0 truncate">{selected?.label ?? options[0]?.label ?? ''}</span>
        <ChevronDown size={15} aria-hidden="true" className={`shrink-0 text-[#c9f06a] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && !disabled && (
        <div
          role="listbox"
          aria-label={props['aria-label'] || 'Choisir une option'}
          onKeyDown={moveFocus}
          className="absolute left-0 top-full z-[100] mt-2 max-h-64 min-w-full overflow-y-auto rounded-xl border border-[#c9f06a]/25 bg-[#0d2119] p-1.5 text-sm text-white shadow-2xl shadow-black/50 ring-1 ring-white/10"
        >
          {options.map((option, index) => {
            const selectedOption = option.value === String(value ?? '')
            return (
              <button
                key={`${option.value}-${index}`}
                type="button"
                role="option"
                aria-selected={selectedOption}
                disabled={option.disabled}
                onClick={() => {
                  onChange?.({ target: { value: option.value } })
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c9f06a] disabled:opacity-40 ${selectedOption ? 'bg-[#c9f06a] font-semibold text-[#102018]' : 'text-white/85 hover:bg-[#c9f06a]/15 hover:text-[#e5f8b8]'}`}
              >
                <span className="min-w-0 truncate">{option.label}</span>
                {selectedOption && <Check size={14} className="shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
