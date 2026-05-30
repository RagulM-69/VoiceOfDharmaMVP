'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Navbar from '@/components/public/Navbar'

/* ─── Krishna response messages ────────────────────────────────────── */
const KRISHNA_MESSAGES = [
  "Your words have faded, but they have reached Him. Leave the heavy weight of your thoughts here at His feet, and walk ahead with a lighter heart. He is holding you.",
  "He has heard the unspoken prayers within your silence. Your letter has been offered at His divine feet. Rest your mind tonight, knowing you are never truly walking alone.",
  "Your letter has dissolved into the divine space. Krishna knows your past, understands your present, and is already protecting your future. Breathe easy; let Him take care of it.",
  "Your heart has been heard. Every worry you just wrote has been transformed into a prayer at His lotus feet. Go back to your day with peace; everything is unfolding as it should.",
  "He knows the silent battles you fight, and He hears the tears behind your words. Your letter is resting with Him now. You are safe, you are loved, and you are being guided.",
  "Offered at His Lotus Feet. The one who carries the universe is now carrying your worries. Let go, smile, and rest in His peace.",
]

/* ─── Gold palette — warm monochromatic only ────────────────────────── */
const GOLD_SHADES = [
  'rgba(160,110,8,1)',
  'rgba(200,150,12,1)',
  'rgba(215,165,20,1)',
  'rgba(245,166,35,1)',
  'rgba(251,191,36,1)',
  'rgba(253,212,80,1)',
  'rgba(254,240,138,1)',
]

/* ─── Bansuri note synthesiser (Web Audio API) ───────────────────────
   Generates a multi-partial sine-wave tone that approximates a low
   bansuri flute. No external audio file required.                     */
function playBansuriNote(ctx: AudioContext) {
  try {
    const tone = (freq: number, peak: number, attack: number, decay: number) => {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      // Tiny pitch drift → organic feel
      osc.frequency.linearRampToValueAtTime(freq * 1.003, ctx.currentTime + 0.6)
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(peak, ctx.currentTime + attack)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + decay)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + decay)
    }

    tone(370,  0.26, 0.12, 4.2)  // fundamental  F#4
    tone(740,  0.08, 0.20, 3.2)  // 2nd harmonic
    tone(1110, 0.03, 0.28, 2.2)  // 3rd harmonic (flute brightness)
    tone(185,  0.05, 0.08, 2.8)  // sub-octave   (resonance depth)
  } catch {}
}

/* ─── Curtain-opening wind + chime ─────────────────────────────────── */
function playCurtainSound(ctx: AudioContext) {
  try {
    // Soft silk-wind whoosh (band-passed white noise)
    const bufLen  = Math.floor(ctx.sampleRate * 1.4)
    const buf     = ctx.createBuffer(1, bufLen, ctx.sampleRate)
    const data    = buf.getChannelData(0)
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1
    const noise   = ctx.createBufferSource()
    noise.buffer  = buf
    const bpf     = ctx.createBiquadFilter()
    bpf.type      = 'bandpass'
    bpf.frequency.setValueAtTime(700, ctx.currentTime)
    bpf.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 1.4)
    bpf.Q.value   = 0.45
    const nGain   = ctx.createGain()
    nGain.gain.setValueAtTime(0, ctx.currentTime)
    nGain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.1)
    nGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4)
    noise.connect(bpf); bpf.connect(nGain); nGain.connect(ctx.destination)
    noise.start()

    // Two bright chime tings — like temple bells catching light
    const chime = (freq: number, delay: number, gain: number, decay: number) => {
      const osc = ctx.createOscillator()
      const g   = ctx.createGain()
      osc.type  = 'sine'
      osc.frequency.value = freq
      g.gain.setValueAtTime(0, ctx.currentTime + delay)
      g.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.03)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + decay)
      osc.connect(g); g.connect(ctx.destination)
      osc.start(ctx.currentTime + delay)
      osc.stop(ctx.currentTime + delay + decay)
    }
    chime(1318.5, 0.08, 0.12, 2.6)   // E6 — bright opening ting
    chime(987.77, 0.38, 0.07, 3.0)   // B5 — softer echo
    chime(1567.98, 0.65, 0.04, 2.2)  // G6 — faint third chime
  } catch {}
}

/* ─── Ascending offering arpeggio ───────────────────────────────────── */
function playOfferingSound(ctx: AudioContext) {
  try {
    // C major pentatonic ascending — lifting sensation
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99]
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type   = 'sine'
      osc.frequency.value = freq
      const d = i * 0.19
      gain.gain.setValueAtTime(0, ctx.currentTime + d)
      gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + d + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d + 3)
      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(ctx.currentTime + d)
      osc.stop(ctx.currentTime + d + 3)
    })
  } catch {}
}

/* ─── Celestial harp / divine reveal (Warm & Soothing) ─────────────── */
function playDivineRevealSound(ctx: AudioContext) {
  try {
    // 1. Warm Angelic Swell Chord (F Major 9 / Celestial)
    const swellFreqs = [174.61, 261.63, 440.0, 659.25, 783.99]
    swellFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)

      const swellTime = 1.4 // slow, gentle rise
      const holdTime = 0.5
      const decayTime = 5.0

      gain.gain.setValueAtTime(0, ctx.currentTime)
      // Swell up
      gain.gain.linearRampToValueAtTime(0.05 - (idx * 0.006), ctx.currentTime + swellTime)
      // Hold then decay
      gain.gain.setValueAtTime(0.05 - (idx * 0.006), ctx.currentTime + swellTime + holdTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + swellTime + holdTime + decayTime)

      // Lowpass filter
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(freq * 1.2, ctx.currentTime)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + swellTime + holdTime + decayTime + 0.1)
    })

    // 2. Crystalline Stardust Cascade (Sparkling high notes)
    const sparkleNotes = [1567.98, 1760.0, 2093.0, 2637.02, 3135.96]
    sparkleNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)

      const startDelay = 0.4 + (idx * 0.18)
      const attack = 0.05
      const decay = 2.5

      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.setValueAtTime(0, ctx.currentTime + startDelay)
      gain.gain.linearRampToValueAtTime(0.012, ctx.currentTime + startDelay + attack)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startDelay + attack + decay)

      // Highpass filter for airiness
      const filter = ctx.createBiquadFilter()
      filter.type = 'highpass'
      filter.frequency.setValueAtTime(1000, ctx.currentTime)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + startDelay + attack + decay + 0.1)
    })
  } catch {}
}

