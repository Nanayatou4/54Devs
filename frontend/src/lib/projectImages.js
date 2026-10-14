export const COVER_PRESETS = [
  { label: '⚡ Énergie & Climat', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80' },
  { label: '🤖 IA & NLP', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80' },
  { label: '💳 FinTech', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80' },
  { label: '📚 Éducation', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80' },
  { label: '🩺 Santé', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80' },
  { label: '🌱 AgriTech', url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80' },
]

export const CATEGORY_IMAGES = {
  energy: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
  nlp: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  fintech: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
  education: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
  health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
  agriculture: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
}

export function getProjectImage(p) {
  if (p?.imageUrl) return p.imageUrl
  const text = `${p?.nom || ''} ${p?.categorie || ''} ${p?.technologies || ''}`.toLowerCase()
  if (text.includes('energie') || text.includes('energy') || text.includes('solaire') || text.includes('grid') || text.includes('climat')) {
    return CATEGORY_IMAGES.energy
  }
  if (text.includes('nlp') || text.includes('lang') || text.includes('ia') || text.includes('ai') || text.includes('data')) {
    return CATEGORY_IMAGES.nlp
  }
  if (text.includes('pay') || text.includes('finance') || text.includes('fintech') || text.includes('stream') || text.includes('bank') || text.includes('money')) {
    return CATEGORY_IMAGES.fintech
  }
  if (text.includes('ecole') || text.includes('educ') || text.includes('reach') || text.includes('apprendre') || text.includes('social')) {
    return CATEGORY_IMAGES.education
  }
  if (text.includes('sante') || text.includes('health') || text.includes('med') || text.includes('docteur')) {
    return CATEGORY_IMAGES.health
  }
  if (text.includes('agri') || text.includes('plante') || text.includes('ferme')) {
    return CATEGORY_IMAGES.agriculture
  }
  return CATEGORY_IMAGES.default
}

export const DEVELOPER_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
]

export function getAvatarForIndex(index) {
  return DEVELOPER_AVATARS[Math.abs(index || 0) % DEVELOPER_AVATARS.length]
}
