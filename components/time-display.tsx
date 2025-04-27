"use client"

import { useEffect, useState } from "react"
import { Edit2, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function TimeDisplay({
  location,
  time,
  isLight,
  isInput = false,
  onTimeChange = null,
  autoUpdateTime = true,
  onResetTime = null,
}) {
  const [currentTime, setCurrentTime] = useState(time)
  const [isEditing, setIsEditing] = useState(false)
  const [editHour, setEditHour] = useState("")
  const [editMinute, setEditMinute] = useState("")

  useEffect(() => {
    setCurrentTime(time)
  }, [time])

  const startEditing = () => {
    if (!isInput || !onTimeChange) return

    setEditHour(currentTime.toFormat("HH"))
    setEditMinute(currentTime.toFormat("mm"))
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
  }

  const saveTimeEdit = () => {
    const hour = Number.parseInt(editHour, 10)
    const minute = Number.parseInt(editMinute, 10)

    if (isNaN(hour) || hour < 0 || hour > 23 || isNaN(minute) || minute < 0 || minute > 59) {
      cancelEditing()
      return
    }

    const newTime = currentTime.set({ hour, minute })
    onTimeChange(newTime)
    setIsEditing(false)
  }

  if (!location.location || !location.timezone || !currentTime.isValid) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Please select a location</p>
      </div>
    )
  }

  const textColorClass = isLight ? "text-gray-900" : "text-white"
  const isDayTime = isDaytime(currentTime)

  return (
    <div className="flex-1 flex flex-col items-center justify-center mt-1 sm:mt-2 md:mt-3">
      <h3 className={`text-base font-medium mb-1 sm:mb-2 ${textColorClass}`}>{location.location}</h3>

      {isEditing ? (
        <div className="flex items-center space-x-2 mb-1 sm:mb-2">
          <Input
            value={editHour}
            onChange={(e) => setEditHour(e.target.value)}
            className="w-16 h-10 text-lg text-center"
            maxLength={2}
          />
          <span className={`text-2xl font-bold ${textColorClass}`}>:</span>
          <Input
            value={editMinute}
            onChange={(e) => setEditMinute(e.target.value)}
            className="w-16 h-10 text-lg text-center"
            maxLength={2}
          />
          <div className="flex space-x-1 ml-2">
            <button className="p-1 text-gray-500 hover:text-gray-700" onClick={saveTimeEdit}>
              <Check size={18} />
            </button>
            <button className="p-1 text-gray-500 hover:text-gray-700" onClick={cancelEditing}>
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <div className={`text-5xl font-bold ${textColorClass}`}>{currentTime.toFormat("HH:mm")}</div>
            {isInput && onTimeChange && (
              <button className="ml-2 text-gray-500 hover:text-gray-700" onClick={startEditing}>
                <Edit2 size={18} />
              </button>
            )}
          </div>

          {/* Now button - only show when time has been manually edited */}
          {isInput && !autoUpdateTime && onResetTime && (
            <Button variant="outline" size="sm" className="mt-1 sm:mt-2 text-xs h-7 px-3 py-1" onClick={onResetTime}>
              Now
            </Button>
          )}
        </div>
      )}

      <div className={`text-base mt-1 sm:mt-2 ${textColorClass}`}>{currentTime.toFormat("MMMM d, yyyy")}</div>
      <div className={`mt-0.5 sm:mt-1 text-sm ${textColorClass}`}>{isDayTime ? "Daytime" : "Nighttime"}</div>
    </div>
  )
}

function isDaytime(time) {
  const hour = time.hour
  return hour >= 6 && hour < 18
}
