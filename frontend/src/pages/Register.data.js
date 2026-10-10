export const steps = [
  { number: 1, title: 'Account Basics', description: 'Set up your secure credentials.' },
  { number: 2, title: 'Developer Identity', description: 'Profile, country, and focus area.' },
  { number: 3, title: 'Skills & Verified Bio', description: 'Establish your skill and reputation.' },
]

export function getPasswordStrength(password) {
  if (!password) return { level: 0, label: '', color: '' }
  if (password.length < 6) return { level: 1, label: 'WEAK', color: 'bg-red-500' }
  if (password.length < 10) return { level: 2, label: 'MODERATE', color: 'bg-yellow-500' }
  return { level: 3, label: 'STRONG', color: 'bg-green' }
}
