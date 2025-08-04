interface CountdownTimerProps {
  days?: number
  hours?: number
  minutes?: number
}

export default function CountdownTimer({ days = 0, hours = 0, minutes = 0 }: CountdownTimerProps) {
  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-center space-x-8">
        <div className="text-center">
          <div className="text-3xl font-light text-gray-800">{days}</div>
          <div className="text-xs text-gray-500 mt-1">DAYS</div>
        </div>
        <div className="w-px h-12 bg-gray-300"></div>
        <div className="text-center">
          <div className="text-3xl font-light text-gray-800">{hours}</div>
          <div className="text-xs text-gray-500 mt-1">HOURS</div>
        </div>
        <div className="w-px h-12 bg-gray-300"></div>
        <div className="text-center">
          <div className="text-3xl font-light text-gray-800">{minutes}</div>
          <div className="text-xs text-gray-500 mt-1">MINUTES</div>
        </div>
      </div>
    </div>
  )
}