/* ─── Warm Cosmic Drone Synthesiser ───────────────────────────────── */
function startAmbientSynth(ctx: AudioContext): { masterGain: GainNode; nodes: (OscillatorNode | GainNode | BiquadFilterNode)[] } {
  const masterGain = ctx.createGain()
  masterGain.gain.setValueAtTime(0.0001, ctx.currentTime)
  masterGain.connect(ctx.destination)

  const nodes: (OscillatorNode | GainNode | BiquadFilterNode)[] = []

  // Warm, sacred C# major chord (136.1 Hz fundamental - Earth OM Frequency)
  const voices = [
    { freq: 136.1,  baseGain: 0.08, lfoFreq: 0.05, lfoDepth: 0.02 },  // Fundamental C#3
    { freq: 204.15, baseGain: 0.05, lfoFreq: 0.07, lfoDepth: 0.015 }, // Fifth G#3
    { freq: 272.2,  baseGain: 0.04, lfoFreq: 0.04, lfoDepth: 0.01 },  // Octave C#4
    { freq: 340.25, baseGain: 0.03, lfoFreq: 0.03, lfoDepth: 0.008 }  // Major Third E#4 / F4
  ]

  voices.forEach(({ freq, baseGain, lfoFreq, lfoDepth }) => {
    const osc = ctx.createOscillator()
    const voiceGain = ctx.createGain()
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)

    voiceGain.gain.setValueAtTime(baseGain, ctx.currentTime)

    lfo.type = 'sine'
    lfo.frequency.setValueAtTime(lfoFreq, ctx.currentTime)
    lfoGain.gain.setValueAtTime(lfoDepth, ctx.currentTime)

    lfo.connect(lfoGain)
    lfoGain.connect(voiceGain.gain)

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(freq * 1.6, ctx.currentTime)

    osc.connect(filter)
    filter.connect(voiceGain)
    voiceGain.connect(masterGain)

    osc.start(ctx.currentTime)
    lfo.start(ctx.currentTime)

    nodes.push(osc, voiceGain, lfo, lfoGain, filter)
  })

  return { masterGain, nodes }
}

/* ─── Types ─────────────────────────────────────────────────────────── */
interface OfferParticle {
  x: number; y: number
  vx: number; vy: number
  alpha: number; size: number
  color: string; drift: number
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export default function LetterToKrishnaClient() {

  /* ── Refs ────────────────────────────────────────────────────────── */
  const textareaRef     = useRef<HTMLTextAreaElement>(null)
  const offerCanvasRef  = useRef<HTMLCanvasElement>(null)   // full-screen disintegration canvas
  const audioCtxRef     = useRef<AudioContext | null>(null)
  const ambientGainRef   = useRef<GainNode | null>(null)
  const ambientNodesRef  = useRef<(OscillatorNode | GainNode | BiquadFilterNode)[]>([])
  const offerAnimRef    = useRef<number | null>(null)
  const offerPartRef    = useRef<OfferParticle[]>([])
  const offerFrameRef   = useRef(0)

  /* ── Gate state ──────────────────────────────────────────────────── */
  const [gateExiting,  setGateExiting]  = useState(false)
  const [gateGone,     setGateGone]     = useState(false)
  const [gateRippling, setGateRippling] = useState(false)

  /* ── Intro state ─────────────────────────────────────────────────── */
  const [introPhase,      setIntroPhase]      = useState(0)
  const [introText,       setIntroText]       = useState('')
  const [showIntroRipple, setShowIntroRipple] = useState(false)

  /* ── Page state ──────────────────────────────────────────────────── */
  const [audioOn,   setAudioOn]   = useState(false)
  const [message,   setMessage]   = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [btnLocked, setBtnLocked] = useState(false)

  /* ── Offering state ──────────────────────────────────────────────── */
  const [offerStage, setOfferStage] = useState<'idle' | 'exploding' | 'done'>('idle')
  const [showModal,  setShowModal]  = useState(false)
  const [modalMsg,   setModalMsg]   = useState('')

  const introGone    = introPhase >= 6
  const contentReady = gateGone && introPhase >= 5

  /* ── Intro timers — run once gate is gone ────────────────────────── */
  useEffect(() => {
    if (!gateGone) return
    const t = [
      setTimeout(() =>  setIntroPhase(1),                                    350),
      setTimeout(() => { setIntroPhase(2); setIntroText('Breathe in…') },   1300),
      setTimeout(() => { setIntroPhase(3); setShowIntroRipple(true) },      2700),
      setTimeout(() => { setIntroPhase(4); setIntroText('Breathe out…') },  2950),
      setTimeout(() =>  setIntroPhase(5),                                   4350),
      setTimeout(() =>  setIntroPhase(6),                                   6000),
    ]
    return () => t.forEach(clearTimeout)
  }, [gateGone])

  /* ── Audio clean-up on unmount ───────────────────────────────────── */
  useEffect(() => {
    return () => {
      if (ambientNodesRef.current) {
        ambientNodesRef.current.forEach(node => {
          try {
            if (node instanceof OscillatorNode) {
              node.stop()
              node.disconnect()
            } else {
              node.disconnect()
            }
          } catch {}
        })
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close()
        } catch {}
      }
    }
  }, [])

  /* ── Curtain sound — fires exactly when curtains begin to part ───── */
  useEffect(() => {
    if (introPhase === 3 && gateGone && audioCtxRef.current) {
      playCurtainSound(audioCtxRef.current)
    }
  }, [introPhase, gateGone])

  /* ── Divine reveal sound — fires when modal appears ─────────────── */
  useEffect(() => {
    if (showModal && audioCtxRef.current) {
      playDivineRevealSound(audioCtxRef.current)
    }
  }, [showModal])

  /* ── Enter the sanctuary ─────────────────────────────────────────── */
  const handleEnter = useCallback(() => {
    setGateExiting(true)
    setGateRippling(true)

    // Initialize AudioContext
    let ctx = audioCtxRef.current
    if (!ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        ctx = new AudioCtx()
        audioCtxRef.current = ctx
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume()
    }

    if (ctx) {
      // Play Bansuri Note
      playBansuriNote(ctx)

      // Start warm ambient drone
      const { masterGain, nodes } = startAmbientSynth(ctx)
      ambientGainRef.current = masterGain
      ambientNodesRef.current = nodes

      // Fade in ambient drone
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime)
      masterGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 2.0)
      setAudioOn(true)
    }

