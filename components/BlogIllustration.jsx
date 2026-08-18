'use client'
import { useEffect, useRef } from 'react'

// Blog: When Colleges Close — campus landscape transforming, policy dome in background
export function WhenCollegesCloseIllustration() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight

    // Sky gradient — dawn breaking from right
    const sky = ctx.createLinearGradient(0, 0, w, h * 0.4)
    sky.addColorStop(0, '#0a0a18')
    sky.addColorStop(0.4, '#121832')
    sky.addColorStop(0.7, '#1a2a4a')
    sky.addColorStop(1, '#2a4a60')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, w, h)

    // Horizon glow — warm light from right side
    const dawn = ctx.createRadialGradient(w * 0.85, h * 0.55, 10, w * 0.85, h * 0.55, w * 0.5)
    dawn.addColorStop(0, 'rgba(245,158,11,0.2)')
    dawn.addColorStop(0.4, 'rgba(245,158,11,0.08)')
    dawn.addColorStop(1, 'transparent')
    ctx.fillStyle = dawn
    ctx.fillRect(0, 0, w, h)

    // Stars (fading left to right as dawn arrives)
    for (let i = 0; i < 50; i++) {
      const sx = Math.random() * w
      const fade = Math.max(0, 1 - sx / w)
      ctx.fillStyle = `rgba(255,255,255,${fade * (0.2 + Math.random() * 0.4)})`
      ctx.beginPath()
      ctx.arc(sx, Math.random() * h * 0.45, 0.4 + Math.random() * 0.8, 0, Math.PI * 2)
      ctx.fill()
    }

    // Capitol dome silhouette — subtle, center-right background
    ctx.fillStyle = 'rgba(12,31,63,0.4)'
    // Dome
    ctx.beginPath()
    ctx.ellipse(w * 0.72, h * 0.42, w * 0.06, h * 0.08, 0, Math.PI, 0)
    ctx.fill()
    // Dome top spire
    ctx.fillRect(w * 0.718, h * 0.32, w * 0.004, h * 0.1)
    // Base columns
    ctx.fillRect(w * 0.66, h * 0.42, w * 0.12, h * 0.06)
    // Steps
    ctx.fillRect(w * 0.64, h * 0.48, w * 0.16, h * 0.02)

    // Ground — rolling hills
    ctx.fillStyle = '#0f2818'
    ctx.beginPath()
    ctx.moveTo(0, h * 0.72)
    ctx.quadraticCurveTo(w * 0.15, h * 0.67, w * 0.3, h * 0.7)
    ctx.quadraticCurveTo(w * 0.5, h * 0.74, w * 0.7, h * 0.68)
    ctx.quadraticCurveTo(w * 0.85, h * 0.65, w, h * 0.67)
    ctx.lineTo(w, h)
    ctx.lineTo(0, h)
    ctx.fill()

    // Lighter grass layer
    ctx.fillStyle = '#163a22'
    ctx.beginPath()
    ctx.moveTo(0, h * 0.75)
    ctx.quadraticCurveTo(w * 0.2, h * 0.72, w * 0.4, h * 0.74)
    ctx.quadraticCurveTo(w * 0.6, h * 0.76, w * 0.8, h * 0.72)
    ctx.quadraticCurveTo(w * 0.9, h * 0.7, w, h * 0.71)
    ctx.lineTo(w, h)
    ctx.lineTo(0, h)
    ctx.fill()

    // LEFT SIDE: Dark/closed campus
    // Main building — dark, no lights
    ctx.fillStyle = '#1a1a24'
    ctx.fillRect(w * 0.04, h * 0.4, w * 0.16, h * 0.32)
    // Roof peak
    ctx.beginPath()
    ctx.moveTo(w * 0.04, h * 0.4)
    ctx.lineTo(w * 0.12, h * 0.32)
    ctx.lineTo(w * 0.2, h * 0.4)
    ctx.fill()
    // Dark windows
    ctx.fillStyle = '#0a0a12'
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        ctx.fillRect(w * (0.06 + c * 0.045), h * (0.44 + r * 0.08), w * 0.025, h * 0.045)
      }
    }
    // Second dark building
    ctx.fillStyle = '#1a1a24'
    ctx.fillRect(w * 0.22, h * 0.46, w * 0.1, h * 0.26)
    ctx.fillStyle = '#0a0a12'
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        ctx.fillRect(w * (0.235 + c * 0.04), h * (0.5 + r * 0.08), w * 0.02, h * 0.04)
      }
    }
    // "CLOSED" sign
    ctx.fillStyle = '#8B0000'
    ctx.fillRect(w * 0.08, h * 0.62, w * 0.08, h * 0.025)
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.font = 'bold 5px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('CLOSED', w * 0.12, h * 0.638)

    // Cracks / weeds (small lines)
    ctx.strokeStyle = 'rgba(100,100,80,0.3)'
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(w * 0.1, h * 0.72); ctx.lineTo(w * 0.11, h * 0.68)
    ctx.moveTo(w * 0.15, h * 0.73); ctx.lineTo(w * 0.155, h * 0.7)
    ctx.moveTo(w * 0.25, h * 0.72); ctx.lineTo(w * 0.255, h * 0.69)
    ctx.stroke()

    // CENTER: Transition arrow / light beam
    const beam = ctx.createLinearGradient(w * 0.35, 0, w * 0.55, 0)
    beam.addColorStop(0, 'transparent')
    beam.addColorStop(0.3, 'rgba(0,168,168,0.08)')
    beam.addColorStop(0.7, 'rgba(0,168,168,0.08)')
    beam.addColorStop(1, 'transparent')
    ctx.fillStyle = beam
    ctx.fillRect(w * 0.35, h * 0.3, w * 0.2, h * 0.5)

    // Arrow
    ctx.fillStyle = '#00A8A8'
    ctx.beginPath()
    ctx.moveTo(w * 0.42, h * 0.56)
    ctx.lineTo(w * 0.48, h * 0.53)
    ctx.lineTo(w * 0.48, h * 0.545)
    ctx.lineTo(w * 0.52, h * 0.545)
    ctx.lineTo(w * 0.52, h * 0.575)
    ctx.lineTo(w * 0.48, h * 0.575)
    ctx.lineTo(w * 0.48, h * 0.59)
    ctx.fill()
    // "TRANSFORM" label
    ctx.fillStyle = 'rgba(0,168,168,0.7)'
    ctx.font = 'bold 5px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('TRANSFORM', w * 0.47, h * 0.52)

    // RIGHT SIDE: Alive transformed campus
    // Main building — warm lights
    ctx.fillStyle = '#1e3a4a'
    ctx.fillRect(w * 0.58, h * 0.38, w * 0.18, h * 0.34)
    // Roof peak
    ctx.beginPath()
    ctx.moveTo(w * 0.58, h * 0.38)
    ctx.lineTo(w * 0.67, h * 0.3)
    ctx.lineTo(w * 0.76, h * 0.38)
    ctx.fillStyle = '#1e3a4a'
    ctx.fill()
    // Warm windows
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        ctx.fillStyle = `rgba(245,158,11,${0.5 + Math.random() * 0.5})`
        ctx.fillRect(w * (0.6 + c * 0.05), h * (0.42 + r * 0.08), w * 0.028, h * 0.045)
      }
    }
    // Second building
    ctx.fillStyle = '#1e3a4a'
    ctx.fillRect(w * 0.78, h * 0.44, w * 0.12, h * 0.28)
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        ctx.fillStyle = `rgba(245,158,11,${0.4 + Math.random() * 0.5})`
        ctx.fillRect(w * (0.8 + c * 0.045), h * (0.48 + r * 0.08), w * 0.025, h * 0.04)
      }
    }

    // Banner on right building
    ctx.fillStyle = '#00A8A8'
    ctx.fillRect(w * 0.6, h * 0.33, w * 0.14, h * 0.03)
    ctx.fillStyle = 'white'
    ctx.font = 'bold 4.5px sans-serif'
    ctx.fillText('COMMUNITY CAMPUS', w * 0.67, h * 0.352)

    // Trees on right side
    const drawTree = (x, y, size) => {
      ctx.fillStyle = '#166534'
      ctx.beginPath()
      ctx.arc(w * x, h * y, size, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#1a7a3a'
      ctx.beginPath()
      ctx.arc(w * x - size * 0.3, h * y - size * 0.3, size * 0.7, 0, Math.PI * 2)
      ctx.fill()
    }
    drawTree(0.55, 0.64, 6)
    drawTree(0.92, 0.6, 8)
    drawTree(0.96, 0.63, 5)

    // People on right — community gathering
    ctx.fillStyle = '#00A8A8'
    const people = [
      [0.6, 0.7], [0.635, 0.69], [0.67, 0.71], [0.7, 0.695],
      [0.735, 0.71], [0.77, 0.69], [0.8, 0.705], [0.835, 0.7],
      [0.87, 0.71], [0.57, 0.705],
    ]
    people.forEach(([x, y]) => {
      ctx.beginPath()
      ctx.arc(w * x, h * y - 4, 2.2, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillRect(w * x - 1.2, h * y - 1.5, 2.4, 5.5)
    })

    // Solar panel on right building roof
    ctx.fillStyle = '#1a4a6a'
    ctx.fillRect(w * 0.8, h * 0.42, w * 0.06, h * 0.015)
    ctx.strokeStyle = 'rgba(0,168,168,0.4)'
    ctx.lineWidth = 0.3
    ctx.strokeRect(w * 0.8, h * 0.42, w * 0.06, h * 0.015)

    // Smoke/steam from right building (activity)
    ctx.fillStyle = 'rgba(200,200,200,0.08)'
    ctx.beginPath()
    ctx.arc(w * 0.84, h * 0.38, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(w * 0.845, h * 0.34, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(w * 0.85, h * 0.3, 6, 0, Math.PI * 2)
    ctx.fill()

    // Path/road connecting
    ctx.strokeStyle = 'rgba(200,200,200,0.15)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(w * 0.12, h * 0.75)
    ctx.quadraticCurveTo(w * 0.35, h * 0.78, w * 0.5, h * 0.76)
    ctx.quadraticCurveTo(w * 0.65, h * 0.74, w * 0.85, h * 0.73)
    ctx.stroke()

  }, [])

  return (
    <canvas ref={canvasRef} className="w-full rounded-xl" style={{ height: '240px' }} />
  )
}

// Blog 1: Campus transforming — buildings with roots growing, community gathering
export function BeyondTheCollegeIllustration() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, h)
    sky.addColorStop(0, '#1a1a2e')
    sky.addColorStop(0.5, '#16213e')
    sky.addColorStop(1, '#0f3460')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, w, h)

    // Stars
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.5})`
      ctx.beginPath()
      ctx.arc(Math.random() * w, Math.random() * h * 0.5, 0.5 + Math.random(), 0, Math.PI * 2)
      ctx.fill()
    }

    // Ground
    ctx.fillStyle = '#1a4a30'
    ctx.beginPath()
    ctx.moveTo(0, h * 0.7)
    ctx.quadraticCurveTo(w * 0.3, h * 0.65, w * 0.5, h * 0.68)
    ctx.quadraticCurveTo(w * 0.7, h * 0.71, w, h * 0.67)
    ctx.lineTo(w, h)
    ctx.lineTo(0, h)
    ctx.fill()

    // Building silhouettes (old campus)
    ctx.fillStyle = '#0C1F3F'
    // Main building
    ctx.fillRect(w * 0.15, h * 0.35, w * 0.18, h * 0.35)
    // Tower
    ctx.fillRect(w * 0.21, h * 0.22, w * 0.06, h * 0.13)
    // Triangle roof
    ctx.beginPath()
    ctx.moveTo(w * 0.21, h * 0.22)
    ctx.lineTo(w * 0.24, h * 0.15)
    ctx.lineTo(w * 0.27, h * 0.22)
    ctx.fill()
    // Side building
    ctx.fillRect(w * 0.36, h * 0.42, w * 0.12, h * 0.28)
    // Dorm
    ctx.fillRect(w * 0.52, h * 0.45, w * 0.1, h * 0.25)

    // Warm windows (lights on = life inside)
    ctx.fillStyle = '#F59E0B'
    const windows = [
      [0.17, 0.4], [0.2, 0.4], [0.23, 0.4], [0.26, 0.4], [0.29, 0.4],
      [0.17, 0.5], [0.2, 0.5], [0.26, 0.5], [0.29, 0.5],
      [0.17, 0.6], [0.23, 0.6], [0.26, 0.6],
      [0.38, 0.47], [0.41, 0.47], [0.44, 0.47],
      [0.38, 0.55], [0.41, 0.55],
      [0.54, 0.5], [0.57, 0.5],
      [0.54, 0.58], [0.57, 0.58],
    ]
    windows.forEach(([x, y]) => {
      ctx.fillStyle = `rgba(245,158,11,${0.6 + Math.random() * 0.4})`
      ctx.fillRect(w * x, h * y, w * 0.02, h * 0.05)
    })

    // Trees (new growth)
    const drawTree = (x, y, size) => {
      ctx.fillStyle = '#166534'
      ctx.beginPath()
      ctx.arc(w * x, h * y, size * 1.2, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#15803d'
      ctx.beginPath()
      ctx.arc(w * x - size * 0.4, h * y - size * 0.3, size * 0.8, 0, Math.PI * 2)
      ctx.fill()
      // Trunk
      ctx.fillStyle = '#78350f'
      ctx.fillRect(w * x - 1.5, h * y + size * 0.5, 3, size)
    }
    drawTree(0.08, 0.62, 8)
    drawTree(0.68, 0.58, 10)
    drawTree(0.75, 0.6, 7)
    drawTree(0.85, 0.57, 9)
    drawTree(0.92, 0.61, 6)

    // People silhouettes (community gathering)
    ctx.fillStyle = '#00A8A8'
    const people = [
      [0.4, 0.66], [0.43, 0.65], [0.46, 0.67], [0.49, 0.66],
      [0.52, 0.68], [0.55, 0.65], [0.58, 0.67], [0.61, 0.66],
      [0.64, 0.68], [0.37, 0.67],
    ]
    people.forEach(([x, y]) => {
      // Head
      ctx.beginPath()
      ctx.arc(w * x, h * y - 4, 2.5, 0, Math.PI * 2)
      ctx.fill()
      // Body
      ctx.fillRect(w * x - 1.5, h * y - 1, 3, 6)
    })

    // Glowing text area overlay
    const glow = ctx.createRadialGradient(w * 0.5, h * 0.85, 0, w * 0.5, h * 0.85, w * 0.4)
    glow.addColorStop(0, 'rgba(0,168,168,0.15)')
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, w, h)

  }, [])

  return (
    <canvas ref={canvasRef} className="w-full rounded-xl" style={{ height: '220px' }} />
  )
}

// Blog 2: Board meeting — table with empty chairs, one light on
export function BoardNotHearingIllustration() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight

    // Dark room
    const bg = ctx.createRadialGradient(w * 0.5, h * 0.3, 20, w * 0.5, h * 0.3, w * 0.6)
    bg.addColorStop(0, '#1a1a2e')
    bg.addColorStop(1, '#0a0a15')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    // Overhead light cone
    ctx.fillStyle = 'rgba(245,158,11,0.06)'
    ctx.beginPath()
    ctx.moveTo(w * 0.45, h * 0.05)
    ctx.lineTo(w * 0.2, h * 0.95)
    ctx.lineTo(w * 0.8, h * 0.95)
    ctx.lineTo(w * 0.55, h * 0.05)
    ctx.fill()

    // Conference table
    ctx.fillStyle = '#2d1810'
    ctx.beginPath()
    ctx.ellipse(w * 0.5, h * 0.55, w * 0.32, h * 0.12, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#3d2218'
    ctx.beginPath()
    ctx.ellipse(w * 0.5, h * 0.53, w * 0.32, h * 0.12, 0, 0, Math.PI * 2)
    ctx.fill()

    // Chairs (most empty)
    const chairs = [0.18, 0.28, 0.38, 0.48, 0.58, 0.68, 0.78]
    chairs.forEach((x, i) => {
      ctx.fillStyle = i === 3 ? '#0C1F3F' : '#1a1a2e'
      ctx.beginPath()
      ctx.arc(w * x, h * 0.72, 6, 0, Math.PI * 2)
      ctx.fill()
      // Chair back
      ctx.fillRect(w * x - 4, h * 0.72 - 12, 8, 6)
    })

    // One person seated (center chair, lit)
    ctx.fillStyle = '#00A8A8'
    ctx.beginPath()
    ctx.arc(w * 0.48, h * 0.63, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(w * 0.48 - 3, h * 0.67, 6, 8)

    // Papers on table
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.fillRect(w * 0.42, h * 0.48, 12, 8)
    ctx.fillRect(w * 0.56, h * 0.49, 10, 7)
    ctx.fillRect(w * 0.35, h * 0.5, 8, 6)

    // Question mark (floating, glowing)
    ctx.font = 'bold 36px serif'
    ctx.fillStyle = 'rgba(0,168,168,0.3)'
    ctx.textAlign = 'center'
    ctx.fillText('?', w * 0.5, h * 0.3)

    // Subtle glow around the question
    const qGlow = ctx.createRadialGradient(w * 0.5, h * 0.25, 5, w * 0.5, h * 0.25, 40)
    qGlow.addColorStop(0, 'rgba(0,168,168,0.1)')
    qGlow.addColorStop(1, 'transparent')
    ctx.fillStyle = qGlow
    ctx.fillRect(w * 0.3, h * 0.1, w * 0.4, h * 0.35)

  }, [])

  return (
    <canvas ref={canvasRef} className="w-full rounded-xl" style={{ height: '220px' }} />
  )
}

// Blog 3: Split scene — empty building vs alive community campus
export function BuildingsTellingUsIllustration() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight

    // Left half — cold, grey
    ctx.fillStyle = '#1e1e24'
    ctx.fillRect(0, 0, w * 0.5, h)
    // Right half — warm
    ctx.fillStyle = '#12253a'
    ctx.fillRect(w * 0.5, 0, w * 0.5, h)

    // Ground
    ctx.fillStyle = '#2a2a30'
    ctx.fillRect(0, h * 0.72, w * 0.5, h * 0.28)
    ctx.fillStyle = '#1a4a30'
    ctx.fillRect(w * 0.5, h * 0.72, w * 0.5, h * 0.28)

    // LEFT: Empty grey building
    ctx.fillStyle = '#3a3a42'
    ctx.fillRect(w * 0.08, h * 0.3, w * 0.32, h * 0.42)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        ctx.fillStyle = '#1a1a20'
        ctx.fillRect(w * (0.1 + c * 0.07), h * (0.34 + r * 0.12), w * 0.04, h * 0.07)
      }
    }
    ctx.fillStyle = '#8B0000'
    ctx.fillRect(w * 0.16, h * 0.66, w * 0.12, h * 0.04)
    ctx.fillStyle = 'white'
    ctx.font = 'bold 6px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('FOR SALE', w * 0.22, h * 0.688)

    // RIGHT: Same shape, alive
    ctx.fillStyle = '#2a4a5a'
    ctx.fillRect(w * 0.58, h * 0.3, w * 0.32, h * 0.42)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        ctx.fillStyle = 'rgba(245,158,11,' + (0.5 + Math.random() * 0.5) + ')'
        ctx.fillRect(w * (0.6 + c * 0.07), h * (0.34 + r * 0.12), w * 0.04, h * 0.07)
      }
    }
    ctx.fillStyle = '#00A8A8'
    ctx.fillRect(w * 0.62, h * 0.25, w * 0.24, h * 0.04)
    ctx.fillStyle = 'white'
    ctx.fillText('COMMUNITY CAMPUS', w * 0.74, h * 0.278)

    // People on right
    ctx.fillStyle = '#00A8A8';
    [[0.6,0.7],[0.65,0.69],[0.7,0.71],[0.75,0.7],[0.8,0.69],[0.85,0.71]].forEach(function(p) {
      ctx.beginPath(); ctx.arc(w*p[0], h*p[1]-3, 2, 0, Math.PI*2); ctx.fill()
      ctx.fillRect(w*p[0]-1, h*p[1]-1, 2, 5)
    })

    // Trees on right
    ctx.fillStyle = '#166534'
    ctx.beginPath(); ctx.arc(w*0.92, h*0.63, 7, 0, Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.arc(w*0.55, h*0.65, 5, 0, Math.PI*2); ctx.fill()

    // Arrow
    ctx.fillStyle = '#00A8A8'
    ctx.beginPath()
    ctx.moveTo(w*0.47, h*0.5); ctx.lineTo(w*0.53, h*0.47); ctx.lineTo(w*0.53, h*0.49)
    ctx.lineTo(w*0.56, h*0.49); ctx.lineTo(w*0.56, h*0.51); ctx.lineTo(w*0.53, h*0.51)
    ctx.lineTo(w*0.53, h*0.53); ctx.fill()

  }, [])

  return (
    <canvas ref={canvasRef} className="w-full rounded-xl" style={{ height: '220px' }} />
  )
}

// Blog: Carburetor — motorcycle engine with parts highlighted
export function CarburetorIllustration() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    const w = canvas.offsetWidth, h = canvas.offsetHeight
    // Dark garage background
    const bg = ctx.createLinearGradient(0, 0, 0, h)
    bg.addColorStop(0, '#0a0a0a'); bg.addColorStop(1, '#1a1510')
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
    // Warm overhead light
    const light = ctx.createRadialGradient(w*0.4, h*0.1, 5, w*0.4, h*0.4, w*0.4)
    light.addColorStop(0, 'rgba(255,200,100,0.12)'); light.addColorStop(1, 'transparent')
    ctx.fillStyle = light; ctx.fillRect(0, 0, w, h)
    // Workbench surface
    ctx.fillStyle = '#1a1510'; ctx.fillRect(0, h*0.72, w, h*0.3)
    ctx.strokeStyle = 'rgba(200,170,120,0.15)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(0, h*0.72); ctx.lineTo(w, h*0.72); ctx.stroke()
    // Engine block silhouette (center)
    ctx.fillStyle = 'rgba(80,75,65,0.5)'
    ctx.beginPath(); ctx.roundRect(w*0.3, h*0.3, w*0.2, h*0.35, 6); ctx.fill()
    // Cylinder head left
    ctx.fillStyle = 'rgba(70,65,55,0.5)'
    ctx.beginPath(); ctx.roundRect(w*0.15, h*0.38, w*0.15, h*0.15, 4); ctx.fill()
    // Cylinder head right
    ctx.beginPath(); ctx.roundRect(w*0.5, h*0.38, w*0.15, h*0.15, 4); ctx.fill()
    // Fins on cylinders
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = 'rgba(100,90,75,0.3)'; ctx.lineWidth = 0.8
      ctx.beginPath(); ctx.moveTo(w*0.15, h*0.39+i*h*0.028); ctx.lineTo(w*0.3, h*0.39+i*h*0.028); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(w*0.5, h*0.39+i*h*0.028); ctx.lineTo(w*0.65, h*0.39+i*h*0.028); ctx.stroke()
    }
    // CARBURETOR - highlighted with X through it
    ctx.fillStyle = 'rgba(0,168,168,0.3)'; ctx.beginPath(); ctx.roundRect(w*0.36, h*0.25, w*0.08, h*0.1, 3); ctx.fill()
    ctx.strokeStyle = 'rgba(220,60,60,0.7)'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(w*0.36, h*0.25); ctx.lineTo(w*0.44, h*0.35); ctx.moveTo(w*0.44, h*0.25); ctx.lineTo(w*0.36, h*0.35); ctx.stroke()
    // Label: "CARBURETOR" crossed out
    ctx.font = `${w*0.02}px "DM Sans", sans-serif`; ctx.fillStyle = 'rgba(220,60,60,0.5)'; ctx.textAlign = 'center'
    ctx.fillText('CARBURETOR', w*0.4, h*0.22)
    ctx.strokeStyle = 'rgba(220,60,60,0.5)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(w*0.35, h*0.215); ctx.lineTo(w*0.45, h*0.215); ctx.stroke()
    // Actual problems glowing - points (left)
    ctx.fillStyle = 'rgba(0,168,168,0.5)'; ctx.beginPath(); ctx.arc(w*0.12, h*0.45, 4, 0, Math.PI*2); ctx.fill()
    ctx.font = `${w*0.016}px "DM Sans", sans-serif`; ctx.fillStyle = 'rgba(0,168,168,0.5)'; ctx.textAlign = 'right'
    ctx.fillText('points', w*0.1, h*0.44)
    // Vacuum line (top)
    ctx.strokeStyle = 'rgba(0,168,168,0.4)'; ctx.lineWidth = 1.5; ctx.setLineDash([3,3])
    ctx.beginPath(); ctx.moveTo(w*0.32, h*0.35); ctx.lineTo(w*0.25, h*0.55); ctx.stroke()
    ctx.setLineDash([]); ctx.fillStyle = 'rgba(0,168,168,0.5)'; ctx.textAlign = 'left'
    ctx.fillText('vacuum line', w*0.17, h*0.58)
    // Petcock (bottom right)
    ctx.fillStyle = 'rgba(0,168,168,0.5)'; ctx.beginPath(); ctx.arc(w*0.58, h*0.58, 4, 0, Math.PI*2); ctx.fill()
    ctx.fillText('petcock', w*0.61, h*0.59)
    // Ground wire (bottom)
    ctx.strokeStyle = 'rgba(0,168,168,0.3)'; ctx.lineWidth = 1; ctx.setLineDash([2,4])
    ctx.beginPath(); ctx.moveTo(w*0.4, h*0.65); ctx.lineTo(w*0.4, h*0.72); ctx.stroke()
    ctx.setLineDash([]); ctx.fillStyle = 'rgba(0,168,168,0.4)'; ctx.textAlign = 'center'
    ctx.fillText('ground wire', w*0.4, h*0.69)
    // Tools on bench
    ctx.fillStyle = 'rgba(200,170,120,0.15)'
    ctx.fillRect(w*0.7, h*0.75, w*0.06, h*0.02) // wrench
    ctx.fillRect(w*0.78, h*0.74, w*0.02, h*0.06) // screwdriver
    ctx.beginPath(); ctx.arc(w*0.85, h*0.78, w*0.015, 0, Math.PI*2); ctx.fill() // bolt
    // "It's never the carburetor" faint text
    ctx.font = `italic ${w*0.028}px Georgia, serif`; ctx.fillStyle = 'rgba(0,168,168,0.1)'; ctx.textAlign = 'center'
    ctx.fillText("it's never the carburetor", w*0.5, h*0.9)
  }, [])
  return <canvas ref={canvasRef} className="w-full rounded-xl" style={{ height: '220px' }} />
}

// Blog: Ten Questions — boardroom table with spotlight
export function TenQuestionsIllustration() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    const w = canvas.offsetWidth, h = canvas.offsetHeight
    const bg = ctx.createLinearGradient(0, 0, 0, h)
    bg.addColorStop(0, '#0a0e1a'); bg.addColorStop(1, '#141e30')
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
    const spot = ctx.createRadialGradient(w*0.5, h*0.15, 5, w*0.5, h*0.5, w*0.35)
    spot.addColorStop(0, 'rgba(255,220,150,0.15)'); spot.addColorStop(0.5, 'rgba(255,200,100,0.06)'); spot.addColorStop(1, 'transparent')
    ctx.fillStyle = spot; ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#1a2a3a'; ctx.beginPath(); ctx.ellipse(w*0.5, h*0.6, w*0.38, h*0.12, 0, 0, Math.PI*2); ctx.fill()
    ctx.strokeStyle = 'rgba(0,168,168,0.3)'; ctx.lineWidth = 1; ctx.stroke()
    for (let i = 0; i < 10; i++) {
      const angle = (i/10)*Math.PI*2 - Math.PI/2
      const cx = w*0.5 + Math.cos(angle)*w*0.42, cy = h*0.6 + Math.sin(angle)*h*0.18
      ctx.fillStyle = i===0 ? 'rgba(0,168,168,0.6)' : 'rgba(100,120,140,0.3)'
      ctx.beginPath(); ctx.roundRect(cx-8, cy-6, 16, 12, 3); ctx.fill()
      ctx.fillStyle = i===0 ? 'rgba(0,168,168,0.4)' : 'rgba(80,100,120,0.2)'
      ctx.fillRect(cx-6, cy-14, 12, 8)
    }
    ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(w*0.46, h*0.55, w*0.08, h*0.1)
    ctx.font = `bold ${w*0.06}px "DM Sans", sans-serif`; ctx.fillStyle = 'rgba(0,168,168,0.12)'; ctx.textAlign = 'center'; ctx.fillText('10', w*0.5, h*0.38)
    ctx.font = `${w*0.1}px Georgia, serif`; ctx.fillStyle = 'rgba(0,168,168,0.08)'; ctx.fillText('?', w*0.5, h*0.85)
  }, [])
  return <canvas ref={canvasRef} className="w-full rounded-xl" style={{ height: '220px' }} />
}

// Blog: Marygrove — light passing from old building to new school
export function MarygroveTurnedIllustration() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    const w = canvas.offsetWidth, h = canvas.offsetHeight
    const sky = ctx.createLinearGradient(0, 0, w, 0)
    sky.addColorStop(0, '#0a0a1a'); sky.addColorStop(0.4, '#121830'); sky.addColorStop(0.7, '#1a3050'); sky.addColorStop(1, '#2a4a60')
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h)
    const dawn = ctx.createRadialGradient(w*0.9, h*0.5, 10, w*0.9, h*0.5, w*0.45)
    dawn.addColorStop(0, 'rgba(0,168,168,0.2)'); dawn.addColorStop(0.5, 'rgba(0,168,168,0.06)'); dawn.addColorStop(1, 'transparent')
    ctx.fillStyle = dawn; ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#0f1f18'; ctx.fillRect(0, h*0.7, w, h*0.3)
    ctx.fillStyle = 'rgba(60,50,40,0.5)'; ctx.fillRect(w*0.08, h*0.35, w*0.18, h*0.35)
    ctx.fillRect(w*0.14, h*0.22, w*0.06, h*0.13)
    ctx.strokeStyle = 'rgba(200,180,140,0.3)'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(w*0.17, h*0.16); ctx.lineTo(w*0.17, h*0.22); ctx.moveTo(w*0.155, h*0.18); ctx.lineTo(w*0.185, h*0.18); ctx.stroke()
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(w*0.1+c*w*0.05, h*0.4+r*h*0.08, w*0.03, h*0.05) }
    const beam = ctx.createLinearGradient(w*0.3, h*0.5, w*0.6, h*0.5)
    beam.addColorStop(0, 'rgba(200,180,140,0.08)'); beam.addColorStop(0.5, 'rgba(0,168,168,0.15)'); beam.addColorStop(1, 'rgba(0,168,168,0.08)')
    ctx.fillStyle = beam; ctx.beginPath(); ctx.moveTo(w*0.28, h*0.48); ctx.lineTo(w*0.62, h*0.44); ctx.lineTo(w*0.62, h*0.56); ctx.lineTo(w*0.28, h*0.52); ctx.closePath(); ctx.fill()
    ctx.fillStyle = 'rgba(0,168,168,0.25)'; ctx.fillRect(w*0.62, h*0.32, w*0.25, h*0.38)
    ctx.beginPath(); ctx.moveTo(w*0.6, h*0.32); ctx.lineTo(w*0.745, h*0.24); ctx.lineTo(w*0.89, h*0.32); ctx.closePath(); ctx.fillStyle = 'rgba(0,168,168,0.15)'; ctx.fill()
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { ctx.fillStyle = 'rgba(255,220,100,0.15)'; ctx.fillRect(w*0.64+c*w*0.055, h*0.37+r*h*0.08, w*0.035, h*0.05) }
    for (let i = 0; i < 5; i++) { ctx.fillStyle = 'rgba(0,168,168,0.4)'; const fx = w*0.5+i*w*0.03; ctx.beginPath(); ctx.arc(fx, h*0.66, 2, 0, Math.PI*2); ctx.fill(); ctx.fillRect(fx-1, h*0.668, 2, 5) }
  }, [])
  return <canvas ref={canvasRef} className="w-full rounded-xl" style={{ height: '220px' }} />
}

// Blog: Iowa Wesleyan — enrollment up, revenue cracking
export function IowaWesleyanIllustration() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    const w = canvas.offsetWidth, h = canvas.offsetHeight
    const bg = ctx.createLinearGradient(0, 0, 0, h)
    bg.addColorStop(0, '#0a0e1a'); bg.addColorStop(1, '#141828')
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = 'rgba(100,120,150,0.08)'; ctx.lineWidth = 0.5
    for (let i = 1; i < 8; i++) { ctx.beginPath(); ctx.moveTo(w*0.1, h*(i/8)); ctx.lineTo(w*0.9, h*(i/8)); ctx.stroke() }
    const pts = [[0.15,0.65],[0.25,0.6],[0.35,0.58],[0.45,0.52],[0.55,0.48],[0.65,0.42],[0.72,0.38]]
    ctx.strokeStyle = 'rgba(80,200,120,0.6)'; ctx.lineWidth = 2.5; ctx.beginPath()
    pts.forEach(([x,y],i) => { if(i===0) ctx.moveTo(w*x,h*y); else ctx.lineTo(w*x,h*y) }); ctx.stroke()
    ctx.strokeStyle = 'rgba(220,60,60,0.7)'; ctx.lineWidth = 2; ctx.beginPath()
    ctx.moveTo(w*0.72,h*0.38); ctx.lineTo(w*0.76,h*0.55); ctx.lineTo(w*0.74,h*0.62); ctx.lineTo(w*0.78,h*0.75); ctx.lineTo(w*0.82,h*0.82); ctx.stroke()
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(w*0.76,h*0.55); ctx.lineTo(w*0.82,h*0.52); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(w*0.74,h*0.62); ctx.lineTo(w*0.7,h*0.68); ctx.stroke()
    ctx.strokeStyle = 'rgba(220,60,60,0.5)'; ctx.lineWidth = 3
    ctx.beginPath(); ctx.moveTo(w*0.8,h*0.78); ctx.lineTo(w*0.86,h*0.86); ctx.moveTo(w*0.86,h*0.78); ctx.lineTo(w*0.8,h*0.86); ctx.stroke()
    ctx.font = `${w*0.025}px "DM Sans", sans-serif`; ctx.fillStyle = 'rgba(80,200,120,0.4)'; ctx.textAlign = 'left'; ctx.fillText('ENROLLMENT', w*0.12, h*0.18)
    ctx.fillStyle = 'rgba(220,60,60,0.4)'; ctx.textAlign = 'right'; ctx.fillText('NET REVENUE', w*0.88, h*0.18)
    ctx.strokeStyle = 'rgba(220,60,60,0.4)'; ctx.lineWidth = 1.5; ctx.setLineDash([4,3]); ctx.beginPath()
    ctx.moveTo(w*0.15,h*0.4); ctx.lineTo(w*0.35,h*0.45); ctx.lineTo(w*0.55,h*0.55); ctx.lineTo(w*0.72,h*0.65); ctx.stroke(); ctx.setLineDash([])
    ctx.font = `${w*0.018}px "DM Sans", sans-serif`; ctx.fillStyle = 'rgba(150,160,180,0.3)'; ctx.textAlign = 'center'
    ;['2016','2018','2019','2022','2023'].forEach((yr,i) => ctx.fillText(yr, w*(0.15+i*0.15), h*0.92))
  }, [])
  return <canvas ref={canvasRef} className="w-full rounded-xl" style={{ height: '220px' }} />
}
