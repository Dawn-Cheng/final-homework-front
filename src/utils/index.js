export function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function formatPrice(price) {
  return Number(price).toFixed(2)
}

export function showToast(msg, duration = 1500) {
  const el = document.createElement('div')
  el.className = 'toast'
  el.textContent = msg
  document.body.appendChild(el)
  setTimeout(() => el.remove(), duration)
}