    // Gate fades over 1.6s then intro begins
    setTimeout(() => setGateGone(true), 1800)
  }, [])

  /* ── Audio toggle ────────────────────────────────────────────────── */
  const toggleAudio = useCallback(() => {
    let ctx = audioCtxRef.current
    if (!ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        ctx = new AudioCtx()
        audioCtxRef.current = ctx
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume()
    }

    const gainNode = ambientGainRef.current
    if (!ctx || !gainNode) return

    if (audioOn) {
      // Fade out to silent
      gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2)
      setAudioOn(false)
    } else {
      // Start ambient if not already running
      if (ambientNodesRef.current.length === 0) {
        const { masterGain, nodes } = startAmbientSynth(ctx)
        ambientGainRef.current = masterGain
        ambientNodesRef.current = nodes
      }
      // Fade in
      gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 1.2)
      setAudioOn(true)
    }
  }, [audioOn])

  /* ── Full-screen offering particle loop ──────────────────────────── */
  const runOfferParticles = useCallback(() => {
    const cvs = offerCanvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')
    if (!ctx) return

    offerFrameRef.current++
    const frame = offerFrameRef.current
    ctx.clearRect(0, 0, cvs.width, cvs.height)

    // Switch to converge phase at ~120 frames (2s @ 60fps)
    const isConverging = frame > 120
    const cx = cvs.width  / 2
    const cy = cvs.height / 2

    offerPartRef.current = offerPartRef.current.filter(p => p.alpha > 0.004)

    for (const p of offerPartRef.current) {
      if (isConverging) {
        // Pull toward center — vortex gravity
        p.vx += (cx - p.x) * 0.004
        p.vy += (cy - p.y) * 0.004
        // Cap speed
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > 7) { p.vx = (p.vx / spd) * 7; p.vy = (p.vy / spd) * 7 }
        p.alpha = Math.max(0, p.alpha - 0.010)
      } else {
        // Scatter: float upward with sinusoidal drift
        p.x += p.vx + Math.sin(frame * 0.045 + p.drift) * 0.6
        p.y += p.vy
        p.alpha = Math.max(0, p.alpha - 0.003)
      }

      ctx.save()
      ctx.globalAlpha = p.alpha
      ctx.fillStyle   = p.color
      ctx.shadowBlur  = 14
      ctx.shadowColor = 'rgba(200,150,12,0.55)'
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    if (offerPartRef.current.length > 0) {
      offerAnimRef.current = requestAnimationFrame(runOfferParticles)
    } else {
      ctx.clearRect(0, 0, cvs.width, cvs.height)
    }
  }, [])

  /* ── Submit / Offer ──────────────────────────────────────────────── */
  const handleOffer = useCallback(() => {
    if (btnLocked || message.trim().length === 0) return
    setBtnLocked(true)
    setSubmitted(true)

    // INSTANT PURGE — text wiped before next paint
    if (textareaRef.current) textareaRef.current.value = ''
    setMessage('')

    // Ascending offering sound
    if (audioCtxRef.current) {
      playOfferingSound(audioCtxRef.current)
    }

    // Pick divine response
    setModalMsg(KRISHNA_MESSAGES[Math.floor(Math.random() * KRISHNA_MESSAGES.length)])

    // Begin GRADUAL page fade — CSS transition handles the slow dissolve
    setOfferStage('exploding')

    // Delay particle spawn 700ms so the page starts visibly fading first,
    // giving the natural "page dissolving INTO particles" feeling.
    setTimeout(() => {
      const cvs = offerCanvasRef.current
      if (!cvs) return
      cvs.width  = window.innerWidth
      cvs.height = window.innerHeight

      offerFrameRef.current = 0
      const count = 220
      offerPartRef.current = Array.from({ length: count }, () => ({
        x:     Math.random() * cvs.width,
        y:     40 + Math.random() * (cvs.height - 40),
        vx:    (Math.random() - 0.5) * 1.3,
        vy:    -(Math.random() * 1.4 + 0.35),
        alpha: 0.55 + Math.random() * 0.45,   // start lower so particles build gradually
        size:  0.8 + Math.random() * 2.8,
        color: GOLD_SHADES[Math.floor(Math.random() * GOLD_SHADES.length)],
        drift: Math.random() * Math.PI * 2,
      }))

      if (offerAnimRef.current) cancelAnimationFrame(offerAnimRef.current)
      offerAnimRef.current = requestAnimationFrame(runOfferParticles)
    }, 700)

    // Total time = 700ms head-start + 3800ms particle life → 4500ms until modal
    setTimeout(() => {
      setShowModal(true)
      setOfferStage('done')
    }, 4500)
  }, [btnLocked, message, runOfferParticles])

  /* ── Close divine modal ──────────────────────────────────────────── */
  const handleClose = useCallback(() => {
    setShowModal(false)
    setSubmitted(false)
    setBtnLocked(false)
    setModalMsg('')
    setOfferStage('idle')

    if (offerAnimRef.current) { cancelAnimationFrame(offerAnimRef.current); offerAnimRef.current = null }
    offerPartRef.current = []
    const cvs = offerCanvasRef.current
    if (cvs) cvs.getContext('2d')?.clearRect(0, 0, cvs.width, cvs.height)
  }, [])

  /* ────────────────────────────────────────────────────────────────── */

  return (
    <>
      {/* Synthesized Web Audio API replaces external MP3 loading */}

      {/* ════════════════════════════════════════════════════════════
          BANSURI GATE — dark charcoal entry screen
      ════════════════════════════════════════════════════════════ */}
      {!gateGone && (
        <div
          className="ltk-gate"
          style={{ opacity: gateExiting ? 0 : 1 }}
          aria-label="Enter the sanctuary"
        >
          {/* Gate ripple rings — appear on Enter click */}
          {gateRippling && (
            <>
              <div className="ltk-gate-ripple ltk-gr1" />
              <div className="ltk-gate-ripple ltk-gr2" />
              <div className="ltk-gate-ripple ltk-gr3" />
            </>
          )}

          <div className="ltk-gate-content">
            <div className="ltk-gate-symbol">
              <svg 
                viewBox="0 0 64 64" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="ltk-gold-symbol-svg"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="goldGradGate" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5A623" />
                    <stop offset="30%" stopColor="#F8E71C" />
                    <stop offset="70%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
                {/* Flute */}
                <rect x="8" y="38" width="48" height="4" rx="2" fill="url(#goldGradGate)" transform="rotate(-15 32 40)" />
                {/* Flute Holes */}
                <circle cx="20" cy="39" r="0.75" fill="#08101e" transform="rotate(-15 32 40)" />
                <circle cx="26" cy="39" r="0.75" fill="#08101e" transform="rotate(-15 32 40)" />
                <circle cx="32" cy="39" r="0.75" fill="#08101e" transform="rotate(-15 32 40)" />
                <circle cx="38" cy="39" r="0.75" fill="#08101e" transform="rotate(-15 32 40)" />
                <circle cx="44" cy="39" r="0.75" fill="#08101e" transform="rotate(-15 32 40)" />
                
                {/* Peacock Feather */}
                {/* Stem */}
                <path d="M30 36 C32 26, 38 18, 44 14" stroke="url(#goldGradGate)" strokeWidth="1.5" strokeLinecap="round" />
                {/* Eye */}
                <path d="M44 14 C48 10, 48 4, 42 6 C36 8, 40 14, 44 14 Z" fill="url(#goldGradGate)" opacity="0.85" />
                <path d="M43 11 C45 9, 45 6, 42 7 C39 8, 41 11, 43 11 Z" fill="#0d1a3a" />
                <path d="M42.5 9.5 C43 8.5, 43 7.5, 41.5 8 C40 8.5, 41.5 9.5, 42.5 9.5 Z" fill="#fbbf24" />
                
                {/* Feathers/Strands */}
                <path d="M33 30 C30 28, 28 29, 27 31" stroke="url(#goldGradGate)" strokeWidth="1" strokeLinecap="round" />
                <path d="M35 26 C31 23, 29 25, 28 27" stroke="url(#goldGradGate)" strokeWidth="1" strokeLinecap="round" />
                <path d="M37 22 C33 18, 31 20, 30 22" stroke="url(#goldGradGate)" strokeWidth="1" strokeLinecap="round" />
                <path d="M39 18 C35 13, 33 15, 32 17" stroke="url(#goldGradGate)" strokeWidth="1" strokeLinecap="round" />
                
                <path d="M35 32 C38 31, 40 32, 41 34" stroke="url(#goldGradGate)" strokeWidth="1" strokeLinecap="round" />
                <path d="M37 28 C41 26, 43 27, 44 29" stroke="url(#goldGradGate)" strokeWidth="1" strokeLinecap="round" />
                <path d="M39 24 C44 21, 46 22, 47 24" stroke="url(#goldGradGate)" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="ltk-gate-title">Letter to Krishna</h2>
            <p className="ltk-gate-hint">Turn on sound to enter the sanctuary</p>
            <button
              id="ltk-enter-btn"
              className="ltk-gate-btn"
              onClick={handleEnter}
              aria-label="Enter the sanctuary"
            >
              Enter
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          PORTAL INTRO — breathing / spine / curtain sequence
      ════════════════════════════════════════════════════════════ */}
      {!introGone && gateGone && (
        <div
          className="ltk-intro-overlay"
          style={{ opacity: introPhase >= 5 ? 0 : 1 }}
          aria-hidden="true"
        >
          {/* Silk curtains with gold seam edges */}
          <div className="ltk-curtain ltk-curtain-left"
            style={{ transform: introPhase >= 3 ? 'translateX(-100%)' : 'translateX(0)' }}
          />
          <div className="ltk-curtain ltk-curtain-right"
            style={{ transform: introPhase >= 3 ? 'translateX(100%)' : 'translateX(0)' }}
          />

          {/* Pulsing soul-dot */}
          <div className="ltk-intro-dot" />

          {/* Golden spine growing from dot */}
          <div className="ltk-intro-line ltk-intro-line-up"
            style={{ height: introPhase >= 1 ? '44vh' : '0' }}
          />
          <div className="ltk-intro-line ltk-intro-line-down"
            style={{ height: introPhase >= 1 ? '44vh' : '0' }}
          />

          {/* Ripple rings on curtain split */}
          {showIntroRipple && (
            <>
              <div className="ltk-ripple-ring ltk-ripple-r1" />
              <div className="ltk-ripple-ring ltk-ripple-r2" />
              <div className="ltk-ripple-ring ltk-ripple-r3" />
            </>
          )}

          {/* Breath guide */}
          <p className="ltk-intro-breath"
            style={{ opacity: introPhase >= 2 && introPhase < 5 ? 1 : 0 }}
          >
            {introText}
          </p>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════════════════════════ */}
      <Navbar variant="dark" keepDark />

      {/* ════════════════════════════════════════════════════════════
          AUDIO TOGGLE
      ════════════════════════════════════════════════════════════ */}
      <button
        id="ltk-audio-btn"
        className={`ltk-audio-btn${audioOn ? ' ltk-audio-btn--on' : ''}`}
        onClick={toggleAudio}
        aria-label={audioOn ? 'Mute ambient music' : 'Play ambient music'}
        style={{
          opacity: contentReady && offerStage === 'idle' ? 1 : 0,
          transition: 'opacity 1.4s ease 0.4s',
          pointerEvents: contentReady && offerStage === 'idle' ? 'auto' : 'none',
        }}
      >
        {audioOn ? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="23" y1="9" x2="17" y2="15"/>
            <line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        )}
      </button>

      {/* ════════════════════════════════════════════════════════════
          FULL-SCREEN OFFERING CANVAS — particles from the whole page
      ════════════════════════════════════════════════════════════ */}
      <canvas
        ref={offerCanvasRef}
        id="ltk-offer-canvas"
        className="ltk-offer-canvas"
        style={{ opacity: offerStage === 'idle' ? 0 : 1 }}
        aria-hidden="true"
      />

      {/* ════════════════════════════════════════════════════════════
          MAIN PAGE CONTENT
      ════════════════════════════════════════════════════════════ */}
      <main
        className="ltk-page"
        style={{
          opacity:   contentReady && offerStage === 'idle' ? 1 : 0,
          transform: !contentReady ? 'translateY(20px)' : 'translateY(0)',
          // During offering: long 3.5s dissolve so particles appear to consume the page
          // During initial reveal: standard 1.5s entry
          transition: offerStage !== 'idle'
            ? 'opacity 3.5s cubic-bezier(0.4, 0, 1, 1)'
            : 'opacity 1.5s ease, transform 1.5s ease',
          pointerEvents: contentReady && offerStage === 'idle' ? 'auto' : 'none',
        }}
      >
        {/* Hero */}
        <div className="ltk-header">
          <div className="ltk-symbol">॥</div>
          <h1 className="ltk-title">Letter to Krishna</h1>
          <p className="ltk-subtitle">A quiet space between you and Him</p>
        </div>

        <div className="ltk-container">

          {/* Opening prose */}
          <div className="ltk-prose-block ltk-prose-intro">
            <p>
              There are moments when the heart becomes too heavy to carry alone. Thoughts remain unspoken,
              prayers stay trapped in silence, and emotions become difficult to explain to anyone around us.
              This space was created for those moments — a quiet place where you can simply speak to Krishna
              from your heart, without fear, without pressure, and without needing to hide what you truly feel.
            </p>
          </div>

          <div className="ltk-prose-block">
            <p>You do not have to write perfectly here. You do not have to sound spiritual, strong, or composed.</p>
            <p>
              Whether it is pain, gratitude, confusion, anger, loneliness, hope, or a simple prayer — you may
              leave it here just as it is. Sometimes the heart only needs a safe place to release what it has
              been carrying for too long.
            </p>
          </div>

          {/* Gita verse */}
          <blockquote className="ltk-verse">
            <span className="ltk-verse-text">
              "Ananyāś cintayanto māṁ ye janāḥ paryupāsate<br/>
               teṣāṁ nityābhiyuktānāṁ yoga-kṣemaṁ vahāmy aham"
            </span>
            <cite className="ltk-verse-ref">— Bhagavad Gita 9.22</cite>
            <span className="ltk-verse-meaning">
              For those who worship Me with devotion, I carry what they lack and preserve what they have.
            </span>
          </blockquote>

          {/* Privacy assurance */}
          <div className="ltk-prose-block ltk-prose-privacy">
            <div className="ltk-privacy-icon">🔒</div>
            <p>
              Everything you write here remains completely private and secure. Your words will not be published,
              displayed, shared, or judged. No one will read your message, respond to it, or turn it into
              content. This is not a public wall, not a discussion space, and not a platform for attention.
              It is simply a quiet offering between you and Krishna.
            </p>
            <p>
              In a world where people often feel unheard, this space exists without expectations. You are not
              required to explain yourself. You are not required to have answers. You may simply pause here for
              a moment, breathe, and let your heart speak freely — as if placing your thoughts gently at the
              feet of Govinda.
            </p>
          </div>

          <div className="ltk-section-divider">
            <span className="ltk-divider-line"/>
            <span className="ltk-divider-dot">✦</span>
            <span className="ltk-divider-line"/>
          </div>

          {/* Writing area */}
          <div className="ltk-writing-area">
            <label className="ltk-label" htmlFor="ltk-textarea">Write to Him…</label>
            <textarea
              ref={textareaRef}
              id="ltk-textarea"
              className="ltk-textarea"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Dear Krishna, today I carry…"
              rows={10}
              spellCheck={false}
              disabled={submitted}
              aria-label="Write your letter to Krishna"
            />
          </div>

          <p className="ltk-breathe" aria-live="polite">Take a deep breath…</p>

          <button
            id="ltk-offer-btn"
            className="ltk-offer-btn"
            onClick={handleOffer}
            disabled={btnLocked || message.trim().length === 0}
            aria-label="Offer your letter at Krishna's feet"
          >
            <span className="ltk-offer-btn__lotus">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="ltk-gold-mini-feather"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="goldMiniGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5A623" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                </defs>
                <path d="M2 22C6 18 12 15 16 10" stroke="url(#goldMiniGrad)" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 10C19 7 21 4 19 2C17 0 14 2 11 5C8 8 7 11 7 11" fill="url(#goldMiniGrad)" opacity="0.15" />
                <path d="M16 10C19 7 21 4 19 2C17 0 14 2 11 5C8 8 7 11 7 11" stroke="url(#goldMiniGrad)" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M15 8C17 6 18 4.5 17 3.5C16 2.5 14.5 3 12.5 5" stroke="url(#goldMiniGrad)" strokeWidth="1" strokeLinecap="round" fill="#0d1a3a" />
                <path d="M7 16C5 15 4 15.5 3 16.5" stroke="url(#goldMiniGrad)" strokeWidth="1" strokeLinecap="round" />
                <path d="M9 13C7 11 6 11.5 5 12.5" stroke="url(#goldMiniGrad)" strokeWidth="1" strokeLinecap="round" />
                <path d="M11 10C9 8 8 8.5 7 9.5" stroke="url(#goldMiniGrad)" strokeWidth="1" strokeLinecap="round" />
                <path d="M13 7C11 5 10 5.5 9 6.5" stroke="url(#goldMiniGrad)" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </span>
            Offer at His Feet
          </button>

          <div className="ltk-prose-closing">
            <p>
              And perhaps, even in silence, you may leave feeling a little lighter than before. Not because
              every problem disappears instantly, but because you no longer carry it alone.
            </p>
          </div>

          <p className="ltk-privacy-note">
            Your words dissolve the moment you offer them — no logs, no servers, no memory.
          </p>

        </div>
      </main>

      {/* ════════════════════════════════════════════════════════════
          DIVINE REVELATION MODAL
      ════════════════════════════════════════════════════════════ */}
      {showModal && (
        <div
          id="ltk-divine-overlay"
          className="ltk-divine-overlay ltk-divine-overlay--visible"
          role="dialog" aria-modal="true" aria-label="Krishna's response"
          onClick={e => { if (e.target === e.currentTarget) handleClose() }}
        >
          <div className="ltk-divine-card">
            <div className="ltk-divine-symbol">
              <svg 
                viewBox="0 0 64 64" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="ltk-gold-symbol-svg"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="goldGradDivine" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5A623" />
                    <stop offset="30%" stopColor="#F8E71C" />
                    <stop offset="70%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
                {/* Flute */}
                <rect x="8" y="38" width="48" height="4" rx="2" fill="url(#goldGradDivine)" transform="rotate(-15 32 40)" />
                {/* Flute Holes */}
                <circle cx="20" cy="39" r="0.75" fill="#08101e" transform="rotate(-15 32 40)" />
                <circle cx="26" cy="39" r="0.75" fill="#08101e" transform="rotate(-15 32 40)" />
                <circle cx="32" cy="39" r="0.75" fill="#08101e" transform="rotate(-15 32 40)" />
                <circle cx="38" cy="39" r="0.75" fill="#08101e" transform="rotate(-15 32 40)" />
                <circle cx="44" cy="39" r="0.75" fill="#08101e" transform="rotate(-15 32 40)" />
                
                {/* Peacock Feather */}
                {/* Stem */}
                <path d="M30 36 C32 26, 38 18, 44 14" stroke="url(#goldGradDivine)" strokeWidth="1.5" strokeLinecap="round" />
                {/* Eye */}
                <path d="M44 14 C48 10, 48 4, 42 6 C36 8, 40 14, 44 14 Z" fill="url(#goldGradDivine)" opacity="0.85" />
                <path d="M43 11 C45 9, 45 6, 42 7 C39 8, 41 11, 43 11 Z" fill="#0d1a3a" />
                <path d="M42.5 9.5 C43 8.5, 43 7.5, 41.5 8 C40 8.5, 41.5 9.5, 42.5 9.5 Z" fill="#fbbf24" />
                
                {/* Feathers/Strands */}
                <path d="M33 30 C30 28, 28 29, 27 31" stroke="url(#goldGradDivine)" strokeWidth="1" strokeLinecap="round" />
                <path d="M35 26 C31 23, 29 25, 28 27" stroke="url(#goldGradDivine)" strokeWidth="1" strokeLinecap="round" />
                <path d="M37 22 C33 18, 31 20, 30 22" stroke="url(#goldGradDivine)" strokeWidth="1" strokeLinecap="round" />
                <path d="M39 18 C35 13, 33 15, 32 17" stroke="url(#goldGradDivine)" strokeWidth="1" strokeLinecap="round" />
                
                <path d="M35 32 C38 31, 40 32, 41 34" stroke="url(#goldGradDivine)" strokeWidth="1" strokeLinecap="round" />
                <path d="M37 28 C41 26, 43 27, 44 29" stroke="url(#goldGradDivine)" strokeWidth="1" strokeLinecap="round" />
                <path d="M39 24 C44 21, 46 22, 47 24" stroke="url(#goldGradDivine)" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
            <p className="ltk-divine-from">— A message from Krishna —</p>
            <p className="ltk-divine-message">{modalMsg}</p>
            <div className="ltk-divine-divider"/>
            <button id="ltk-close-btn" className="ltk-divine-close" onClick={handleClose}>
              Return in Peace ✦
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          SCOPED STYLES — all prefixed .ltk-
      ════════════════════════════════════════════════════════════ */}
      <style>{`

        /* ══ BANSURI GATE ════════════════════════════════════════════ */

        .ltk-gate {
          position: fixed; inset: 0; z-index: 610;
          background: #08101e;
          display: flex; align-items: center; justify-content: center;
          transition: opacity 1.6s ease;
          pointer-events: auto;
        }

        /* Gate ripple rings */
        .ltk-gate-ripple {
          position: absolute;
          left: 50%; top: 50%;
          width: 60px; height: 60px;
          margin: -30px 0 0 -30px;
          border-radius: 50%;
          transform: scale(0);
          pointer-events: none;
        }
        @keyframes ltk-gate-expand {
          0%   { transform: scale(0);  opacity: 0.9; }
          60%  {                       opacity: 0.4; }
          100% { transform: scale(35); opacity: 0;   }
        }
        .ltk-gr1 { border: 1px solid rgba(251,191,36,.80); animation: ltk-gate-expand 2.2s ease-out forwards 0s;    }
        .ltk-gr2 { border: 1px solid rgba(251,191,36,.50); animation: ltk-gate-expand 2.2s ease-out forwards 0.35s; }
        .ltk-gr3 { border: 1px solid rgba(251,191,36,.25); animation: ltk-gate-expand 2.2s ease-out forwards 0.70s; }

        .ltk-gate-content {
          display: flex; flex-direction: column;
          align-items: center; gap: 1.1rem;
          position: relative; z-index: 2;
          text-align: center; padding: 0 1.5rem;
        }
        .ltk-gate-symbol { animation: ltk-lotus-pulse 3s ease-in-out infinite; }
        .ltk-gate-title {
          font-family: var(--font-garamond), serif;
          font-size: clamp(2rem, 6vw, 3.4rem);
          font-weight: 600; letter-spacing: .04em;
          background: linear-gradient(135deg, #C8960C, #fbbf24, #fef08a);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          filter: drop-shadow(0 0 24px rgba(200,150,12,.35));
          margin: 0;
        }
        .ltk-gate-hint {
          font-family: var(--font-inter), sans-serif;
          font-size: .8rem; letter-spacing: .14em;
          color: rgba(251,191,36,.42); text-transform: uppercase;
          margin: 0;
        }
        .ltk-gate-btn {
          margin-top: .4rem;
          padding: .9rem 3rem; border-radius: 9999px;
          border: 1px solid rgba(251,191,36,.45);
          background: transparent;
          color: rgba(251,191,36,.85);
          font-family: var(--font-garamond), serif;
          font-size: 1.15rem; letter-spacing: .14em;
          cursor: pointer;
          transition: all .3s ease;
          animation: ltk-gate-btn-pulse 2.5s ease-in-out infinite;
        }
        @keyframes ltk-gate-btn-pulse {
          0%,100% { box-shadow: 0 0 12px rgba(251,191,36,.1); border-color: rgba(251,191,36,.45); }
          50%      { box-shadow: 0 0 28px rgba(251,191,36,.3); border-color: rgba(251,191,36,.75); }
        }
        .ltk-gate-btn:hover {
          background: rgba(251,191,36,.08);
          border-color: rgba(251,191,36,.8);
          color: #fbbf24;
          box-shadow: 0 0 32px rgba(251,191,36,.25);
          transform: translateY(-2px);
        }


        /* ══ PORTAL INTRO ════════════════════════════════════════════ */

        .ltk-intro-overlay {
          position: fixed; inset: 0; z-index: 500;
          background: #020509;           /* ← DARK — prevents cream body bleed */
          pointer-events: none;
          transition: opacity 1.7s ease;
        }

        /* Curtains */
        .ltk-curtain {
          position: absolute; top: 0; bottom: 0; width: 50.5%;
          background: #020509;
          transition: transform 2s cubic-bezier(0.76, 0, 0.24, 1);
          will-change: transform;
        }
        .ltk-curtain-left  { left: 0;  border-right: 1px solid rgba(251,191,36,.42); }
        .ltk-curtain-right { right: 0; border-left:  1px solid rgba(251,191,36,.42); }

        /* Soul dot */
        .ltk-intro-dot {
          position: absolute; left: 50%; top: 50%;
          width: 7px; height: 7px; margin: -3.5px 0 0 -3.5px;
          border-radius: 50%; background: #fbbf24; z-index: 2;
          animation: ltk-dot-pulse 2.5s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(251,191,36,.9), 0 0 30px rgba(251,191,36,.5), 0 0 70px rgba(251,191,36,.25);
        }
        @keyframes ltk-dot-pulse {
          0%,100% { box-shadow: 0 0 10px rgba(251,191,36,.9), 0 0 28px rgba(251,191,36,.5), 0 0 65px rgba(251,191,36,.22); }
          50%      { box-shadow: 0 0 18px rgba(251,191,36,1),  0 0 50px rgba(251,191,36,.7), 0 0 100px rgba(251,191,36,.4); }
        }

        /* Spine lines */
        .ltk-intro-line {
          position: absolute; left: 50%; transform: translateX(-50%);
          width: 1px; transition: height 1.4s cubic-bezier(.4,0,.2,1);
          z-index: 2; will-change: height;
        }
        .ltk-intro-line-up   { bottom: 50%; background: linear-gradient(to top,   rgba(251,191,36,.85) 0%, rgba(251,191,36,.12) 70%, transparent 100%); }
        .ltk-intro-line-down { top:    50%; background: linear-gradient(to bottom, rgba(251,191,36,.85) 0%, rgba(251,191,36,.12) 70%, transparent 100%); }

        /* Intro ripple rings */
        .ltk-ripple-ring {
          position: absolute; left: 50%; top: 50%;
          width: 60px; height: 60px; margin: -30px 0 0 -30px;
          border-radius: 50%; transform: scale(0); z-index: 2;
        }
        @keyframes ltk-ripple-expand {
          0%   { transform: scale(0);  opacity: 0.9; }
          60%  {                       opacity: 0.3; }
          100% { transform: scale(28); opacity: 0;   }
        }
        .ltk-ripple-r1 { border: 1px solid rgba(251,191,36,.75); animation: ltk-ripple-expand 2.8s ease-out forwards 0s;   }
        .ltk-ripple-r2 { border: 1px solid rgba(251,191,36,.45); animation: ltk-ripple-expand 2.8s ease-out forwards 0.4s; }
        .ltk-ripple-r3 { border: 1px solid rgba(251,191,36,.22); animation: ltk-ripple-expand 2.8s ease-out forwards 0.8s; }

        /* Breath text */
        .ltk-intro-breath {
          position: absolute; top: calc(50% + 72px); left: 50%;
          transform: translateX(-50%);
          font-family: var(--font-garamond), serif; font-style: italic;
          font-size: 1.1rem; color: rgba(251,191,36,.72);
          letter-spacing: .2em; white-space: nowrap; z-index: 3;
          transition: opacity .9s ease;
          animation: ltk-breath-scale 4.5s ease-in-out infinite;
        }
        @keyframes ltk-breath-scale {
          0%,100% { letter-spacing:.18em; opacity:.62; }
          50%      { letter-spacing:.28em; opacity:.96; }
        }


        /* ══ OFFER CANVAS ════════════════════════════════════════════ */

        .ltk-offer-canvas {
          position: fixed; inset: 0;
          width: 100vw; height: 100vh;
          z-index: 150; pointer-events: none;
          transition: opacity .5s ease;
        }


        /* ══ PAGE SHELL ══════════════════════════════════════════════ */

        .ltk-page {
          min-height: 100vh;
          background: radial-gradient(ellipse at 50% 0%, #0d1a3a 0%, #050c1f 45%, #020509 100%);
          display: flex; flex-direction: column; align-items: center;
          padding: 116px 1.5rem 100px;
          position: relative; overflow-x: hidden;
        }
        .ltk-page::before {
          content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            radial-gradient(1.5px 1.5px at 12% 18%, rgba(251,191,36,.18) 0%, transparent 100%),
            radial-gradient(1px   1px   at 78% 10%, rgba(255,255,255,.10) 0%, transparent 100%),
            radial-gradient(1px   1px   at 40% 82%, rgba(251,191,36,.12) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 90% 55%, rgba(255,255,255,.07) 0%, transparent 100%),
            radial-gradient(1px   1px   at  6% 92%, rgba(251,191,36,.10) 0%, transparent 100%),
            radial-gradient(1px   1px   at 58% 44%, rgba(255,255,255,.06) 0%, transparent 100%);
        }
        .ltk-page > * { position: relative; z-index: 1; }


        /* ══ AUDIO BUTTON ════════════════════════════════════════════ */

        .ltk-audio-btn {
          position: fixed; top: 88px; right: 22px; z-index: 60;
          width: 42px; height: 42px; border-radius: 50%;
          border: 1px solid rgba(251,191,36,.28);
          background: rgba(5,12,31,.8); backdrop-filter: blur(10px);
          color: rgba(251,191,36,.45);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: border-color .35s, color .35s, box-shadow .35s;
        }
        .ltk-audio-btn:hover, .ltk-audio-btn--on {
          border-color: rgba(251,191,36,.7); color: #fbbf24;
          box-shadow: 0 0 20px rgba(251,191,36,.22);
        }


        /* ══ HEADER ══════════════════════════════════════════════════ */

        .ltk-header { text-align: center; max-width: 680px; margin-bottom: 3.5rem; }
        .ltk-symbol { font-size: 2.2rem; color: rgba(251,191,36,.38); margin-bottom: .85rem; letter-spacing: .12em; display: block; }
        .ltk-title {
          font-family: var(--font-garamond), serif;
          font-size: clamp(3rem, 9vw, 5.5rem); font-weight: 600; letter-spacing: .02em;
          background: linear-gradient(160deg, #a87010 0%, #d4900e 25%, #fbbf24 55%, #fef08a 75%, #d4900e 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          filter: drop-shadow(0 0 32px rgba(200,150,12,.3));
          margin-bottom: .9rem; line-height: 1.05;
        }
        .ltk-subtitle {
          font-family: var(--font-garamond), serif; font-size: 1.15rem;
          color: rgba(255,255,255,.38); letter-spacing: .1em; font-style: italic;
        }


        /* ══ CONTAINER & PROSE ═══════════════════════════════════════ */

        .ltk-container { width: 100%; max-width: 680px; display: flex; flex-direction: column; }

        .ltk-prose-block { margin-bottom: 2rem; }
        .ltk-prose-block p {
          font-family: var(--font-garamond), serif; font-size: 1.08rem;
          line-height: 1.95; color: rgba(255,255,255,.52); margin-bottom: 1rem;
        }
        .ltk-prose-block p:last-child { margin-bottom: 0; }
        .ltk-prose-intro p { font-size: 1.12rem; color: rgba(255,255,255,.6); line-height: 2; }

        .ltk-prose-privacy {
          background: rgba(200,150,12,.03); border-radius: 14px;
          padding: 1.5rem 1.75rem; border: 1px solid rgba(251,191,36,.08);
          margin-bottom: 2.5rem;
        }
        .ltk-prose-privacy p { color: rgba(255,255,255,.44); font-size: 1rem; }
        .ltk-privacy-icon { font-size: 1.2rem; margin-bottom: .85rem; opacity: .55; }

        .ltk-prose-closing { margin-top: 2rem; margin-bottom: 1rem; text-align: center; padding: 0 1rem; }
        .ltk-prose-closing p {
          font-family: var(--font-garamond), serif; font-size: 1.05rem;
          font-style: italic; color: rgba(255,255,255,.35); line-height: 1.9;
        }


        /* ══ GITA VERSE ══════════════════════════════════════════════ */

        .ltk-verse {
          border-left: 2px solid rgba(251,191,36,.32); padding: 1.25rem 1.5rem;
          background: rgba(251,191,36,.025); border-radius: 0 12px 12px 0;
          margin-bottom: 2.5rem;
        }
        .ltk-verse-text {
          display: block; font-family: var(--font-garamond), serif; font-style: italic;
          font-size: 1.05rem; color: rgba(255,255,255,.65); line-height: 1.9; margin-bottom: .55rem;
        }
        .ltk-verse-ref {
          display: block; font-size: .72rem; color: rgba(251,191,36,.6);
          letter-spacing: .12em; margin-bottom: .45rem; font-style: normal;
          font-family: var(--font-inter), sans-serif;
        }
        .ltk-verse-meaning { display: block; font-size: .82rem; color: rgba(255,255,255,.3); font-style: italic; }


        /* ══ DIVIDER ══════════════════════════════════════════════════ */

        .ltk-section-divider { display: flex; align-items: center; gap: 1rem; margin-bottom: 2.5rem; }
        .ltk-divider-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(251,191,36,.2), transparent); }
        .ltk-divider-dot { font-size: .7rem; color: rgba(251,191,36,.38); }


        /* ══ WRITING AREA ════════════════════════════════════════════ */

        .ltk-writing-area { display: flex; flex-direction: column; gap: .65rem; margin-bottom: 1.75rem; }
        .ltk-label {
          font-size: .72rem; letter-spacing: .14em; color: rgba(251,191,36,.42);
          text-transform: uppercase; font-family: var(--font-inter), sans-serif;
        }
        .ltk-textarea {
          width: 100%; min-height: 260px; padding: 1.3rem 1.5rem;
          font-family: var(--font-garamond), serif; font-size: 1.1rem; line-height: 1.85;
          color: rgba(255,255,255,.85); background: rgba(255,255,255,.018);
          border: 1px solid rgba(251,191,36,.15); border-radius: 14px;
          outline: none; resize: vertical;
          transition: border-color .4s ease, box-shadow .4s ease;
        }
        .ltk-textarea::placeholder { color: rgba(255,255,255,.16); font-style: italic; }
        .ltk-textarea:focus {
          border-color: rgba(251,191,36,.42); background: rgba(255,255,255,.025);
          box-shadow: 0 0 0 3px rgba(251,191,36,.06), inset 0 0 50px rgba(251,191,36,.02);
        }
        .ltk-textarea:disabled { opacity: .35; cursor: not-allowed; }


        /* ══ BREATHE ══════════════════════════════════════════════════ */

        @keyframes ltk-breathe {
          0%,100% { opacity:.42; letter-spacing:.12em; transform:scale(1); }
          50%      { opacity:.75; letter-spacing:.20em; transform:scale(1.03); }
        }
        .ltk-breathe {
          text-align: center; font-family: var(--font-garamond), serif; font-style: italic;
          font-size: 1rem; color: rgba(251,191,36,.55);
          animation: ltk-breathe 4.5s ease-in-out infinite;
          user-select: none; margin-bottom: 1.75rem;
        }


        /* ══ OFFER BUTTON ════════════════════════════════════════════ */

        @keyframes ltk-btn-glow {
          0%   { box-shadow: 0 4px 18px rgba(200,150,12,.2); }
          100% { box-shadow: 0 6px 44px rgba(251,191,36,.44); }
        }
        .ltk-offer-btn {
          display: flex; align-items: center; justify-content: center; gap: .65rem;
          margin: 0 auto 2.5rem; padding: 1rem 3.25rem; border-radius: 9999px; border: none;
          background: linear-gradient(135deg, #7c3a0a, #b45309, #d97706, #f5a623);
          color: #fff; font-family: var(--font-garamond), serif;
          font-size: 1.18rem; letter-spacing: .07em; cursor: pointer;
          animation: ltk-btn-glow 2.8s ease-in-out infinite alternate;
          transition: transform .28s ease, opacity .22s ease;
        }
        .ltk-offer-btn:hover:not(:disabled)  { transform: translateY(-3px); }
        .ltk-offer-btn:active:not(:disabled) { transform: translateY(-1px); }
        .ltk-offer-btn:disabled {
          opacity: .28; cursor: not-allowed; animation: none;
          background: linear-gradient(135deg, #2e1f08, #4a3015);
        }
        .ltk-offer-btn__lotus { display: inline-flex; align-items: center; justify-content: center; }
        .ltk-gold-mini-feather {
          width: 22px; height: 22px;
          display: inline-block;
          vertical-align: middle;
          filter: drop-shadow(0 0 4px rgba(251,191,36,0.3));
          margin-right: 0.2rem;
        }
        .ltk-gold-symbol-svg {
          width: 5.5rem; height: 5.5rem;
          display: block; margin: 0 auto;
          filter: drop-shadow(0 0 16px rgba(251,191,36,0.4));
        }

        .ltk-privacy-note {
          text-align: center; font-size: .7rem; color: rgba(255,255,255,.16);
          letter-spacing: .06em; font-family: var(--font-inter), sans-serif;
          margin-top: .5rem;
        }


        /* ══ DIVINE MODAL ════════════════════════════════════════════ */

        @keyframes ltk-overlay-in {
          from { opacity: 0; } to { opacity: 1; }
        }
        .ltk-divine-overlay {
          position: fixed; inset: 0; z-index: 200;
          display: flex; align-items: center; justify-content: center; padding: 1.5rem;
          background: transparent;
        }
        .ltk-divine-overlay--visible {
          background: rgba(2,5,15,.92);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          animation: ltk-overlay-in .9s ease forwards;
        }
        @keyframes ltk-card-rise {
          from { opacity: 0; transform: translateY(40px) scale(.94); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ltk-divine-card {
          max-width: 560px; width: 100%;
          background: linear-gradient(160deg, rgba(8,14,36,.97) 0%, rgba(2,5,15,.99) 100%);
          border: 1px solid rgba(251,191,36,.25); border-radius: 24px; padding: 3rem 2.5rem;
          text-align: center;
          box-shadow: 0 0 100px rgba(200,150,12,.12), 0 0 240px rgba(200,150,12,.05), inset 0 1px 0 rgba(251,191,36,.08);
          animation: ltk-card-rise .75s cubic-bezier(.22,1,.36,1) forwards;
        }
        @keyframes ltk-lotus-pulse { 0%,100% { transform:scale(1); opacity:.82; } 50% { transform:scale(1.08); opacity:1; } }
        .ltk-divine-symbol { margin-bottom: 1.25rem; animation: ltk-lotus-pulse 3s ease-in-out infinite; display: block; }
        .ltk-divine-from {
          font-size: .7rem; letter-spacing: .2em; color: rgba(251,191,36,.42);
          text-transform: uppercase; font-family: var(--font-inter), sans-serif; margin-bottom: 2rem;
        }
        .ltk-divine-message {
          font-family: var(--font-garamond), serif;
          font-size: clamp(1.05rem, 2.4vw, 1.3rem); line-height: 1.9;
          color: rgba(255,255,255,.86); font-style: italic;
          text-shadow: 0 0 50px rgba(200,150,12,.14); margin-bottom: 2.25rem;
        }
        .ltk-divine-divider {
          width: 55px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(251,191,36,.45), transparent);
          margin: 0 auto 2.25rem;
        }
        .ltk-divine-close {
          padding: .82rem 2.5rem; border-radius: 9999px;
          border: 1px solid rgba(251,191,36,.35); background: transparent;
          color: rgba(251,191,36,.72); font-family: var(--font-garamond), serif;
          font-size: 1rem; letter-spacing: .08em; cursor: pointer; transition: all .3s ease;
        }
        .ltk-divine-close:hover {
          background: rgba(251,191,36,.07); border-color: rgba(251,191,36,.65);
          color: #fbbf24; box-shadow: 0 0 24px rgba(251,191,36,.18);
        }


        /* ══ RESPONSIVE ══════════════════════════════════════════════ */

        @media (max-width: 640px) {
          .ltk-page { padding-top: 100px; padding-left: 1.1rem; padding-right: 1.1rem; }
          .ltk-prose-privacy { padding: 1.25rem; }
          .ltk-divine-card { padding: 2.25rem 1.5rem; }
          .ltk-offer-btn { padding: .9rem 2.25rem; font-size: 1.05rem; }
          .ltk-intro-breath { font-size: .95rem; }
          .ltk-gate-title { font-size: 2rem; }
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .ltk-curtain, .ltk-intro-line, .ltk-intro-overlay,
          .ltk-ripple-ring, .ltk-intro-breath, .ltk-intro-dot,
          .ltk-gate-ripple, .ltk-gate { transition: none !important; animation: none !important; }
        }

      `}</style>
    </>
  )
}
