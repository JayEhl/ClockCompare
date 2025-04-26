"use client"

import { useState, useEffect } from "react"
import { Settings } from "lucide-react"
import { DateTime } from "luxon"
import LocationSelector from "@/components/location-selector"
import TimeDisplay from "@/components/time-display"
import SettingsModal from "@/components/settings-modal"

// Update the default location function to use the new structure
function setDefaultLocation(setInputLocation, setInputTime, setIsLoading, savedDefaultInput = null) {
  // Use saved default if available, otherwise use New York
  if (savedDefaultInput && savedDefaultInput.location && savedDefaultInput.timezone) {
    setInputLocation(savedDefaultInput)
    setInputTime(DateTime.now().setZone(savedDefaultInput.timezone))
    setIsLoading(false)
    return
  }

  const defaultLocation = "New York, United States"
  const defaultTimezone = "America/New_York"

  setInputLocation({
    location: defaultLocation,
    timezone: defaultTimezone,
  })

  setInputTime(DateTime.now().setZone(defaultTimezone))
  setIsLoading(false)
}

export default function ClockCompare() {
  const [inputLocation, setInputLocation] = useState({
    location: "",
    timezone: "",
  })
  const [outputLocation, setOutputLocation] = useState({
    location: "",
    timezone: "",
  })
  const [inputTime, setInputTime] = useState(DateTime.now())
  const [outputTime, setOutputTime] = useState(DateTime.now())
  const [showSettings, setShowSettings] = useState(false)
  const [useDynamicBackground, setUseDynamicBackground] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [autoUpdateTime, setAutoUpdateTime] = useState(true)
  const [defaultInputLocation, setDefaultInputLocation] = useState(null)
  const [defaultOutputLocation, setDefaultOutputLocation] = useState(null)

  // Load saved settings and apply default locations
  useEffect(() => {
    const savedSettings = localStorage.getItem("clockCompareSettings")
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        const {
          useDynamicBackground: savedDynamicBg,
          defaultInputLocation: savedInputLocation,
          defaultOutputLocation: savedOutputLocation,
        } = parsedSettings

        setUseDynamicBackground(savedDynamicBg !== undefined ? savedDynamicBg : true)

        // Store default locations in state
        if (savedInputLocation) {
          setDefaultInputLocation(savedInputLocation)
        }

        if (savedOutputLocation) {
          setDefaultOutputLocation(savedOutputLocation)
          // Apply default output location if it exists
          setOutputLocation(savedOutputLocation)
        }
      } catch (error) {
        console.error("Error parsing saved settings:", error)
      }
    }

    // Check for legacy settings
    const legacySettings = localStorage.getItem("whatsTheTimeSettings")
    if (legacySettings && !savedSettings) {
      try {
        // Migrate old settings to new key
        localStorage.setItem("clockCompareSettings", legacySettings)
        const parsedSettings = JSON.parse(legacySettings)
        const {
          useDynamicBackground: savedDynamicBg,
          defaultInputLocation: savedInputLocation,
          defaultOutputLocation: savedOutputLocation,
        } = parsedSettings

        setUseDynamicBackground(savedDynamicBg !== undefined ? savedDynamicBg : true)

        // Store default locations in state
        if (savedInputLocation) {
          setDefaultInputLocation(savedInputLocation)
        }

        if (savedOutputLocation) {
          setDefaultOutputLocation(savedOutputLocation)
          // Apply default output location if it exists
          setOutputLocation(savedOutputLocation)
        }
      } catch (error) {
        console.error("Error migrating legacy settings:", error)
      }
    }

    // Try to get user's location with better error handling
    try {
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        const timeoutId = setTimeout(() => {
          // Fallback if geolocation takes too long
          console.log("Geolocation request timed out")
          setDefaultLocation(setInputLocation, setInputTime, setIsLoading, defaultInputLocation)
        }, 3000)

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            clearTimeout(timeoutId)
            try {
              const { latitude, longitude } = position.coords

              // Instead of relying on external APIs that might fail,
              // let's use a simpler approach for the preview
              // We'll use the Intl API to get the timezone
              const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

              // If we have a default input location, use that instead of geolocation
              if (defaultInputLocation && defaultInputLocation.location && defaultInputLocation.timezone) {
                setInputLocation(defaultInputLocation)
                setInputTime(DateTime.now().setZone(defaultInputLocation.timezone))
                setIsLoading(false)
                return
              }

              // Set a reasonable default location based on common timezones
              let location = "New York, United States"
              if (timezone.startsWith("Europe/London")) {
                location = "London, United Kingdom"
              } else if (timezone.startsWith("Europe/Paris")) {
                location = "Paris, France"
              } else if (timezone.startsWith("Europe/Berlin")) {
                location = "Berlin, Germany"
              } else if (timezone.startsWith("Asia/Tokyo")) {
                location = "Tokyo, Japan"
              } else if (timezone.startsWith("Asia/Shanghai")) {
                location = "Shanghai, China"
              } else if (timezone.startsWith("Asia/Colombo")) {
                location = "Colombo, Sri Lanka"
              } else if (timezone.startsWith("Australia/Sydney")) {
                location = "Sydney, Australia"
              } else if (timezone.startsWith("America/Los_Angeles")) {
                location = "Los Angeles, United States"
              }

              setInputLocation({
                location,
                timezone,
              })
              setInputTime(DateTime.now().setZone(timezone))
              setIsLoading(false)
            } catch (error) {
              console.error("Error processing location data:", error)
              setDefaultLocation(setInputLocation, setInputTime, setIsLoading, defaultInputLocation)
            }
          },
          (error) => {
            clearTimeout(timeoutId)
            console.error("Geolocation error:", error)
            setDefaultLocation(setInputLocation, setInputTime, setIsLoading, defaultInputLocation)
          },
          { timeout: 5000, maximumAge: 60000 },
        )
      } else {
        // Handle the case when geolocation is not available
        setDefaultLocation(setInputLocation, setInputTime, setIsLoading, defaultInputLocation)
      }
    } catch (error) {
      console.error("Geolocation API access error:", error)
      setDefaultLocation(setInputLocation, setInputTime, setIsLoading, defaultInputLocation)
    }
  }, [defaultInputLocation])

  // Update output time whenever input location, output location, or input time changes
  useEffect(() => {
    if (inputLocation.timezone && outputLocation.timezone) {
      const newOutputTime = inputTime.setZone(outputLocation.timezone)
      setOutputTime(newOutputTime)
    }
  }, [inputLocation, outputLocation, inputTime])

  // Update input time every minute if auto-update is enabled
  useEffect(() => {
    if (inputLocation.timezone && autoUpdateTime) {
      const interval = setInterval(() => {
        setInputTime(DateTime.now().setZone(inputLocation.timezone))
      }, 60000)

      return () => clearInterval(interval)
    }
  }, [inputLocation.timezone, autoUpdateTime])

  const saveSettings = (useDynamicBg, newDefaultInputLocation, newDefaultOutputLocation) => {
    setUseDynamicBackground(useDynamicBg)
    setDefaultInputLocation(newDefaultInputLocation)
    setDefaultOutputLocation(newDefaultOutputLocation)

    localStorage.setItem(
      "clockCompareSettings",
      JSON.stringify({
        useDynamicBackground: useDynamicBg,
        defaultInputLocation: newDefaultInputLocation,
        defaultOutputLocation: newDefaultOutputLocation,
      }),
    )

    setShowSettings(false)
  }

  // Handle manual time change
  const handleInputTimeChange = (newTime) => {
    setInputTime(newTime)
    setAutoUpdateTime(false) // Disable auto-update when manually changing time
  }

  // Reset to current time
  const resetToCurrentTime = () => {
    if (inputLocation.timezone) {
      setInputTime(DateTime.now().setZone(inputLocation.timezone))
      setAutoUpdateTime(true)
    }
  }

  const getBackgroundColor = (time) => {
    if (!useDynamicBackground) return "bg-gray-100"

    if (!time.isValid) return "bg-gray-100"

    const hour = time.hour
    const minute = time.minute
    const totalMinutes = hour * 60 + minute

    // Day is from 6:00 AM (360 minutes) to 6:00 PM (1080 minutes)
    const isDaytime = totalMinutes >= 360 && totalMinutes < 1080

    if (isDaytime) {
      // Morning transition (6:00 AM to 8:00 AM)
      if (totalMinutes >= 360 && totalMinutes < 480) {
        const progress = (totalMinutes - 360) / 120
        const hexValue = Math.floor(220 + (255 - 220) * progress)
          .toString(16)
          .padStart(2, "0")
        return `bg-[#${hexValue}${hexValue}${hexValue}]`
      }
      // Full day (8:00 AM to 4:00 PM)
      else if (totalMinutes >= 480 && totalMinutes < 960) {
        return "bg-gray-100"
      }
      // Evening transition (4:00 PM to 6:00 PM)
      else {
        const progress = (totalMinutes - 960) / 120
        const hexValue = Math.floor(255 - progress * (255 - 80))
          .toString(16)
          .padStart(2, "0")
        return `bg-[#${hexValue}${hexValue}${hexValue}]`
      }
    } else {
      // Night (6:00 PM to 6:00 AM)
      // Evening transition (6:00 PM to 8:00 PM)
      if (totalMinutes >= 1080 && totalMinutes < 1200) {
        const progress = (totalMinutes - 1080) / 120
        const hexValue = Math.floor(80 - progress * (80 - 51))
          .toString(16)
          .padStart(2, "0")
        return `bg-[#${hexValue}${hexValue}${hexValue}]`
      }
      // Full night (8:00 PM to 4:00 AM)
      else if ((totalMinutes >= 1200 && totalMinutes <= 1440) || (totalMinutes >= 0 && totalMinutes < 240)) {
        return "bg-[#333333]"
      }
      // Morning transition (4:00 AM to 6:00 AM)
      else {
        const progress = (totalMinutes - 240) / 120
        const hexValue = Math.floor(51 + progress * (220 - 51))
          .toString(16)
          .padStart(2, "0")
        return `bg-[#${hexValue}${hexValue}${hexValue}]`
      }
    }
  }

  // Helper function to determine if a background color is light
  const isLightBackground = (bgClass) => {
    // Check if it's white or a light hex color
    if (bgClass === "bg-gray-100") return true

    // For dynamic hex colors, extract the value
    const match = bgClass.match(/bg-\[#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})\]/i)
    if (match) {
      const r = Number.parseInt(match[1], 16)
      const g = Number.parseInt(match[2], 16)
      const b = Number.parseInt(match[3], 16)

      // Calculate perceived brightness (common formula)
      // If brightness > 128, it's considered light
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      return brightness > 128
    }

    return false
  }

  return (
    <main className="flex flex-col h-screen">
      {/* Settings button */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Settings"
      >
        <Settings className="h-5 w-5" />
      </button>

      {/* Input location (top half) */}
      <div className={`flex-1 flex flex-col p-6 transition-colors duration-500 ${getBackgroundColor(inputTime)}`}>
        <div className="flex flex-col w-full">
          <LocationSelector
            label="Input Location"
            selectedLocation={inputLocation}
            onLocationChange={setInputLocation}
            onTimeChange={setInputTime}
          />
        </div>

        <TimeDisplay
          location={inputLocation}
          time={inputTime}
          isLight={isLightBackground(getBackgroundColor(inputTime))}
          isInput={true}
          onTimeChange={handleInputTimeChange}
          autoUpdateTime={autoUpdateTime}
          onResetTime={resetToCurrentTime}
        />
      </div>

      {/* Output location (bottom half) */}
      <div className={`flex-1 flex flex-col p-6 transition-colors duration-500 ${getBackgroundColor(outputTime)}`}>
        <div className="w-full">
          <LocationSelector
            label="Output Location"
            selectedLocation={outputLocation}
            onLocationChange={setOutputLocation}
          />
        </div>
        <TimeDisplay
          location={outputLocation}
          time={outputTime}
          isLight={isLightBackground(getBackgroundColor(outputTime))}
        />
      </div>

      {/* Settings modal */}
      {showSettings && (
        <SettingsModal
          useDynamicBackground={useDynamicBackground}
          defaultInputLocation={defaultInputLocation}
          defaultOutputLocation={defaultOutputLocation}
          onSave={saveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-sm">Setting up your location...</p>
            <p className="text-xs text-gray-500 mt-1">If geolocation is disabled, we'll use a default location.</p>
          </div>
        </div>
      )}
    </main>
  )
}
