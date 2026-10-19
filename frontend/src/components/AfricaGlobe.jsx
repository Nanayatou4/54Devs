import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react'
import * as THREE from 'three'
import { feature as topoFeature } from 'topojson-client'
import worldTopology from 'world-atlas/countries-50m.json'

const AFRICAN_COUNTRY_IDS = new Set([
  '012', '024', '072', '108', '120', '132', '140', '148', '174', '178', '180', '204',
  '226', '231', '232', '262', '266', '270', '288', '324', '384', '404', '426', '430',
  '434', '450', '454', '466', '478', '480', '504', '508', '516', '562', '566', '624',
  '646', '678', '686', '690', '694', '706', '710', '716', '728', '729', '748', '768',
  '788', '800', '818', '834', '854', '894',
])

const FRENCH_COUNTRY_NAMES = {
  '012': 'Algérie', '024': 'Angola', '072': 'Botswana', '108': 'Burundi', '120': 'Cameroun',
  '132': 'Cap-Vert', '140': 'République centrafricaine', '148': 'Tchad', '174': 'Comores',
  '178': 'Congo', '180': 'République démocratique du Congo', '204': 'Bénin',
  '226': 'Guinée équatoriale', '231': 'Éthiopie', '232': 'Érythrée', '262': 'Djibouti',
  '266': 'Gabon', '270': 'Gambie', '288': 'Ghana', '324': 'Guinée',
  '384': 'Côte d’Ivoire', '404': 'Kenya', '426': 'Lesotho', '430': 'Liberia',
  '434': 'Libye', '450': 'Madagascar', '454': 'Malawi', '466': 'Mali',
  '478': 'Mauritanie', '480': 'Maurice', '504': 'Maroc', '508': 'Mozambique',
  '516': 'Namibie', '562': 'Niger', '566': 'Nigeria', '624': 'Guinée-Bissau',
  '646': 'Rwanda', '678': 'São Tomé-et-Príncipe', '686': 'Sénégal',
  '690': 'Seychelles', '694': 'Sierra Leone', '706': 'Somalie',
  '710': 'Afrique du Sud', '716': 'Zimbabwe', '728': 'Soudan du Sud', '729': 'Soudan',
  '748': 'Eswatini', '768': 'Togo', '788': 'Tunisie', '800': 'Ouganda',
  '818': 'Égypte', '834': 'Tanzanie', '854': 'Burkina Faso', '894': 'Zambie',
}

const COUNTRIES = topoFeature(worldTopology, worldTopology.objects.countries).features
  .filter(country => AFRICAN_COUNTRY_IDS.has(String(country.id).padStart(3, '0')) && country.properties?.name !== 'W. Sahara')
  .map(country => ({ ...country, properties: { ...country.properties, name: FRENCH_COUNTRY_NAMES[String(country.id).padStart(3, '0')] || country.properties.name } }))
  .sort((a, b) => a.properties.name.localeCompare(b.properties.name, 'fr'))
const ALL_COUNTRIES = topoFeature(worldTopology, worldTopology.objects.countries).features

function eachPolygon(feature, callback) {
  const geometry = feature.geometry
  if (!geometry) return
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
  polygons.forEach(polygon => callback(polygon))
}

function drawMap(context, selectedId) {
  const { width, height } = context.canvas
  context.clearRect(0, 0, width, height)
  context.fillStyle = '#142119'
  context.fillRect(0, 0, width, height)

  context.strokeStyle = 'rgba(228, 239, 212, 0.08)'
  context.lineWidth = 1
  for (let latitude = -60; latitude <= 75; latitude += 30) {
    const y = ((90 - latitude) / 180) * height
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y)
    context.stroke()
  }

  ALL_COUNTRIES.forEach(country => {
    const isAfrica = AFRICAN_COUNTRY_IDS.has(String(country.id).padStart(3, '0')) && country.properties?.name !== 'W. Sahara'
    const isSelected = String(country.id).padStart(3, '0') === selectedId
    context.beginPath()
    eachPolygon(country, polygon => polygon.forEach(ring => {
      ring.forEach(([longitude, latitude], index) => {
        const x = ((longitude + 180) / 360) * width
        const y = ((90 - latitude) / 180) * height
        if (index === 0) context.moveTo(x, y)
        else context.lineTo(x, y)
      })
      context.closePath()
    }))
    context.fillStyle = isSelected ? '#D7F57F' : isAfrica ? '#718C55' : '#35483A'
    context.fill()
    context.strokeStyle = isAfrica ? 'rgba(234, 246, 213, 0.72)' : 'rgba(207, 221, 198, 0.26)'
    context.lineWidth = isAfrica ? 1.4 : 0.8
    context.stroke()
  })
}

