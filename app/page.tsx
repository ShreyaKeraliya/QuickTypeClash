"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw, Volume2, VolumeX, Share2, Twitter, Facebook, MessageCircle, Instagram } from "lucide-react"

// @ts-nocheck
// If you see errors about missing types for 'react' or 'lucide-react', run:
// npm i --save-dev @types/react @types/lucide-react
// The JSX.IntrinsicElements error is also fixed by installing @types/react

// Game constants
const INITIAL_FALL_SPEED = 4000 // milliseconds (slower start)
const SPEED_INCREASE_RATE = 0.92 // multiply by this each level (more gradual)
const POINTS_PER_WORD = 10
const LEVEL_UP_THRESHOLD = 5 // words per level

// Word lists for different difficulties
const WORD_LISTS = {
  easy: [
    "bat",
    "bear",
    "beige",
    "big",
    "black",
    "blue",
    "brown",
    "bulky",
    "cat",
    "climb",
    "cold",
    "cow",
    "crawl",
    "cyan",
    "dark",
    "deer",
    "dog",
    "draw",
    "drink",
    "dry",
    "duck",
    "eat",
    "fast",
    "fat",
    "fish",
    "fox",
    "frog",
    "giant",
    "goat",
    "gold",
    "gray",
    "green",
    "happy",
    "hard",
    "hot",
    "huge",
    "jump",
    "light",
    "lion",
    "long",
    "magenta",
    "massive",
    "mean",
    "mini",
    "narrow",
    "new",
    "nice",
    "old",
    "orange",
    "pig",
    "pink",
    "play",
    "purple",
    "rat",
    "read",
    "red",
    "run",
    "sad",
    "short",
    "silver",
    "sing",
    "sit",
    "sleep",
    "slim",
    "slow",
    "small",
    "soft",
    "stand",
    "swim",
    "tall",
    "thin",
    "tiger",
    "tiny",
    "walk",
    "wet",
    "white",
    "wide",
    "wolf",
    "write",
    "yellow",
    "apple",
    "bread",
    "chair",
    "dance",
    "eagle",
    "flame",
    "grape",
    "house",
    "ice",
    "joke",
    "knife",
    "lemon",
    "mouse",
    "night",
    "ocean",
    "peace",
    "queen",
    "river",
    "stone",
    "table",
    "uncle",
    "voice",
    "water",
    "extra",
    "youth",
    "zebra",
    "angel",
    "beach",
    "cloud",
    "dream",
    "earth",
    "field",
    "glass",
    "heart",
    "image",
    "jewel",
    "kite",
    "laugh",
    "magic",
    "nurse",
    "olive",
    "paper",
    "quiet",
    "radio",
    "smile",
    "trust",
    "urban",
    "video",
    "world",
    "young",
    "brave",
    "clean",
    "dense",
    "empty",
    "fresh",
    "grand",
    "heavy",
    "ideal",
    "joint",
    "known",
    "local",
    "major",
    "noble",
    "outer",
    "plain",
    "quick",
    "round",
    "solid",
    "thick",
    "upper",
    "vital",
    "whole",
    "exact",
    "young",
    "zero",
    "basic",
    "chief",
    "daily",
    "early",
    "final",
    "great",
    "human",
    "inner",
    "joint",
    "large",
    "minor",
    "north",
    "other",
    "prime",
    "right",
    "south",
    "total",
    "under",
    "vital",
    "worth",
    "above",
    "below",
    "close",
    "equal",
    "first",
  ],
  medium: [
    "angry",
    "anxious",
    "api",
    "app",
    "array",
    "back",
    "bored",
    "brave",
    "bright",
    "bug",
    "build",
    "calm",
    "clicks",
    "cloud",
    "code",
    "codes",
    "confused",
    "cries",
    "css",
    "curious",
    "dark",
    "data",
    "div",
    "downloads",
    "excited",
    "fix",
    "focused",
    "friendly",
    "front",
    "funny",
    "fuzzy",
    "grumpy",
    "happy",
    "hopeful",
    "hops",
    "html",
    "input",
    "jealous",
    "json",
    "jumps",
    "key",
    "laughs",
    "lazy",
    "logic",
    "login",
    "logout",
    "loop",
    "motivated",
    "node",
    "noisy",
    "normal",
    "object",
    "presses",
    "quick",
    "react",
    "sad",
    "screams",
    "script",
    "scrolls",
    "serious",
    "server",
    "shares",
    "sharp",
    "silent",
    "skips",
    "sleepy",
    "stack",
    "stormy",
    "style",
    "tag",
    "test",
    "thinks",
    "tired",
    "types",
    "uploads",
    "value",
    "web",
    "weird",
    "zooms",
    "action",
    "button",
    "canvas",
    "dialog",
    "editor",
    "filter",
    "global",
    "header",
    "import",
    "jquery",
    "kernel",
    "layout",
    "method",
    "navbar",
    "output",
    "plugin",
    "render",
    "syntax",
    "theme",
    "update",
    "vector",
    "widget",
    "export",
    "format",
    "github",
    "handle",
    "inline",
    "module",
    "nested",
    "option",
    "parser",
    "random",
    "socket",
    "thread",
    "unique",
    "vendor",
    "window",
    "border",
    "center",
    "delete",
    "escape",
    "folder",
    "google",
    "height",
    "italic",
    "jquery",
    "kernel",
    "length",
    "margin",
    "number",
    "online",
    "parent",
    "result",
    "search",
    "target",
    "upload",
    "vendor",
    "weight",
    "active",
    "binary",
    "custom",
    "double",
    "enable",
    "frozen",
    "global",
    "hidden",
    "italic",
    "joined",
    "locked",
    "mobile",
    "native",
    "opened",
    "public",
    "remote",
    "secure",
    "toggle",
    "unique",
    "visual",
    "wizard",
    "yellow",
    "zipped",
    "backup",
    "cached",
    "deploy",
    "engine",
    "frozen",
    "github",
    "hosted",
  ],
  hard: [
    "angular",
    "array",
    "async",
    "await",
    "backtrack",
    "bfs",
    "binary",
    "bootstrap",
    "bubble",
    "class",
    "closure",
    "compile",
    "component",
    "conquer",
    "context",
    "debug",
    "deque",
    "dfs",
    "dijkstra",
    "divide",
    "django",
    "dp",
    "dynamic",
    "execute",
    "express",
    "flask",
    "framework",
    "function",
    "graph",
    "greedy",
    "hashmap",
    "heap",
    "hook",
    "inheritance",
    "instance",
    "javascript",
    "laravel",
    "library",
    "linkedlist",
    "list",
    "loop",
    "material",
    "matrix",
    "memo",
    "merge",
    "middleware",
    "mutation",
    "next",
    "node",
    "nuxt",
    "object",
    "parameter",
    "promise",
    "props",
    "query",
    "queue",
    "quick",
    "rails",
    "react",
    "record",
    "recursion",
    "refactor",
    "reference",
    "responsive",
    "route",
    "ruby",
    "search",
    "set",
    "sort",
    "spring",
    "stack",
    "state",
    "svelte",
    "table",
    "tailwind",
    "tree",
    "trie",
    "typescript",
    "variable",
    "vue",
    "algorithm",
    "authentication",
    "authorization",
    "benchmark",
    "configuration",
    "deployment",
    "documentation",
    "environment",
    "implementation",
    "infrastructure",
    "integration",
    "optimization",
    "performance",
    "repository",
    "specification",
    "synchronization",
    "transformation",
    "virtualization",
    "abstraction",
    "architecture",
    "asynchronous",
    "compatibility",
    "concurrency",
    "constructor",
    "encapsulation",
    "polymorphism",
    "serialization",
    "deserialization",
    "microservice",
    "containerization",
    "orchestration",
    "scalability",
    "reliability",
    "availability",
    "consistency",
    "transaction",
    "distributed",
    "federation",
    "replication",
    "partitioning",
    "sharding",
    "caching",
    "indexing",
    "normalization",
    "denormalization",
    "aggregation",
    "composition",
    "inheritance",
    "delegation",
    "dependency",
    "injection",
    "inversion",
    "singleton",
    "factory",
    "observer",
    "strategy",
    "decorator",
    "adapter",
    "facade",
    "proxy",
    "command",
    "iterator",
    "template",
    "visitor",
    "mediator",
    "memento",
    "prototype",
    "builder",
    "composite",
    "flyweight",
    "interpreter",
    "state",
    "chain",
    "responsibility",
    "bridge",
  ],
}

