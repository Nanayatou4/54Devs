import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import OnboardingProfile from './pages/OnboardingProfile'
import OnboardingSkills from './pages/OnboardingSkills'
import Dashboard from './pages/Dashboard'
import GitHubCallback from './pages/GitHubCallback'
import GoogleCallback from './pages/GoogleCallback'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding/profile" element={<OnboardingProfile />} />
        <Route path="/onboarding/skills" element={<OnboardingSkills />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth/callback/github" element={<GitHubCallback />} />
        <Route path="/auth/callback/google" element={<GoogleCallback />} />
      </Routes>
    </BrowserRouter>
  )
}
