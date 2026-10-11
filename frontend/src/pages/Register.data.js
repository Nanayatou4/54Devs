export const steps = [
  { number: 1, title: 'Votre compte', description: 'Créez vos identifiants de connexion.' },
  { number: 2, title: 'Votre profil', description: 'Présentez-vous et indiquez où vous êtes.' },
  { number: 3, title: 'Vos compétences', description: 'Partagez ce que vous savez faire ou souhaitez apprendre.' },
]

export function getPasswordStrength(password) {
  if (!password) return { level: 0, label: '', color: '' }
  if (password.length < 6) return { level: 1, label: 'WEAK', color: 'bg-red-500' }
  if (password.length < 10) return { level: 2, label: 'MODERATE', color: 'bg-yellow-500' }
  return { level: 3, label: 'STRONG', color: 'bg-green' }
}
