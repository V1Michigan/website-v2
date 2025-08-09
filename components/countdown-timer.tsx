'use client'

import { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownTimerProps {
  targetDate?: Date
  className?: string
}

// Function to get the next October 6th
function getNextOctober6th(): Date {
  const now = new Date()
  const currentYear = now.getFullYear()

  // Try this year's October 6th first
  let targetDate = new Date(currentYear, 9, 6, 9, 0, 0) // Month is 0-indexed, so 9 = October

  // If this year's October 6th has passed, use next year's
  if (targetDate.getTime() <= now.getTime()) {
    targetDate = new Date(currentYear + 1, 9, 6, 9, 0, 0)
  }

  return targetDate
}

export default function CountdownTimer({
  targetDate,
  className = ''
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isClient, setIsClient] = useState(false)
  const [actualTargetDate, setActualTargetDate] = useState<Date | null>(null)

  useEffect(() => {
    setIsClient(true)
    const target = targetDate || getNextOctober6th()
    setActualTargetDate(target)
    console.log('Target date:', target.toString()) // Debug log
  }, [targetDate])

  useEffect(() => {
    if (!isClient || !actualTargetDate) return

    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date().getTime()
      const target = actualTargetDate.getTime()
      const difference = target - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        return { days, hours, minutes, seconds }
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    // Calculate initial time
    const initialTime = calculateTimeLeft()
    setTimeLeft(initialTime)

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)
    }, 1000)

    return () => clearInterval(timer)
  }, [actualTargetDate, isClient])

  // Prevent hydration mismatch by showing loading state
  if (!isClient || !actualTargetDate) {
    return (
      <div className={`flex items-center justify-center space-x-2 sm:space-x-3 md:space-x-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  const timeUnits = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' }
  ]

  return (
    <div className={`px-0 py-0 ${className}`}>
      <div className="flex items-center justify-center space-x-2 sm:space-x-3 md:space-x-4">
        <div className="text-center">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-instrument font-normal text-gray-800">{timeUnits[0].value.toString().padStart(2, '0')}</div>
          <div className="text-xs sm:text-sm font-inter text-gray-500 mt-1">DAYS</div>
        </div>
        <div className="w-px h-6 sm:h-8 md:h-10 bg-gray-300"></div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-instrument font-normal text-gray-800">{timeUnits[1].value.toString().padStart(2, '0')}</div>
          <div className="text-xs sm:text-sm font-inter text-gray-500 mt-1">HOURS</div>
        </div>
        <div className="w-px h-6 sm:h-8 md:h-10 bg-gray-300"></div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-instrument font-normal text-gray-800">{timeUnits[2].value.toString().padStart(2, '0')}</div>
          <div className="text-xs sm:text-sm font-inter text-gray-500 mt-1">MINUTES</div>
        </div>
        <div className="w-px h-6 sm:h-8 md:h-10 bg-gray-300"></div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-instrument font-normal text-gray-800">{timeUnits[3].value.toString().padStart(2, '0')}</div>
          <div className="text-xs sm:text-sm font-inter text-gray-500 mt-1">SECONDS</div>
        </div>
      </div>
    </div>
  )
}
