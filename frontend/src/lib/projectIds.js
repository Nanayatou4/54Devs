const STORAGE_KEY = 'my_project_ids'

/** IDs locaux en attendant un endpoint GET /api/projets (liste). */
export function getMyProjectIds() {
  try {
    const ids = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(ids) ? ids.map(Number).filter(Boolean) : []
  } catch {
    return []
  }
}

export function addMyProjectId(id) {
  const numId = Number(id)
  if (!numId) return
  const ids = getMyProjectIds()
  if (!ids.includes(numId)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([numId, ...ids]))
  }
}

export function setMyProjectIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}
