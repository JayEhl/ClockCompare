"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from "lucide-react"
import { CITIES_DATABASE } from "@/lib/cities-database"

export default function SettingsModal({
  useDynamicBackground,
  defaultInputLocation,
  defaultOutputLocation,
  onSave,
  onClose,
}) {
  const [dynamicBg, setDynamicBg] = useState(useDynamicBackground)
  const [inputLocation, setInputLocation] = useState(defaultInputLocation || { location: "", timezone: "" })
  const [outputLocation, setOutputLocation] = useState(defaultOutputLocation || { location: "", timezone: "" })

  // Search state for input location
  const [inputSearchQuery, setInputSearchQuery] = useState("")
  const [inputFilteredLocations, setInputFilteredLocations] = useState([])
  const [showInputResults, setShowInputResults] = useState(false)

  // Search state for output location
  const [outputSearchQuery, setOutputSearchQuery] = useState("")
  const [outputFilteredLocations, setOutputFilteredLocations] = useState([])
  const [showOutputResults, setShowOutputResults] = useState(false)

  // Filter input locations based on search query
  useEffect(() => {
    if (!inputSearchQuery.trim()) {
      setInputFilteredLocations([])
      return
    }

    const query = inputSearchQuery.toLowerCase()
    const results = CITIES_DATABASE.filter(
      (city) => city.name.toLowerCase().includes(query) || city.country.toLowerCase().includes(query),
    ).slice(0, 20)

    setInputFilteredLocations(results)
  }, [inputSearchQuery])

  // Filter output locations based on search query
  useEffect(() => {
    if (!outputSearchQuery.trim()) {
      setOutputFilteredLocations([])
      return
    }

    const query = outputSearchQuery.toLowerCase()
    const results = CITIES_DATABASE.filter(
      (city) => city.name.toLowerCase().includes(query) || city.country.toLowerCase().includes(query),
    ).slice(0, 20)

    setOutputFilteredLocations(results)
  }, [outputSearchQuery])

  // Handle input location selection
  const handleInputLocationSelect = (city) => {
    const locationName = `${city.name}, ${city.country}`
    setInputLocation({
      location: locationName,
      timezone: city.timezone,
    })
    setInputSearchQuery("")
    setShowInputResults(false)
  }

  // Handle output location selection
  const handleOutputLocationSelect = (city) => {
    const locationName = `${city.name}, ${city.country}`
    setOutputLocation({
      location: locationName,
      timezone: city.timezone,
    })
    setOutputSearchQuery("")
    setShowOutputResults(false)
  }

  // Clear input location
  const clearInputLocation = () => {
    setInputLocation({ location: "", timezone: "" })
  }

  // Clear output location
  const clearOutputLocation = () => {
    setOutputLocation({ location: "", timezone: "" })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-sm max-h-[90vh] overflow-auto">
        <h2 className="text-lg font-medium mb-4">Clock Compare Settings</h2>

        <div className="space-y-6">
          {/* Dynamic Background Setting */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dynamic-bg" className="text-sm font-medium">
                Dynamic Background
              </Label>
              <p className="text-xs text-gray-500">Change background color based on local time</p>
            </div>
            <Switch id="dynamic-bg" checked={dynamicBg} onCheckedChange={setDynamicBg} />
          </div>

          {/* Default Input Location */}
          <div>
            <Label htmlFor="default-input-location" className="text-sm font-medium">
              Default Input Location
            </Label>
            <p className="text-xs text-gray-500 mb-2">Set your default starting location</p>

            <div className="relative">
              <Input
                id="default-input-location"
                placeholder="Search for any city..."
                value={inputSearchQuery}
                onChange={(e) => {
                  setInputSearchQuery(e.target.value)
                  setShowInputResults(true)
                }}
                onFocus={() => setShowInputResults(true)}
                className="pr-10 text-sm h-9 mb-2"
              />
              {inputSearchQuery && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setInputSearchQuery("")
                    setShowInputResults(false)
                  }}
                >
                  <X size={16} />
                </button>
              )}

              {/* Search results */}
              {showInputResults && inputFilteredLocations.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-[200px] overflow-auto">
                  <ScrollArea className="h-full">
                    <div className="p-1">
                      {inputFilteredLocations.map((city) => (
                        <button
                          key={`${city.name}-${city.country}`}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center justify-between text-sm"
                          onClick={() => handleInputLocationSelect(city)}
                        >
                          <span>
                            {city.name}, {city.country}
                          </span>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>

            {/* Selected location display */}
            {inputLocation.location && (
              <div className="p-3 bg-gray-50 rounded-md flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{inputLocation.location}</div>
                  <div className="text-xs text-gray-500">{inputLocation.timezone}</div>
                </div>
                <button className="text-gray-400 hover:text-gray-600" onClick={clearInputLocation}>
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Default Output Location */}
          <div>
            <Label htmlFor="default-output-location" className="text-sm font-medium">
              Default Output Location
            </Label>
            <p className="text-xs text-gray-500 mb-2">Set your default comparison location</p>

            <div className="relative">
              <Input
                id="default-output-location"
                placeholder="Search for any city..."
                value={outputSearchQuery}
                onChange={(e) => {
                  setOutputSearchQuery(e.target.value)
                  setShowOutputResults(true)
                }}
                onFocus={() => setShowOutputResults(true)}
                className="pr-10 text-sm h-9 mb-2"
              />
              {outputSearchQuery && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setOutputSearchQuery("")
                    setShowOutputResults(false)
                  }}
                >
                  <X size={16} />
                </button>
              )}

              {/* Search results */}
              {showOutputResults && outputFilteredLocations.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-[200px] overflow-auto">
                  <ScrollArea className="h-full">
                    <div className="p-1">
                      {outputFilteredLocations.map((city) => (
                        <button
                          key={`${city.name}-${city.country}`}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center justify-between text-sm"
                          onClick={() => handleOutputLocationSelect(city)}
                        >
                          <span>
                            {city.name}, {city.country}
                          </span>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>

            {/* Selected location display */}
            {outputLocation.location && (
              <div className="p-3 bg-gray-50 rounded-md flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{outputLocation.location}</div>
                  <div className="text-xs text-gray-500">{outputLocation.timezone}</div>
                </div>
                <button className="text-gray-400 hover:text-gray-600" onClick={clearOutputLocation}>
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" size="sm" className="text-sm h-9" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" className="text-sm h-9" onClick={() => onSave(dynamicBg, inputLocation, outputLocation)}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
