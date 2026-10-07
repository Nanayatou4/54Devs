import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import OnboardingProfile from './pages/OnboardingProfile'
import OnboardingSkills from './pages/OnboardingSkills'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding/profile" element={<OnboardingProfile />} />
        <Route path="/onboarding/skills" element={<OnboardingSkills />} />
      </Routes>
    </BrowserRouter>
  )
}
