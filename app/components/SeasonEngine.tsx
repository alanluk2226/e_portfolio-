'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

type Season = 'sky' | 'spring' | 'summer' | 'autumn' | 'winter' | 'void'

const SEASON_DURATION = 18000
const SEASONS: Season[] = ['sky', 'spring', 'summer', 'autumn', 'winter', 'void']

const SEASON_THEMES: Record<Season, Record<string, string>> = {
  sky:    { '--accent':'#76c7f0','--card-bg':'rgba(13,43,94,0.55)','--card-border':'rgba(91,164,245,0.25)','--tag-bg':'rgba(91,164,245,0.15)','--tag-color':'#76c7f0','--tag-border':'rgba(91,164,245,0.3)','--btn-primary':'linear-gradient(135deg,#2d7dd2,#5ba4f5)','--section-line':'linear-gradient(90deg,#2d7dd2,#76c7f0)' },
  spring: { '--accent':'#f9a8d4','--card-bg':'rgba(80,20,60,0.50)','--card-border':'rgba(249,168,212,0.25)','--tag-bg':'rgba(249,168,212,0.15)','--tag-color':'#f9a8d4','--tag-border':'rgba(249,168,212,0.35)','--btn-primary':'linear-gradient(135deg,#db2777,#f9a8d4)','--section-line':'linear-gradient(90deg,#db2777,#f9a8d4)' },
  summer: { '--accent':'#67e8f9','--card-bg':'rgba(10,40,60,0.55)','--card-border':'rgba(103,232,249,0.25)','--tag-bg':'rgba(103,232,249,0.12)','--tag-color':'#67e8f9','--tag-border':'rgba(103,232,249,0.3)','--btn-primary':'linear-gradient(135deg,#0891b2,#67e8f9)','--section-line':'linear-gradient(90deg,#0891b2,#67e8f9)' },
  autumn: { '--accent':'#fbbf24','--card-bg':'rgba(60,25,5,0.55)','--card-border':'rgba(251,191,36,0.25)','--tag-bg':'rgba(251,191,36,0.12)','--tag-color':'#fbbf24','--tag-border':'rgba(251,191,36,0.3)','--btn-primary':'linear-gradient(135deg,#b45309,#fbbf24)','--section-line':'linear-gradient(90deg,#b45309,#fbbf24)' },
  winter: { '--accent':'#bae6fd','--card-bg':'rgba(10,20,40,0.60)','--card-border':'rgba(186,230,253,0.25)','--tag-bg':'rgba(186,230,253,0.12)','--tag-color':'#bae6fd','--tag-border':'rgba(186,230,253,0.3)','--btn-primary':'linear-gradient(135deg,#0369a1,#bae6fd)','--section-line':'linear-gradient(90deg,#0369a1,#bae6fd)' },
  void:   { '--accent':'#c084fc','--card-bg':'rgba(5,0,15,0.75)','--card-border':'rgba(192,132,252,0.25)','--tag-bg':'rgba(192,132,252,0.12)','--tag-color':'#c084fc','--tag-border':'rgba(192,132,252,0.3)','--btn-primary':'linear-gradient(135deg,#7c3aed,#c084fc)','--section-line':'linear-gradient(90deg,#7c3aed,#c084fc)' },
}

const SKY_GRADIENTS: Record<Season, string> = {
  sky:    'linear-gradient(180deg,#0a1628 0%,#0d2b5e 30%,#1a6abf 55%,#e8f4ff 75%,#b8d9f5 88%,#1a6abf 100%)',
  spring: 'linear-gradient(180deg,#1a0a2e 0%,#4a1060 25%,#c2185b 55%,#fce4ec 75%,#f8bbd0 88%,#c2185b 100%)',
  summer: 'linear-gradient(180deg,#001a2e 0%,#01579b 30%,#0288d1 55%,#b3e5fc 72%,#4fc3f7 85%,#01579b 100%)',
  autumn: 'linear-gradient(180deg,#1a0a00 0%,#5d2e00 25%,#bf6000 50%,#ffcc80 72%,#ffa726 85%,#bf6000 100%)',
  winter: 'linear-gradient(180deg,#050d1a 0%,#0a1628 25%,#1a3a5c 50%,#e8f4ff 72%,#cce8ff 85%,#1a3a5c 100%)',
  void:   'linear-gradient(180deg,#000000 0%,#05000f 40%,#0a0020 70%,#000000 100%)',
}

interface CloudDef { x: number; y: number; scale: number; tint: string }

