import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pencil, Code, Server, Smartphone, Brain } from 'lucide-react'

const focusOptions = [
  { key: 'FRONTEND', label: 'Frontend', icon: Code, color: 'text-blue-600 border-blue-600 bg-blue-50' },
  { key: 'BACKEND', label: 'Backend', icon: Server, color: 'text-gray-700 border-gray-300 bg-white' },
  { key: 'MOBILE', label: 'Mobile', icon: Smartphone, color: 'text-gray-700 border-gray-300 bg-white' },
  { key: 'DATA_AI', label: 'Data/AI', icon: Brain, color: 'text-gray-700 border-gray-300 bg-white' },
]

export default function OnboardingProfile() {
  const navigate = useNavigate()
  const [pays, setPays] = useState('')
  const [ville, setVille] = useState('')
  const [focus, setFocus] = useState('')
  const [bio, setBio] = useState('')
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileInputRef = useRef(null)

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  function handleNext(e) {
    e.preventDefault()
    const profile = { pays, ville, focus, bio }
    localStorage.setItem('onboarding_profile', JSON.stringify(profile))
    navigate('/onboarding/skills')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="text-gray-900">54<span className="font-extrabold">Devs</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-8 h-1.5 rounded-full bg-primary" />
            <div className="w-8 h-1.5 rounded-full bg-primary" />
            <div className="w-8 h-1.5 rounded-full bg-gray-200" />
          </div>
          <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">Step 2 of 3</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Define your identity</h1>
        <p className="text-sm text-gray-500 text-center mb-10">
          Tell us where you are building from and what you specialize in.
        </p>

        <form onSubmit={handleNext} className="space-y-8">
          {/* Profile Photo */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-16 h-16 rounded-full bg-gray-100 shrink-0 overflow-visible group"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Photo de profil" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl font-bold">
                  ?
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md border-2 border-white group-hover:scale-110 transition">
                <Pencil size={12} className="text-white" />
              </span>
            </button>
            <div>
              <div className="text-sm font-bold text-gray-900">Profile Photo</div>
              <p className="text-xs text-gray-500 mb-1">A professional photo helps in mentorship and job matching.</p>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-primary font-semibold hover:underline">
                Upload custom image
              </button>
            </div>
          </div>

          {/* Country + City */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                Your Nation (54 of 54)
              </label>
              <select
                value={pays}
                onChange={(e) => setPays(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition appearance-none"
              >
                <option value="">Select your country</option>
                <option value="Sénégal">Sénégal</option>
                <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                <option value="Cameroun">Cameroun</option>
                <option value="Mali">Mali</option>
                <option value="Togo">Togo</option>
                <option value="Bénin">Bénin</option>
                <option value="Maroc">Maroc</option>
                <option value="Tunisie">Tunisie</option>
                <option value="Algérie">Algérie</option>
                <option value="Égypte">Égypte</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="Kenya">Kenya</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Éthiopie">Éthiopie</option>
                <option value="Tanzanie">Tanzanie</option>
                <option value="Afrique du Sud">Afrique du Sud</option>
                <option value="RDC">RDC</option>
                <option value="Guinée">Guinée</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Niger">Niger</option>
                <option value="Mauritanie">Mauritanie</option>
                <option value="Madagascar">Madagascar</option>
                <option value="Gabon">Gabon</option>
                <option value="Congo">Congo</option>
                <option value="Tchad">Tchad</option>
                <option value="Autre">Autre</option>
              </select>
              <p className="text-[10px] text-gray-400 mt-1">We support talent from every nation on the continent.</p>
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                City / Tech Hub
              </label>
              <input
                type="text"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                placeholder="e.g. Nairobi, Lagos, Cairo"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Primary Focus */}
          <div>
            <label className="block text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-3">
              What is your primary focus?
            </label>
            <div className="flex gap-3">
              {focusOptions.map((opt) => {
                const Icon = opt.icon
                const selected = focus === opt.key
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setFocus(opt.key)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-4 rounded-xl border-2 transition font-semibold text-xs ${
                      selected
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={20} />
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Professional Bio */}
          <div>
            <label className="block text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-1.5">
              Professional Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Briefly describe your journey and what you're passionate about building..."
              maxLength={250}
              rows={4}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
            />
            <p className="text-[10px] text-gray-400 text-right mt-1">{bio.length} / 250 characters</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="flex-[2] py-2.5 rounded-full bg-dark text-white text-sm font-semibold hover:bg-dark-2 transition flex items-center justify-center gap-2"
            >
              Next: Skills & Experience &rarr;
            </button>
          </div>
        </form>

        <p className="text-center text-[11px] text-gray-400 mt-6">
          Need help? <a href="#" className="text-primary hover:underline font-medium">Contact onboarding support</a>
        </p>
      </div>
    </div>
  )
}