function getCenterLongitude(country) {
  let min = 180
  let max = -180
  eachPolygon(country, polygon => polygon.forEach(ring => ring.forEach(([longitude]) => {
    min = Math.min(min, longitude)
    max = Math.max(max, longitude)
  })))
  return (min + max) / 2
}

function pointInRing(longitude, latitude, ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    const intersects = (yi > latitude) !== (yj > latitude)
      && longitude < ((xj - xi) * (latitude - yi)) / ((yj - yi) || Number.EPSILON) + xi
    if (intersects) inside = !inside
  }
  return inside
}

function countryAt(longitude, latitude) {
  return COUNTRIES.find(country => {
    let found = false
    eachPolygon(country, polygon => {
      if (polygon[0] && pointInRing(longitude, latitude, polygon[0]) && !polygon.slice(1).some(ring => pointInRing(longitude, latitude, ring))) found = true
    })
    return found
  })
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function AfricaGlobe() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const textureRef = useRef(null)
  const selectedRef = useRef(0)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(() => !prefersReducedMotion())
  const [isVisible, setIsVisible] = useState(false)
  const [webglAvailable, setWebglAvailable] = useState(true)

  const selectedCountry = COUNTRIES[selectedIndex]
  const countryId = String(selectedCountry?.id).padStart(3, '0')

  const selectCountry = useCallback((index) => {
    const next = (index + COUNTRIES.length) % COUNTRIES.length
    selectedRef.current = next
    setSelectedIndex(next)
  }, [])

  useEffect(() => {
    const element = containerRef.current
    if (!element || !window.IntersectionObserver) {
      setIsVisible(true)
      return undefined
    }
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.18 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isPlaying || !isVisible || prefersReducedMotion() || document.hidden) return undefined
    const timer = window.setInterval(() => selectCountry(selectedRef.current + 1), 3200)
    return () => window.clearInterval(timer)
  }, [isPlaying, isVisible, selectCountry])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) setIsVisible(false)
      else if (containerRef.current?.getBoundingClientRect().bottom > 0 && containerRef.current?.getBoundingClientRect().top < window.innerHeight) setIsVisible(true)
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const context = canvas.getContext('2d')
    if (!context) return
    drawMap(context, String(COUNTRIES[0]?.id).padStart(3, '0'))
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.wrapS = THREE.RepeatWrapping
    texture.offset.x = 0.25
    texture.anisotropy = 4
    textureRef.current = { texture, context }
    return () => {
      texture.dispose()
      textureRef.current = null
    }
  }, [])

  useEffect(() => {
    const textureState = textureRef.current
    if (!textureState) return
    drawMap(textureState.context, countryId)
    textureState.texture.needsUpdate = true
  }, [countryId])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const mapTexture = textureRef.current?.texture
    if (!canvas || !container || !mapTexture || !isVisible) return undefined

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
    } catch {
      setWebglAvailable(false)
      return undefined
    }

    setWebglAvailable(true)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 20)
    camera.position.set(0, 0, 3.2)

    const globe = new THREE.Group()
    scene.add(globe)
    globe.rotation.y = -getCenterLongitude(COUNTRIES[0]) * Math.PI / 180
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 96, 64),
      new THREE.MeshStandardMaterial({ map: mapTexture, roughness: 0.96, metalness: 0.02 }),
    )
    globe.add(sphere)
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.025, 64, 48),
      new THREE.MeshBasicMaterial({ color: '#C9F06A', side: THREE.BackSide, transparent: true, opacity: 0.14 }),
    )
    globe.add(atmosphere)

    scene.add(new THREE.AmbientLight('#DCE9D5', 2.2))
    const keyLight = new THREE.DirectionalLight('#FFF9D9', 3.1)
    keyLight.position.set(-3, 2.5, 4)
    scene.add(keyLight)
    const rimLight = new THREE.PointLight('#9EBF61', 1.8)
    rimLight.position.set(2, -1, -2)
    scene.add(rimLight)

    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(1.22, 0.003, 6, 180),
      new THREE.MeshBasicMaterial({ color: '#66883A', transparent: true, opacity: 0.55 }),
    )
    orbit.rotation.set(0.35, -0.3, -0.42)
    scene.add(orbit)
    const orbitMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 12, 10),
      new THREE.MeshBasicMaterial({ color: '#53702D' }),
    )
    orbitMarker.position.set(0.82, 0.68, 0.78)
    scene.add(orbitMarker)

    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    const resizeObserver = window.ResizeObserver ? new ResizeObserver(resize) : null
    if (resizeObserver) resizeObserver.observe(container)
    else window.addEventListener('resize', resize)
    resize()

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const handleClick = event => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObject(sphere)[0]
      if (!hit?.uv) return
      const textureU = (hit.uv.x + mapTexture.offset.x) % 1
      const longitude = textureU * 360 - 180
      const latitude = 90 - hit.uv.y * 180
      const country = countryAt(longitude, latitude)
      const index = COUNTRIES.findIndex(item => item.id === country?.id)
      if (index >= 0) {
        selectCountry(index)
        setIsPlaying(false)
      }
    }
    canvas.addEventListener('click', handleClick)

    let frameId
    let previousTime = 0
    const targetLongitude = () => -getCenterLongitude(COUNTRIES[selectedRef.current]) * Math.PI / 180
    const render = time => {
      frameId = window.requestAnimationFrame(render)
      if (time - previousTime < 32) return
      const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.04) : 0
      previousTime = time
      previousTime = time
      const angleDifference = Math.atan2(Math.sin(targetLongitude() - globe.rotation.y), Math.cos(targetLongitude() - globe.rotation.y))
      globe.rotation.y += angleDifference * 0.055
      if (!prefersReducedMotion()) {
        orbit.rotation.z += delta * 0.12
        orbitMarker.position.set(Math.cos(time * 0.00018) * 1.22, Math.sin(time * 0.00018) * 0.7, Math.sin(time * 0.00018) * 0.95)
      }
      renderer.render(scene, camera)
    }
    frameId = window.requestAnimationFrame(render)
    return () => {
      window.cancelAnimationFrame(frameId)
      resizeObserver?.disconnect()
      if (!resizeObserver) window.removeEventListener('resize', resize)
      canvas.removeEventListener('click', handleClick)
      sphere.geometry.dispose()
      sphere.material.dispose()
      atmosphere.geometry.dispose()
      atmosphere.material.dispose()
      orbit.geometry.dispose()
      orbit.material.dispose()
      orbitMarker.geometry.dispose()
      orbitMarker.material.dispose()
      renderer.dispose()
    }
  }, [isVisible, selectCountry])

  const countryOrdinal = String(selectedIndex + 1).padStart(2, '0')

  return (
    <div ref={containerRef} className="relative mx-auto aspect-square w-full max-w-[500px]">
      <div aria-hidden="true" className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle_at_36%_30%,#344639_0%,#1A2920_48%,#101915_76%)] shadow-[inset_-26px_-15px_50px_rgba(0,0,0,0.45),0_35px_90px_-32px_rgba(0,0,0,0.28)]" />
      <canvas ref={canvasRef} role="img" aria-label={`Globe interactif. Pays sélectionné : ${selectedCountry?.properties.name}. Cliquez sur un pays africain pour le sélectionner.`} className={`absolute inset-0 h-full w-full touch-manipulation ${webglAvailable ? 'cursor-pointer' : 'hidden'}`} />
      {!webglAvailable && <div className="absolute inset-[10%] grid place-items-center rounded-full bg-[#17221B] p-10 text-center text-sm leading-6 text-white">L’affichage 3D n’est pas disponible dans ce navigateur. Utilisez les commandes ci-dessous pour parcourir les pays.</div>}

      <div className="absolute left-[7%] top-[11%] rounded-full border border-[#66883A]/20 bg-[#F6F7F1]/90 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#53702D] shadow-sm backdrop-blur sm:text-[10px]">
        Afrique · 54 pays
      </div>
      <div className="absolute bottom-[3%] left-1/2 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full border border-[#D6DCCF] bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur">
        <span className="font-mono text-[10px] font-bold text-[#66883A]">{countryOrdinal}/54</span>
        <span className="h-4 w-px bg-[#D6DCCF]" />
        <span className="text-xs font-bold text-[#18211B] sm:text-sm">{selectedCountry?.properties.name}</span>
      </div>

      <div className="absolute right-[4%] top-[12%] flex items-center gap-1 rounded-full border border-white/80 bg-white/90 p-1 shadow-md backdrop-blur" aria-label="Commandes du globe">
        <button type="button" onClick={() => { selectCountry(selectedIndex - 1); setIsPlaying(false) }} aria-label="Pays précédent" className="grid h-9 w-9 place-items-center rounded-full text-[#344536] transition hover:bg-[#E9EDE4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#66883A]"><ArrowLeft size={15} /></button>
        <button type="button" onClick={() => setIsPlaying(value => !value)} aria-label={isPlaying ? 'Mettre le parcours en pause' : 'Reprendre le parcours'} className="grid h-9 w-9 place-items-center rounded-full bg-[#17221B] text-white transition hover:bg-[#344536] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#66883A]">{isPlaying ? <Pause size={14} /> : <Play size={14} />}</button>
        <button type="button" onClick={() => { selectCountry(selectedIndex + 1); setIsPlaying(false) }} aria-label="Pays suivant" className="grid h-9 w-9 place-items-center rounded-full text-[#344536] transition hover:bg-[#E9EDE4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#66883A]"><ArrowRight size={15} /></button>
      </div>
    </div>
  )
}
