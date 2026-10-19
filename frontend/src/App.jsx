import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import OnboardingProfile from './pages/OnboardingProfile'
import OnboardingSkills from './pages/OnboardingSkills'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import ProjectCreate from './pages/ProjectCreate'
import Profile from './pages/Profile'
import GitHubCallback from './pages/GitHubCallback'
import GoogleCallback from './pages/GoogleCallback'
import Dashboard from './pages/Dashboard'
import Questions from './pages/Questions'
import Challenges from './pages/Challenges'
import Developers from './pages/Developers'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import SmartMatch from './pages/SmartMatch'
import CommunityHub from './pages/CommunityHub'
import Mentorship from './pages/Mentorship'
import AdminRoute from './components/AdminRoute'
import AdminDashboard from './pages/AdminDashboard'
import AdminChallenges from './pages/AdminChallenges'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback/github" element={<GitHubCallback />} />
        <Route path="/auth/callback/google" element={<GoogleCallback />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding/profile" element={<OnboardingProfile />} />
          <Route path="/onboarding/skills" element={<OnboardingSkills />} />
          <Route element={<AppLayout />}>
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/create" element={<ProjectCreate />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/smart-match" element={<SmartMatch />} />
            <Route path="/community" element={<CommunityHub />} />
            <Route path="/mentorship" element={<Mentorship />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/questions/:id" element={<Questions />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/challenges/:id" element={<Challenges />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/developers/:id" element={<Developers />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin/challenges/creer" element={<AdminChallenges />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
