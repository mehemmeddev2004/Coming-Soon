"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "motion/react"

interface MagnetButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  padding?: number
  magnetStrength?: number
  disabled?: boolean

  size?: "sm" | "md" | "lg"
}

const MagnetButton: React.FC<MagnetButtonProps> = ({
  children,
  className = "",
  onClick,
  padding = 150,
  magnetStrength = 0.2,
  disabled = false,
  size = "md",
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const baseClasses = {

    outline: "bg-transparent hover:bg-amber-600 text-amber-600 hover:text-white border-2 border-amber-600",
  }

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  useEffect(() => {
    if (disabled) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return

      const rect = buttonRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distanceX = Math.abs(e.clientX - centerX)
      const distanceY = Math.abs(e.clientY - centerY)

      const maxDistance = Math.max(rect.width, rect.height) / 2 + padding
      const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2))

      if (distance < maxDistance) {
        const strength = 1 - distance / maxDistance
        const easedStrength = Math.pow(strength, 2)

        const x = (e.clientX - centerX) * magnetStrength * easedStrength
        const y = (e.clientY - centerY) * magnetStrength * easedStrength
        setMousePosition({ x, y })
        setIsHovered(true)
      } else {
        setMousePosition({ x: 0, y: 0 })
        setIsHovered(false)
      }
    }

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 })
      setIsHovered(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [padding, magnetStrength, disabled])

  return (
    <motion.button
      ref={buttonRef}
      className={`
        relative
        font-semibold
        rounded-lg
        transition-colors
    
        hover:text-black
        hover:bg-white
        hover:text to-black
        hover:border-1
     
      
       bg-black
       text-white
        max-[991px]:border-none
        duration-300
        shadow-lg
     
        ${sizeClasses[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 0.5,
      }}
      whileTap={{
        scale: disabled ? 1 : 0.95,
      }}
      disabled={disabled}
      aria-disabled={disabled}
    >
      <span className="relative z-10 block">{children}</span>

      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
        animate={{
          opacity: isHovered && !disabled ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-0 rounded-lg bg-amber-400/30 blur-xl pointer-events-none"
        animate={{
          opacity: isHovered && !disabled ? 0.6 : 0,
          scale: isHovered && !disabled ? 1.1 : 0.8,
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
      />
    </motion.button>
  )
}

export default MagnetButton