function drawCloud(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, tint: string) {
  const puffs = [
    { ox: 0, oy: 0, r: 52*scale }, { ox: 60*scale, oy: 5, r: 46*scale }, { ox: -60*scale, oy: 5, r: 44*scale },
    { ox: 110*scale, oy: 12, r: 36*scale }, { ox: -110*scale, oy: 12, r: 34*scale },
    { ox: 150*scale, oy: 22, r: 26*scale }, { ox: -148*scale, oy: 22, r: 24*scale },
    { ox: -20*scale, oy: -38*scale, r: 42*scale }, { ox: 35*scale, oy: -48*scale, r: 36*scale },
    { ox: -65*scale, oy: -28*scale, r: 30*scale }, { ox: 80*scale, oy: -32*scale, r: 28*scale },
    { ox: 10*scale, oy: -68*scale, r: 26*scale },
  ]
  puffs.forEach(p => {
    ctx.beginPath(); ctx.arc(cx+p.ox, cy+p.oy+p.r*0.18, p.r, 0, Math.PI*2)
    ctx.fillStyle = tint.replace('0.9','0.12'); ctx.fill()
  })
  puffs.forEach(p => {
    const g = ctx.createRadialGradient(cx+p.ox-p.r*0.2, cy+p.oy-p.r*0.25, p.r*0.05, cx+p.ox, cy+p.oy, p.r)
    g.addColorStop(0, tint); g.addColorStop(0.6, tint.replace('0.9','0.75')); g.addColorStop(1, tint.replace('0.9','0.0'))
    ctx.beginPath(); ctx.arc(cx+p.ox, cy+p.oy, p.r, 0, Math.PI*2); ctx.fillStyle = g; ctx.fill()
  })
}

function drawClouds(ctx: CanvasRenderingContext2D, _w: number, _h: number, _t: number, clouds: CloudDef[]) {
  clouds.forEach(c => drawCloud(ctx, c.x, c.y, c.scale, c.tint))
}

function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.clearRect(0,0,w,h)
  drawClouds(ctx,w,h,t,[
    { x:((t*0.3)%(w+500))-500, y:h*0.18, scale:0.9, tint:'rgba(255,255,255,0.9)' },
    { x:((t*0.18+300)%(w+500))-500, y:h*0.42, scale:0.65, tint:'rgba(255,255,255,0.85)' },
    { x:((t*0.25+600)%(w+500))-500, y:h*0.62, scale:1.1, tint:'rgba(255,255,255,0.88)' },
    { x:((t*0.15+900)%(w+500))-500, y:h*0.78, scale:0.55, tint:'rgba(255,255,255,0.80)' },
  ])
}

interface Particle { x:number; y:number; vx:number; vy:number; size:number; opacity:number; color?:string; angle?:number; swing?:number; swingSpeed?:number }

function initParticles(count: number, w: number, h: number, season: Season): Particle[] {
  return Array.from({ length: count }, () => {
    if (season==='spring') return { x:Math.random()*w, y:Math.random()*h-h, vx:(Math.random()-0.5)*1.5, vy:Math.random()*1.5+0.8, size:Math.random()*8+5, opacity:Math.random()*0.7+0.3, color:['#ffb7c5','#ff8fab','#ffc8dd','#ffafcc','#f9a8d4'][Math.floor(Math.random()*5)], angle:Math.random()*Math.PI*2, swing:Math.random()*30+10, swingSpeed:Math.random()*0.02+0.01 }
    if (season==='summer') return { x:Math.random()*w, y:Math.random()*h-h, vx:(Math.random()-0.5)*0.5, vy:Math.random()*12+8, size:Math.random()*1.5+0.5, opacity:Math.random()*0.5+0.3, color:'#a8d8f0' }
    if (season==='autumn') return { x:Math.random()*w, y:Math.random()*h-h, vx:(Math.random()-0.5)*2, vy:Math.random()*1.2+0.5, size:Math.random()*10+6, opacity:Math.random()*0.8+0.2, color:['#ff6b35','#f7931e','#ffd700','#ff4500','#dc143c','#8b4513'][Math.floor(Math.random()*6)], angle:Math.random()*Math.PI*2, swing:Math.random()*40+20, swingSpeed:Math.random()*0.03+0.01 }
    if (season==='winter') return { x:Math.random()*w, y:Math.random()*h, vx:(Math.random()-0.5)*0.8, vy:Math.random()*1.5+0.3, size:Math.random()*4+1, opacity:Math.random()*0.8+0.2, swing:Math.random()*20+5, swingSpeed:Math.random()*0.02+0.005, angle:Math.random()*Math.PI*2 }
    if (season==='void') return { x:Math.random()*w, y:Math.random()*h, vx:0, vy:0, size:Math.random()*2+0.3, opacity:Math.random()*0.9+0.1, color:['#ffffff','#e0d0ff','#c084fc','#a5b4fc','#f0e6ff'][Math.floor(Math.random()*5)], swingSpeed:Math.random()*0.04+0.01 }
    return { x:0, y:0, vx:0, vy:0, size:0, opacity:0 }
  })
}

function drawSpring(ctx: CanvasRenderingContext2D, particles: Particle[], w: number, h: number, t: number) {
  ctx.clearRect(0,0,w,h)
  drawClouds(ctx,w,h,t,[
    { x:((t*0.25)%(w+500))-500, y:h*0.16, scale:0.8, tint:'rgba(255,210,225,0.9)' },
    { x:((t*0.15+400)%(w+500))-500, y:h*0.44, scale:0.6, tint:'rgba(255,200,220,0.85)' },
    { x:((t*0.2+700)%(w+500))-500, y:h*0.65, scale:0.95, tint:'rgba(255,215,230,0.88)' },
  ])
  particles.forEach(p => {
    ctx.save(); ctx.globalAlpha=p.opacity; ctx.translate(p.x,p.y); ctx.rotate(p.angle!+t*p.swingSpeed!)
    ctx.beginPath()
    for (let i=0;i<5;i++) { const a=(i/5)*Math.PI*2; const r=p.size; ctx.ellipse(Math.cos(a)*r*0.5,Math.sin(a)*r*0.5,r*0.6,r*0.3,a,0,Math.PI*2) }
    ctx.fillStyle=p.color!; ctx.fill(); ctx.restore()
  })
}