interface FallingWord {
  id: number
  text: string
  x: number
  y: number
  speed: number
}

type GameState = "start" | "playing" | "gameOver"

export default function QuickTypeClash() {
  const [gameState, setGameState] = useState<GameState>("start")
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [wordsTyped, setWordsTyped] = useState(0)
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [fallSpeed, setFallSpeed] = useState(INITIAL_FALL_SPEED)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false)
  const [gameStartTime, setGameStartTime] = useState<number>(0)
  const [gameEndTime, setGameEndTime] = useState<number>(0)
  // Add this state for image generation
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  const gameAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const shareCardRef = useRef<HTMLDivElement>(null)
  const wordIdCounter = useRef(0)
  const gameLoopRef = useRef<NodeJS.Timeout>()
  const wordSpawnRef = useRef<NodeJS.Timeout>()

  // Calculate game statistics
  const gameDuration = gameEndTime - gameStartTime
  const wpm = gameDuration > 0 ? Math.round(wordsTyped / (gameDuration / 60000) || 0) : 0
  const accuracy = wordsTyped > 0 ? Math.round((wordsTyped / (wordsTyped + 1)) * 100) : 100 // Simplified accuracy

  // Sound effects
  const playSound = useCallback(
    (type: "success" | "fail") => {
      if (!soundEnabled) return

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      if (type === "success") {
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1)
      } else {
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.2)
      }

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    },
    [soundEnabled],
  )

  // Get random word based on level
  const getRandomWord = useCallback(() => {
    let wordList = WORD_LISTS.easy
    if (level > 10) wordList = WORD_LISTS.hard
    else if (level > 5) wordList = WORD_LISTS.medium

    return wordList[Math.floor(Math.random() * wordList.length)]
  }, [level])

  // Spawn new falling word
  const spawnWord = useCallback(() => {
    if (gameState !== "playing") return

    const newWord: FallingWord = {
      id: wordIdCounter.current++,
      text: getRandomWord(),
      x: Math.random() * 80 + 10, // 10% to 90% of screen width
      y: 0,
      speed: fallSpeed,
    }

    setFallingWords((prev: FallingWord[]) => [...prev, newWord])
  }, [gameState, getRandomWord, fallSpeed])

  // Update falling words positions
  const updateWords = useCallback(() => {
    if (gameState !== "playing") return

    setFallingWords((prev: FallingWord[]) => {
      const updated = prev.map((word: FallingWord) => ({
        ...word,
        y: word.y + (100 / word.speed) * 12, // Slower movement calculation
      }))

      // Check for words that reached the bottom
      const reachedBottom = updated.some((word: FallingWord) => word.y >= 85)
      if (reachedBottom) {
        playSound("fail")
        setGameState("gameOver")
        setGameEndTime(Date.now())
        return []
      }

      return updated.filter((word: FallingWord) => word.y < 85)
    })
  }, [gameState, playSound])

  // Handle word typing
  const handleWordType = useCallback(
    (typedWord: string) => {
      const matchedWordIndex = fallingWords.findIndex((word: FallingWord) => word.text.toLowerCase() === typedWord.toLowerCase())

      if (matchedWordIndex !== -1) {
        playSound("success")
        setScore((prev: number) => prev + POINTS_PER_WORD * level)
        setWordsTyped((prev: number) => prev + 1)
        setFallingWords((prev: FallingWord[]) => prev.filter((_, index: number) => index !== matchedWordIndex))
        setCurrentInput("")

        // Level up logic
        if ((wordsTyped + 1) % LEVEL_UP_THRESHOLD === 0) {
          setLevel((prev: number) => prev + 1)
          setFallSpeed((prev: number) => Math.max(prev * SPEED_INCREASE_RATE, 1200)) // Minimum speed limit
        }
      }
    },
    [fallingWords, level, wordsTyped, playSound],
  )

  // Start game
  const startGame = useCallback(() => {
    setGameState("playing")
    setScore(0)
    setLevel(1)
    setWordsTyped(0)
    setFallingWords([])
    setCurrentInput("")
    setFallSpeed(INITIAL_FALL_SPEED)
    setGameStartTime(Date.now())
    setGameEndTime(0)

    // Focus input
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  // Game loop
  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = setInterval(updateWords, 16) // ~60fps
      wordSpawnRef.current = setInterval(spawnWord, Math.max(fallSpeed / 2.5, 1000)) // Slower spawn rate

      return () => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current)
        if (wordSpawnRef.current) clearInterval(wordSpawnRef.current)
      }
    }
  }, [gameState, updateWords, spawnWord, fallSpeed])

  // Handle input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCurrentInput(value)

    if (value.includes(" ")) {
      const word = value.trim()
      if (word) {
        handleWordType(word)
      }
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const word = currentInput.trim()
      if (word) {
        handleWordType(word)
      }
    }
  }

  // Generate and share score card as image
  const generateScoreImage = async () => {
    if (!shareCardRef.current) return null

    setIsGeneratingImage(true)

    try {
      // Create a temporary canvas
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return null

      // Set canvas size
      canvas.width = 800
      canvas.height = 600

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "#7c3aed")
      gradient.addColorStop(0.5, "#2563eb")
      gradient.addColorStop(1, "#4338ca")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add background pattern
      ctx.globalAlpha = 0.1
      ctx.font = "60px Arial"
      ctx.fillText("⌨️", 50, 100)
      ctx.fillText("⚡", 700, 100)
      ctx.fillText("🎯", 50, 550)
      ctx.fillText("🏆", 700, 550)
      ctx.globalAlpha = 1

      // Add title
      ctx.fillStyle = "#fbbf24"
      ctx.font = "bold 48px Arial"
      ctx.textAlign = "center"
      ctx.fillText("QuickType Clash", canvas.width / 2, 100)

      // Add performance rating
      ctx.fillStyle = performance.color.includes("yellow")
        ? "#fbbf24"
        : performance.color.includes("purple")
          ? "#a855f7"
          : performance.color.includes("blue")
            ? "#3b82f6"
            : performance.color.includes("green")
              ? "#10b981"
              : performance.color.includes("orange")
                ? "#f97316"
                : "#9ca3af"
      ctx.font = "bold 32px Arial"
      ctx.fillText(`${performance.emoji} ${performance.rating}`, canvas.width / 2, 160)

      // Add stats boxes
      const stats = [
        { label: "Score", value: score.toString(), color: "#fbbf24" },
        { label: "Level", value: level.toString(), color: "#10b981" },
        { label: "Words", value: wordsTyped.toString(), color: "#3b82f6" },
        { label: "WPM", value: wpm.toString(), color: "#a855f7" },
      ]

      stats.forEach((stat, index) => {
        const x = 150 + (index % 2) * 300
        const y = 250 + Math.floor(index / 2) * 120

        // Draw stat box background
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
        ctx.fillRect(x - 80, y - 40, 160, 80)

        // Draw stat value
        ctx.fillStyle = stat.color
        ctx.font = "bold 36px Arial"
        ctx.textAlign = "center"
        ctx.fillText(stat.value, x, y - 5)

        // Draw stat label
        ctx.fillStyle = "#d1d5db"
        ctx.font = "18px Arial"
        ctx.fillText(stat.label, x, y + 25)
      })

      // Add footer text
      ctx.fillStyle = "#d1d5db"
      ctx.font = "20px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Can you beat this score? 🚀", canvas.width / 2, 520)

      // Convert to blob
      return new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/png", 0.9)
      })
    } catch (error) {
      console.error("Error generating image:", error)
      return null
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const shareToWhatsApp = async () => {
    const imageBlob = await generateScoreImage()
    if (imageBlob) {
      const file = new File([imageBlob], "quicktype-score.png", { type: "image/png" })
      if (navigator.share && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "My QuickType Clash Score!",
            text: generateShareText(),
          })
        } catch (error) {
          // Fallback to text sharing
          const text = encodeURIComponent(generateShareText())
          const url = `https://wa.me/?text=${text}`
          window.open(url, "_blank")
        }
      } else {
        // Fallback to text sharing
        const text = encodeURIComponent(generateShareText())
        const url = `https://wa.me/?text=${text}`
        window.open(url, "_blank")
      }
    }
  }

  const shareToInstagram = async () => {
    const imageBlob = await generateScoreImage()
    if (imageBlob) {
      try {
        const file = new File([imageBlob], "quicktype-score.png", { type: "image/png" })
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "My QuickType Clash Score!",
          })
        } else {
          // Download the image for manual sharing
          const url = URL.createObjectURL(imageBlob)
          const a = document.createElement("a")
          a.href = url
          a.download = "quicktype-clash-score.png"
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          alert("Image downloaded! You can now share it on Instagram.")
        }
      } catch (error) {
        console.error("Error sharing to Instagram:", error)
      }
    }
  }

  const shareToTwitter = async () => {
    const imageBlob = await generateScoreImage()
    if (imageBlob) {
      try {
        const file = new File([imageBlob], "quicktype-score.png", { type: "image/png" })
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "My QuickType Clash Score!",
            text: generateShareText(),
          })
        } else {
          // Fallback to text sharing
          const text = encodeURIComponent(generateShareText())
          const url = `https://twitter.com/intent/tweet?text=${text}`
          window.open(url, "_blank")
        }
      } catch (error) {
        const text = encodeURIComponent(generateShareText())
        const url = `https://twitter.com/intent/tweet?text=${text}`
        window.open(url, "_blank")
      }
    }
  }

  const shareToFacebook = async () => {
    const imageBlob = await generateScoreImage()
    if (imageBlob) {
      try {
        const file = new File([imageBlob], "quicktype-score.png", { type: "image/png" })
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "My QuickType Clash Score!",
          })
        } else {
          // Fallback to URL sharing
          const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
          window.open(url, "_blank")
        }
      } catch (error) {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
        window.open(url, "_blank")
      }
    }
  }

  const generateShareText = () => {
    return `Final Score: ${score}, Level: ${level}, Words Typed: ${wordsTyped}, WPM: ${wpm}\nPlay QuickType Clash: ${typeof window !== 'undefined' ? window.location.href : ''}`
  }

  const getPerformanceRating = () => {
    if (score >= 2000) return { rating: "LEGENDARY", color: "text-yellow-400", emoji: "👑" }
    if (score >= 1500) return { rating: "MASTER", color: "text-purple-400", emoji: "🏆" }
    if (score >= 1000) return { rating: "EXPERT", color: "text-blue-400", emoji: "⭐" }
    if (score >= 500) return { rating: "SKILLED", color: "text-green-400", emoji: "🎯" }
    if (score >= 200) return { rating: "GOOD", color: "text-orange-400", emoji: "👍" }
    return { rating: "BEGINNER", color: "text-gray-400", emoji: "🌱" }
  }

  const performance = getPerformanceRating()

  // Start Screen Component
  const StartScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-black/20 backdrop-blur-lg border-white/20 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            QuickType Clash
          </CardTitle>
          <p className="text-xl md:text-2xl text-gray-300 mt-4">Type the falling words before they hit the bottom!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-400">How to Play</h3>
                <p>Type words as they fall from the top</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold text-green-400">Scoring</h3>
                <p>10 points × level per word</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold text-red-400">Game Over</h3>
                <p>One word hits the bottom</p>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={startGame}
                size="lg"
                className="text-lg sm:text-xl px-8 py-4 sm:px-12 sm:py-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <Play className="mr-2 h-6 w-6" />
                Start Game
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-white hover:bg-white/10"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                {soundEnabled ? "Sound On" : "Sound Off"}
              </Button>
            </div>
          </div>

          {/* AdSense Banner Placeholder */}
          <div className="bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            <p className="text-gray-400">Advertisement Space</p>
            <p className="text-sm text-gray-500">728x90 Banner</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Game Screen Component
  const GameScreen = () => (
    <div className="min-h-[100dvh] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Score Board */}
      <div className="absolute top-2 left-2 right-2 z-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex gap-2 sm:gap-4">
            <Badge variant="secondary" className="text-base px-3 py-2 bg-black/50 text-white">
              Score: {score}
            </Badge>
            <Badge variant="secondary" className="text-base px-3 py-2 bg-black/50 text-white">
              Level: {level}
            </Badge>
            <Badge variant="secondary" className="text-base px-3 py-2 bg-black/50 text-white">
              Words: {wordsTyped}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-white hover:bg-white/10 mt-2 sm:mt-0"
          >
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Game Area */}
      <div ref={gameAreaRef} className="relative w-full h-[100dvh] pt-24 pb-28 sm:pt-20 sm:pb-20">
        {fallingWords.map((word: FallingWord) => (
          <div
            key={word.id}
            className="absolute text-xl sm:text-2xl md:text-3xl font-bold text-white bg-black/50 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/20 transition-all duration-75 select-none"
            style={{
              left: `${word.x}%`,
              top: `${word.y}%`,
              transform: "translateX(-50%)",
            }}
          >
            {word.text}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-2 left-2 right-2">
        <div className="max-w-md mx-auto">
          <Input
            ref={inputRef}
            value={currentInput}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder="Type the falling words..."
            className="text-lg p-4 bg-black/50 border-white/20 text-white placeholder-gray-400 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-yellow-400"
            autoFocus
          />
          <p className="text-center text-sm text-gray-300 mt-2">Press Space or Enter after typing each word</p>
        </div>
      </div>
    </div>
  )

  // Game Over Screen Component
  const GameOverScreen = () => (
    <div className="min-h-[100dvh] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-xs sm:max-w-2xl bg-black/20 backdrop-blur-lg border-white/20 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-5xl font-bold text-red-400 mb-4">Game Over!</CardTitle>
          <div className="space-y-2">
            <p className="text-xl md:text-3xl font-bold text-yellow-400">Final Score: {score}</p>
            <div className={`text-lg font-bold ${performance.color}`}>{performance.emoji} {performance.rating}</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-3 justify-center">
            <Button
              onClick={startGame}
              size="lg"
              className="w-full text-lg px-6 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              <RotateCcw className="mr-2 h-6 w-6" />
              Play Again
            </Button>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setShowShareModal(true)}
                size="lg"
                variant="outline"
                className="flex-1 text-lg px-6 py-4 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
                <Share2 className="mr-2 h-6 w-6" />
                Share Score
              </Button>
              <Button
                onClick={() => setGameState("start")}
                variant="outline"
                size="lg"
                className="flex-1 text-lg px-6 py-4 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              >
                Main Menu
              </Button>
            </div>
          </div>

          {/* Share Modal */}
          {showShareModal && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-1 sm:p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowShareModal(false)
                }
              }}
            >
              <Card className="w-full max-w-xs sm:max-w-2xl bg-black/90 backdrop-blur-lg border-white/20 text-white mx-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base sm:text-2xl flex items-center gap-2">
                      <Share2 className="h-5 w-5 sm:h-6 sm:w-6" />
                      Share Your Achievement
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowShareModal(false)}
                      className="text-white hover:bg-white/10 p-2 h-8 w-8 flex items-center justify-center"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Score Card Preview */}
                  <div
                    ref={shareCardRef}
                    className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-xl p-3 sm:p-6 text-center relative overflow-hidden"
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-2xl sm:text-6xl">⌨️</div>
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-xl sm:text-4xl">⚡</div>
                      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 text-xl sm:text-4xl">🎯</div>
                      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-2xl sm:text-6xl">🏆</div>
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-lg sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                        QuickType Clash
                      </h3>
                      <div className={`text-base sm:text-2xl font-bold ${performance.color} mb-3 sm:mb-4`}>
                        {performance.emoji} {performance.rating}
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
                        <div className="bg-white/10 rounded-lg p-2 sm:p-3">
                          <div className="text-lg sm:text-2xl font-bold text-yellow-400">{score}</div>
                          <div className="text-xs sm:text-sm text-gray-300">Score</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2 sm:p-3">
                          <div className="text-lg sm:text-2xl font-bold text-green-400">{level}</div>
                          <div className="text-xs sm:text-sm text-gray-300">Level</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2 sm:p-3">
                          <div className="text-lg sm:text-2xl font-bold text-blue-400">{wordsTyped}</div>
                          <div className="text-xs sm:text-sm text-gray-300">Words</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2 sm:p-3">
                          <div className="text-lg sm:text-2xl font-bold text-purple-400">{wpm}</div>
                          <div className="text-xs sm:text-sm text-gray-300">WPM</div>
                        </div>
                      </div>

                      <div className="text-xs sm:text-sm text-gray-300">Can you beat this score? 🚀</div>
                    </div>
                  </div>

                  {/* Share Options */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <Button
                      onClick={shareToWhatsApp}
                      disabled={isGeneratingImage}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto py-3 sm:py-4 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors disabled:opacity-50"
                    >
                      <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="text-xs sm:text-sm">{isGeneratingImage ? "Loading..." : "WhatsApp"}</span>
                    </Button>

                    <Button
                      onClick={shareToInstagram}
                      disabled={isGeneratingImage}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto py-3 sm:py-4 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white transition-colors disabled:opacity-50"
                    >
                      <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="text-xs sm:text-sm">{isGeneratingImage ? "Loading..." : "Instagram"}</span>
                    </Button>

                    <Button
                      onClick={shareToTwitter}
                      disabled={isGeneratingImage}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto py-3 sm:py-4 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                      <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="text-xs sm:text-sm">{isGeneratingImage ? "Loading..." : "Twitter"}</span>
                    </Button>

                    <Button
                      onClick={shareToFacebook}
                      disabled={isGeneratingImage}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto py-3 sm:py-4 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50"
                    >
                      <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="text-xs sm:text-sm">{isGeneratingImage ? "Loading..." : "Facebook"}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* AdSense Banner Placeholder */}
          <div className="bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg p-4 text-center max-w-xs mx-auto mt-2">
            <p className="text-gray-400">Advertisement Space</p>
            <p className="text-sm text-gray-500">Banner</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Render based on game state
  return (
    <div className="font-sans">
      {gameState === "start" && <StartScreen />}
      {gameState === "playing" && <GameScreen />}
      {gameState === "gameOver" && <GameOverScreen />}
    </div>
  )
}