function drawSummer(ctx: CanvasRenderingContext2D, particles: Particle[], w: number, h: number, t: number, lightning: {active:boolean;x:number;opacity:number}) {
  ctx.clearRect(0,0,w,h)
  drawClouds(ctx,w,h,t,[
    { x:((t*0.2)%(w+500))-500, y:h*0.06, scale:1.3, tint:'rgba(60,70,100,0.92)' },
    { x:((t*0.12+300)%(w+500))-500, y:h*0.14, scale:1.0, tint:'rgba(50,60,90,0.88)' },
    { x:((t*0.17+600)%(w+500))-500, y:h*0.20, scale:1.5, tint:'rgba(55,65,95,0.90)' },
    { x:((t*0.09+900)%(w+500))-500, y:h*0.10, scale:0.9, tint:'rgba(45,55,85,0.85)' },
  ])
  particles.forEach(p => { ctx.save(); ctx.globalAlpha=p.opacity; ctx.strokeStyle=p.color!; ctx.lineWidth=p.size; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p.x+p.vx*2,p.y+18); ctx.stroke(); ctx.restore() })
  if (lightning.active && lightning.opacity>0) {
    ctx.save(); ctx.globalAlpha=lightning.opacity*0.9; ctx.strokeStyle='#fffde7'; ctx.lineWidth=3; ctx.shadowColor='#fff176'; ctx.shadowBlur=30
    const lx=lightning.x; ctx.beginPath(); ctx.moveTo(lx,0); ctx.lineTo(lx-20,h*0.2); ctx.lineTo(lx+15,h*0.35); ctx.lineTo(lx-10,h*0.5); ctx.lineTo(lx+8,h*0.65); ctx.lineTo(lx-5,h*0.8); ctx.stroke()
    ctx.globalAlpha=lightning.opacity*0.15; ctx.fillStyle='#fffde7'; ctx.fillRect(0,0,w,h); ctx.restore()
  }
}

function drawAutumn(ctx: CanvasRenderingContext2D, particles: Particle[], w: number, h: number, t: number) {
  ctx.clearRect(0,0,w,h)
  drawClouds(ctx,w,h,t,[
    { x:((t*0.22)%(w+500))-500, y:h*0.18, scale:0.85, tint:'rgba(255,185,100,0.75)' },
    { x:((t*0.14+350)%(w+500))-500, y:h*0.44, scale:0.7, tint:'rgba(255,175,90,0.70)' },
    { x:((t*0.18+700)%(w+500))-500, y:h*0.65, scale:1.0, tint:'rgba(255,190,110,0.72)' },
  ])
  particles.forEach(p => {
    ctx.save(); ctx.globalAlpha=p.opacity; ctx.translate(p.x,p.y); ctx.rotate(p.angle!+t*p.swingSpeed!)
    ctx.beginPath(); ctx.moveTo(0,-p.size); ctx.bezierCurveTo(p.size*0.8,-p.size*0.5,p.size*0.8,p.size*0.5,0,p.size); ctx.bezierCurveTo(-p.size*0.8,p.size*0.5,-p.size*0.8,-p.size*0.5,0,-p.size)
    ctx.fillStyle=p.color!; ctx.fill(); ctx.restore()
  })
}

function drawWinter(ctx: CanvasRenderingContext2D, particles: Particle[], w: number, h: number, t: number) {
  ctx.clearRect(0,0,w,h)
  drawClouds(ctx,w,h,t,[
    { x:((t*0.18)%(w+500))-500, y:h*0.14, scale:0.9, tint:'rgba(210,235,255,0.88)' },
    { x:((t*0.12+400)%(w+500))-500, y:h*0.38, scale:0.7, tint:'rgba(200,228,255,0.82)' },
    { x:((t*0.15+750)%(w+500))-500, y:h*0.60, scale:1.1, tint:'rgba(215,238,255,0.85)' },
  ])
  particles.forEach(p => {
    const sway=Math.sin(t*p.swingSpeed!+p.x)*p.swing!
    ctx.save(); ctx.globalAlpha=p.opacity; ctx.translate(p.x+sway,p.y); ctx.rotate(t*0.01)
    ctx.strokeStyle='#e0f2fe'; ctx.lineWidth=p.size>3?1.5:1
    for (let i=0;i<6;i++) { ctx.save(); ctx.rotate((i/6)*Math.PI*2); ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,p.size); ctx.moveTo(0,p.size*0.4); ctx.lineTo(p.size*0.25,p.size*0.65); ctx.moveTo(0,p.size*0.4); ctx.lineTo(-p.size*0.25,p.size*0.65); ctx.stroke(); ctx.restore() }
    ctx.restore()
  })
}

function drawVoid(ctx: CanvasRenderingContext2D, particles: Particle[], w: number, h: number, t: number) {
  ctx.clearRect(0, 0, w, h)
  const cx = w / 2, cy = h / 2
  const bhBase = Math.min(w, h) * 0.12

  // Writhing black hole: radius pulses with multiple sine waves
  const writhe = 1 + 0.04 * Math.sin(t * 0.08) + 0.025 * Math.sin(t * 0.13 + 1.2) + 0.015 * Math.sin(t * 0.21 + 2.4)
  const bhR = bhBase * writhe

  // Starfield
  particles.forEach(p => {
    ctx.save()
    ctx.globalAlpha = p.opacity * (0.5 + 0.5 * Math.sin(t * (p.swingSpeed || 0.02) + p.x))
    ctx.fillStyle = p.color!
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  })

  // Outer nebula wisps
  const wisps = [
    { ox: -w*0.28, oy: -h*0.18, r: w*0.22 },
    { ox:  w*0.30, oy:  h*0.20, r: w*0.18 },
    { ox: -w*0.20, oy:  h*0.25, r: w*0.16 },
    { ox:  w*0.22, oy: -h*0.22, r: w*0.20 },
    { ox:  0,      oy: -h*0.30, r: w*0.14 },
  ]
  wisps.forEach((wisp, i) => {
    const pulse = 0.06 + 0.03 * Math.sin(t * 0.008 + i)
    const g = ctx.createRadialGradient(cx+wisp.ox, cy+wisp.oy, 0, cx+wisp.ox, cy+wisp.oy, wisp.r)
    g.addColorStop(0, `rgba(180,150,255,${pulse})`)
    g.addColorStop(0.5, `rgba(100,80,180,${pulse * 0.5})`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath(); ctx.arc(cx+wisp.ox, cy+wisp.oy, wisp.r, 0, Math.PI*2)
    ctx.fillStyle = g; ctx.fill()
  })

  // Accretion disk rings
  const diskLayers = [
    { r: bhR * 2.8, bw: bhR * 0.9, alpha: 0.18, color: '#ffffff' },
    { r: bhR * 2.2, bw: bhR * 0.7, alpha: 0.28, color: '#e0d0ff' },
    { r: bhR * 1.7, bw: bhR * 0.5, alpha: 0.40, color: '#c084fc' },
    { r: bhR * 1.4, bw: bhR * 0.35, alpha: 0.55, color: '#ffffff' },
  ]
  diskLayers.forEach(layer => {
    const g = ctx.createRadialGradient(cx, cy, layer.r - layer.bw, cx, cy, layer.r + layer.bw)
    const a1 = Math.round(layer.alpha * 255).toString(16).padStart(2,'0')
    const a2 = Math.round(Math.min(layer.alpha * 1.8, 1) * 255).toString(16).padStart(2,'0')
    g.addColorStop(0, 'rgba(0,0,0,0)')
    g.addColorStop(0.4, layer.color + a1)
    g.addColorStop(0.5, layer.color + a2)
    g.addColorStop(0.6, layer.color + a1)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath(); ctx.arc(cx, cy, layer.r + layer.bw, 0, Math.PI * 2)
    ctx.fillStyle = g; ctx.fill()
  })

  // Spiral nebula arms
  for (let arm = 0; arm < 6; arm++) {
    const baseAngle = (arm / 6) * Math.PI * 2 + t * 0.004
    ctx.save(); ctx.globalAlpha = 0.12
    for (let i = 0; i < 60; i++) {
      const frac = i / 60
      const r = bhR * 1.3 + frac * bhR * 3.5
      const angle = baseAngle + frac * Math.PI * 1.8
      const x = cx + Math.cos(angle) * r
      const y = cy + Math.sin(angle) * r * 0.55
      const size = (1 - frac) * bhR * 0.35 + 2
      const g = ctx.createRadialGradient(x, y, 0, x, y, size)
      g.addColorStop(0, 'rgba(220,200,255,0.9)'); g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill()
    }
    ctx.restore()
  }

  // Gravitational lensing ring
  const lensGlow = ctx.createRadialGradient(cx, cy, bhR * 0.9, cx, cy, bhR * 1.5)
  lensGlow.addColorStop(0, 'rgba(255,255,255,0)')
  lensGlow.addColorStop(0.6, 'rgba(220,200,255,0.55)')
  lensGlow.addColorStop(0.85, 'rgba(255,255,255,0.75)')
  lensGlow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.beginPath(); ctx.arc(cx, cy, bhR * 1.5, 0, Math.PI * 2); ctx.fillStyle = lensGlow; ctx.fill()

  // Writhing event horizon — drawn as a warped polygon instead of perfect circle
  ctx.save()
  ctx.beginPath()
  const segments = 64
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    // Each point on the horizon writhes independently
    const warp = 1
      + 0.035 * Math.sin(angle * 3 + t * 0.09)
      + 0.025 * Math.sin(angle * 5 - t * 0.13)
      + 0.018 * Math.sin(angle * 7 + t * 0.17)
      + 0.012 * Math.sin(angle * 11 - t * 0.07)
    const r = bhR * warp
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = '#000000'
  ctx.fill()
  // Writhing glow edge
  ctx.shadowColor = '#7c3aed'
  ctx.shadowBlur = 18
  ctx.strokeStyle = 'rgba(160,100,255,0.5)'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.restore()

  // Orbiting hot spot
  const hotAngle = t * 0.012
  const hotX = cx + Math.cos(hotAngle) * bhR * 1.18
  const hotY = cy + Math.sin(hotAngle) * bhR * 0.65
  const hotG = ctx.createRadialGradient(hotX, hotY, 0, hotX, hotY, bhR * 0.4)
  hotG.addColorStop(0, 'rgba(255,255,255,0.9)')
  hotG.addColorStop(0.4, 'rgba(200,180,255,0.5)')
  hotG.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.beginPath(); ctx.arc(hotX, hotY, bhR * 0.4, 0, Math.PI * 2); ctx.fillStyle = hotG; ctx.fill()
}

interface WipeParticle { x:number; y:number; vx:number; vy:number; size:number; opacity:number; color:string; life:number; maxLife:number }

const SEASON_COLORS: Record<Season, string[]> = {
  sky:    ['#76c7f0','#b8d9f5','#ffffff','#5ba4f5'],
  spring: ['#f9a8d4','#fce7f3','#fbcfe8','#ec4899','#ffffff'],
  summer: ['#67e8f9','#fff176','#ffffff','#b3e5fc','#aaaaff'],
  autumn: ['#fbbf24','#f97316','#ef4444','#dc2626','#fde68a'],
  winter: ['#bae6fd','#e0f2fe','#ffffff','#7dd3fc','#dbeafe'],
  void:   ['#c084fc','#a855f7','#ffffff','#e879f9','#7c3aed'],
}

function spawnWipeParticles(cx: number, cy: number, season: Season, count: number, dir?: 'left'|'right'|'up'|'down'): WipeParticle[] {
  const colors = SEASON_COLORS[season]
  return Array.from({ length: count }, () => {
    const life = Math.random()*45+25
    let vx: number, vy: number
    if (dir==='left')  { vx=-(Math.random()*7+2); vy=(Math.random()-0.5)*3 }
    else if (dir==='right') { vx=Math.random()*7+2; vy=(Math.random()-0.5)*3 }
    else if (dir==='up')    { vx=(Math.random()-0.5)*4; vy=-(Math.random()*6+2) }
    else if (dir==='down')  { vx=(Math.random()-0.5)*4; vy=Math.random()*6+2 }
    else { const a=Math.random()*Math.PI*2; const s=Math.random()*6+2; vx=Math.cos(a)*s; vy=Math.sin(a)*s }
    return { x:cx, y:cy, vx, vy, size:Math.random()*5+2, opacity:1, color:colors[Math.floor(Math.random()*colors.length)], life, maxLife:life }
  })
}

export default function SeasonEngine() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const wipeRef    = useRef<HTMLCanvasElement>(null)
  const [season, setSeason]       = useState<Season>('sky')
  const [bgSeason, setBgSeason]   = useState<Season>('sky')
  const [isWiping, setIsWiping]   = useState(false)
  const particlesRef  = useRef<Particle[]>([])
  const lightningRef  = useRef({ active:false, x:0, opacity:0 })
  const animRef       = useRef<number>(0)
  const wipeAnimRef   = useRef<number>(0)
  const tRef          = useRef(0)
  const seasonIndexRef = useRef(0)

  const applyTheme = useCallback((s: Season) => {
    const root = document.documentElement
    Object.entries(SEASON_THEMES[s]).forEach(([k,v]) => root.style.setProperty(k,v))
  }, [])

  const runWipe = useCallback((nextSeason: Season) => {
    const canvas = wipeRef.current
    if (!canvas || isWiping) return
    canvas.width = window.innerWidth; canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d')!
    const w = canvas.width; const h = canvas.height

    setIsWiping(true)

    // VOID gets its own special transition: distortion ripple -> collapse -> void
    if (nextSeason === 'void') {
      let frame = 0; let switched = false
      // PHASE 1 (0-40):  ripple distortion rings expand from center
      // PHASE 2 (35-65): black collapse circle grows from center outward
      // PHASE 3 (55):    season switches
      // PHASE 4 (65-100):collapse circle covers full screen, then void revealed
      const TOTAL = 110

      const tick = () => {
        ctx.clearRect(0, 0, w, h); frame++
        const cx = w / 2, cy = h / 2

        // Distortion ripple rings
        if (frame <= 55) {
          const numRings = 5
          for (let r = 0; r < numRings; r++) {
            const delay = r * 8
            if (frame < delay) continue
            const progress = Math.min((frame - delay) / 40, 1)
            const radius = progress * Math.max(w, h) * 0.7
            const alpha = (1 - progress) * 0.6
            ctx.save()
            ctx.globalAlpha = alpha
            ctx.strokeStyle = r % 2 === 0 ? '#c084fc' : '#ffffff'
            ctx.lineWidth = 2 - progress * 1.5
            ctx.shadowColor = '#c084fc'
            ctx.shadowBlur = 15
            ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke()
            ctx.restore()
          }
          // Distortion shimmer at center
          const shimmerR = 60 + 20 * Math.sin(frame * 0.3)
          const sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, shimmerR)
          sg.addColorStop(0, 'rgba(192,132,252,0.4)')
          sg.addColorStop(0.5, 'rgba(124,58,237,0.2)')
          sg.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.beginPath(); ctx.arc(cx, cy, shimmerR, 0, Math.PI*2); ctx.fillStyle = sg; ctx.fill()
        }

        // Black collapse circle grows from center
        if (frame >= 35) {
          const collapseProgress = Math.min((frame - 35) / 45, 1)
          const eased = 1 - Math.pow(1 - collapseProgress, 3)
          const collapseR = eased * Math.sqrt(w*w + h*h)

          // Purple glow edge of collapse
          const edgeGlow = ctx.createRadialGradient(cx, cy, collapseR * 0.88, cx, cy, collapseR)
          edgeGlow.addColorStop(0, 'rgba(0,0,0,0)')
          edgeGlow.addColorStop(0.5, 'rgba(160,80,255,0.7)')
          edgeGlow.addColorStop(0.8, 'rgba(255,255,255,0.5)')
          edgeGlow.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.beginPath(); ctx.arc(cx, cy, collapseR, 0, Math.PI*2); ctx.fillStyle = edgeGlow; ctx.fill()

          // Black fill
          ctx.beginPath(); ctx.arc(cx, cy, collapseR * 0.92, 0, Math.PI*2)
          ctx.fillStyle = '#000000'; ctx.fill()

          // Particle sparks sucked inward along the edge
          if (frame % 2 === 0 && collapseProgress < 0.95) {
            for (let i = 0; i < 4; i++) {
              const a = Math.random() * Math.PI * 2
              const px = cx + Math.cos(a) * collapseR * 0.95
              const py = cy + Math.sin(a) * collapseR * 0.95
              ctx.save()
              ctx.globalAlpha = 0.8
              ctx.fillStyle = ['#c084fc','#ffffff','#a855f7'][Math.floor(Math.random()*3)]
              ctx.beginPath(); ctx.arc(px, py, Math.random()*3+1, 0, Math.PI*2); ctx.fill()
              ctx.restore()
            }
          }
        }

        // Switch season when collapse covers screen
        if (frame === 55 && !switched) {
          switched = true; setSeason(nextSeason); setBgSeason(nextSeason); applyTheme(nextSeason)
        }

        if (frame < TOTAL) { wipeAnimRef.current = requestAnimationFrame(tick) }
        else { ctx.clearRect(0, 0, w, h); setIsWiping(false) }
      }
      wipeAnimRef.current = requestAnimationFrame(tick)
      return
    }

    // VOID EXIT: black hole expands and swallows everything
    if (season === 'void') {
      let frame = 0; let switched = false
      // PHASE 1 (0-30):  black hole pulses and grows slightly, screen shakes
      // PHASE 2 (25-80): event horizon expands from center, engulfing the screen
      // PHASE 3 (65):    season switches under the expanding black
      // PHASE 4 (80-110):purple glow edge fades, new scene revealed
      const TOTAL = 115

      const easeIn = (t: number) => t * t * t  // accelerate into the void

      const tick = () => {
        ctx.clearRect(0, 0, w, h); frame++
        const cx = w / 2, cy = h / 2
        const maxR = Math.sqrt(w * w + h * h)

        // Phase 1: pulsing glow before expansion
        if (frame <= 30) {
          const pulse = Math.sin(frame * 0.35) * 0.5 + 0.5
          const glowR = 80 + pulse * 40
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR * 3)
          g.addColorStop(0, `rgba(192,132,252,${0.5 + pulse * 0.3})`)
          g.addColorStop(0.4, `rgba(124,58,237,${0.2 + pulse * 0.15})`)
          g.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.beginPath(); ctx.arc(cx, cy, glowR * 3, 0, Math.PI * 2)
          ctx.fillStyle = g; ctx.fill()

          // Small black circle pulsing
          ctx.beginPath(); ctx.arc(cx, cy, glowR * (0.8 + pulse * 0.2), 0, Math.PI * 2)
          ctx.fillStyle = '#000000'; ctx.fill()
        }

        // Phase 2: black hole expands outward
        if (frame >= 25) {
          const progress = Math.min((frame - 25) / 55, 1)
          const expandR = easeIn(progress) * maxR * 1.05

          // Fade out the black overlay after season switch
          const fadeOut = frame > 65 ? Math.max(0, 1 - (frame - 65) / 40) : 1

          // Writhing glow edge — purple ring at the expanding boundary
          if (expandR > 0 && fadeOut > 0) {
            const edgeW = Math.max(8, 40 * (1 - progress))
            const innerR = Math.max(0, expandR - edgeW * 2)
            const edgeG = ctx.createRadialGradient(cx, cy, innerR, cx, cy, expandR + edgeW)
            edgeG.addColorStop(0, 'rgba(0,0,0,0)')
            edgeG.addColorStop(0.4, `rgba(160,80,255,${0.8 * (1 - progress * 0.5) * fadeOut})`)
            edgeG.addColorStop(0.7, `rgba(255,255,255,${0.6 * (1 - progress * 0.6) * fadeOut})`)
            edgeG.addColorStop(1, 'rgba(0,0,0,0)')
            ctx.beginPath(); ctx.arc(cx, cy, expandR + edgeW, 0, Math.PI * 2)
            ctx.fillStyle = edgeG; ctx.fill()

            // Particle sparks at the expanding edge
            if (frame % 2 === 0 && progress < 0.85) {
              for (let i = 0; i < 6; i++) {
                const a = Math.random() * Math.PI * 2
                const r = expandR + (Math.random() - 0.5) * edgeW * 2
                ctx.save()
                ctx.globalAlpha = 0.9 * (1 - progress) * fadeOut
                ctx.fillStyle = ['#c084fc','#ffffff','#a855f7','#e879f9'][Math.floor(Math.random() * 4)]
                ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, Math.random() * 3 + 1, 0, Math.PI * 2)
                ctx.fill(); ctx.restore()
              }
            }
          }

          // Black fill — fades out after season switch
          if (fadeOut > 0) {
            ctx.save()
            ctx.globalAlpha = fadeOut
            ctx.beginPath(); ctx.arc(cx, cy, maxR * 1.1, 0, Math.PI * 2)
            ctx.fillStyle = '#000000'; ctx.fill()
            ctx.restore()
          }
        }

        // Switch season when black covers ~70% of screen
        if (frame === 65 && !switched) {
          switched = true; setSeason(nextSeason); setBgSeason(nextSeason); applyTheme(nextSeason)
        }

        if (frame < TOTAL) { wipeAnimRef.current = requestAnimationFrame(tick) }
        else { ctx.clearRect(0, 0, w, h); setIsWiping(false) }
      }
      wipeAnimRef.current = requestAnimationFrame(tick)
      return
    }

    // Standard curtain wipe for all other seasons
    const cx = w / 2
    const COVER_END = 50; const RETRACT_END = 108; const TOTAL = 126
    const eio = (t: number) => t<0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2
    const c1 = SEASON_COLORS[nextSeason][0]
    const c2 = SEASON_COLORS[nextSeason][1] ?? c1
    let frame = 0; let wipeParticles: WipeParticle[] = []; let switched = false

    const drawPanels = (panelW: number, alpha = 1) => {
      if (panelW <= 0) return
      ctx.save(); ctx.globalAlpha = alpha
      const lgL = ctx.createLinearGradient(cx-panelW, 0, cx, 0)
      lgL.addColorStop(0, c2); lgL.addColorStop(0.65, c1); lgL.addColorStop(1, '#ffffff')
      ctx.fillStyle = lgL; ctx.fillRect(cx-panelW, 0, panelW, h)
      const lgR = ctx.createLinearGradient(cx, 0, cx+panelW, 0)
      lgR.addColorStop(0, '#ffffff'); lgR.addColorStop(0.35, c1); lgR.addColorStop(1, c2)
      ctx.fillStyle = lgR; ctx.fillRect(cx, 0, panelW, h)
      const seam = ctx.createLinearGradient(cx-20, 0, cx+20, 0)
      seam.addColorStop(0,'rgba(255,255,255,0)'); seam.addColorStop(0.5,'rgba(255,255,255,0.95)'); seam.addColorStop(1,'rgba(255,255,255,0)')
      ctx.fillStyle = seam; ctx.fillRect(cx-20, 0, 40, h)
      ctx.restore()
    }

    const tick = () => {
      ctx.clearRect(0, 0, w, h); frame++
      if (frame <= COVER_END) {
        const p = eio(frame/COVER_END); const panelW = p*(w/2+6)
        drawPanels(panelW)
        if (frame%3===0 && p<0.97) {
          for (let i=0;i<5;i++) {
            const sy = Math.random()*h
            wipeParticles.push(...spawnWipeParticles(cx-panelW, sy, nextSeason, 2, 'left'))
            wipeParticles.push(...spawnWipeParticles(cx+panelW, sy, nextSeason, 2, 'right'))
          }
        }
      }
      if (frame > COVER_END-2 && frame <= COVER_END+12) {
        drawPanels(w/2+6)
        const fp = frame<=COVER_END+3 ? (frame-(COVER_END-2))/5 : 1-(frame-COVER_END-3)/9
        ctx.save(); ctx.globalAlpha = Math.max(0,fp)*0.88; ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,w,h); ctx.restore()
        if (frame===COVER_END+2) {
          for (let i=0;i<80;i++) {
            const sy = Math.random()*h
            wipeParticles.push(...spawnWipeParticles(cx, sy, nextSeason, 1, 'left'))
            wipeParticles.push(...spawnWipeParticles(cx, sy, nextSeason, 1, 'right'))
          }
        }
      }
      if (frame===COVER_END && !switched) { switched=true; setSeason(nextSeason); setBgSeason(nextSeason); applyTheme(nextSeason) }
      if (frame > COVER_END+12 && frame <= RETRACT_END) {
        const p = eio((frame-COVER_END-12)/(RETRACT_END-COVER_END-12))
        drawPanels((1-p)*(w/2+6))
      }
      if (frame > RETRACT_END && frame <= TOTAL) {
        const p = 1-(frame-RETRACT_END)/(TOTAL-RETRACT_END)
        const lineH = p*h; const lineY = (h-lineH)/2
        ctx.save(); ctx.shadowColor=c1; ctx.shadowBlur=24; ctx.strokeStyle=c1; ctx.lineWidth=3; ctx.globalAlpha=p
        ctx.beginPath(); ctx.moveTo(cx,lineY); ctx.lineTo(cx,lineY+lineH); ctx.stroke()
        ctx.strokeStyle='#ffffff'; ctx.lineWidth=1; ctx.shadowBlur=8
        ctx.beginPath(); ctx.moveTo(cx,lineY); ctx.lineTo(cx,lineY+lineH); ctx.stroke()
        ctx.restore()
      }
      wipeParticles = wipeParticles.filter(p => p.life>0)
      wipeParticles.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.1; p.vx*=0.97; p.life--
        p.opacity=(p.life/p.maxLife)*0.9; p.size*=0.97
        ctx.save(); ctx.globalAlpha=p.opacity; ctx.fillStyle=p.color; ctx.shadowColor=p.color; ctx.shadowBlur=10
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill(); ctx.restore()
      })
      if (frame<TOTAL || wipeParticles.length>0) { wipeAnimRef.current=requestAnimationFrame(tick) }
      else { ctx.clearRect(0,0,w,h); setIsWiping(false) }
    }
    wipeAnimRef.current = requestAnimationFrame(tick)
  }, [isWiping, applyTheme, season])

  const runWipeRef = useRef(runWipe)
  useEffect(() => { runWipeRef.current = runWipe }, [runWipe])

  // Apply sky theme once on mount only
  useEffect(() => { applyTheme('sky') }, [applyTheme])

  // Season rotation — random, never repeats the current season
  useEffect(() => {
    const otherSeasons: Season[] = ['spring', 'summer', 'autumn', 'winter', 'void']
    const rotate = () => {
      const current = SEASONS[seasonIndexRef.current]
      const pool = SEASONS.filter(s => s !== current)
      const next = pool[Math.floor(Math.random() * pool.length)]
      seasonIndexRef.current = SEASONS.indexOf(next)
      runWipeRef.current(next)
    }
    const id = setInterval(rotate, SEASON_DURATION)
    return () => clearInterval(id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const count = season==='summer'?200:season==='winter'?120:season==='spring'?80:season==='autumn'?70:season==='void'?200:0
    particlesRef.current = initParticles(count, canvas.width, canvas.height, season)
  }, [season])

  useEffect(() => {
    if (season!=='summer') return
    const strike = () => {
      const canvas = canvasRef.current; if (!canvas) return
      lightningRef.current = { active:true, x:Math.random()*canvas.width, opacity:1 }
      const fade = setInterval(() => { lightningRef.current.opacity-=0.08; if (lightningRef.current.opacity<=0) { lightningRef.current.active=false; clearInterval(fade) } }, 50)
    }
    const id = setInterval(strike, Math.random()*3000+2000)
    return () => clearInterval(id)
  }, [season])

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const resize = () => {
      canvas.width=window.innerWidth; canvas.height=window.innerHeight
      const count = season==='summer'?200:season==='winter'?120:season==='spring'?80:season==='autumn'?70:season==='void'?200:0
      particlesRef.current = initParticles(count, canvas.width, canvas.height, season)
    }
    resize(); window.addEventListener('resize', resize)
    const loop = () => {
      tRef.current+=0.5; const t=tRef.current; const w=canvas.width; const h=canvas.height; const ps=particlesRef.current
      ps.forEach(p => {
        if (season==='spring'||season==='autumn') { p.x+=p.vx+Math.sin(t*(p.swingSpeed||0.01))*0.8; p.y+=p.vy; if(p.y>h+20){p.y=-20;p.x=Math.random()*w} }
        else if (season==='summer') { p.x+=p.vx; p.y+=p.vy; if(p.y>h){p.y=-10;p.x=Math.random()*w} }
        else if (season==='winter') { p.y+=p.vy; if(p.y>h){p.y=-10;p.x=Math.random()*w} }
      })
      if (season==='sky')    drawSky(ctx,w,h,t)
      if (season==='spring') drawSpring(ctx,ps,w,h,t)
      if (season==='summer') drawSummer(ctx,ps,w,h,t,lightningRef.current)
      if (season==='autumn') drawAutumn(ctx,ps,w,h,t)
      if (season==='winter') drawWinter(ctx,ps,w,h,t)
      if (season==='void')   drawVoid(ctx,ps,w,h,t)
      animRef.current = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize) }
  }, [season])

  const LABELS: Record<Season,string> = { sky:'Sky', spring:'Spring', summer:'Summer', autumn:'Autumn', winter:'Winter', void:'Void' }

  return (
    <>
      <div className="sky-bg" style={{ background:SKY_GRADIENTS[bgSeason], transition:'background 1.2s ease' }} />
      <canvas ref={canvasRef} style={{ position:'fixed', inset:0, zIndex:1, pointerEvents:'none' }} />
      <canvas ref={wipeRef}   style={{ position:'fixed', inset:0, zIndex:50, pointerEvents:'none' }} />
      <div className="season-badge">{LABELS[season]}</div>
    </>
  )
}
