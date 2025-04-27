"use client"

import { useState, useEffect, useRef } from "react"
import { DateTime } from "luxon"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// Import the comprehensive city database
import { CITIES_DATABASE } from "@/lib/cities-database"

export default function LocationSelector({ label, selectedLocation, onLocationChange, onTimeChange }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredLocations, setFilteredLocations] = useState([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)
  const resultsRef = useRef(null)

  // Filter locations based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLocations([])
      return
    }

    const query = searchQuery.toLowerCase()

    // Search in the database
    const results = CITIES_DATABASE.filter(
      (city) => city.name.toLowerCase().includes(query) || city.country.toLowerCase().includes(query),
    ).slice(0, 50) // Limit results to prevent performance issues

    setFilteredLocations(results)
  }, [searchQuery])

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle location selection
  const handleLocationSelect = (city) => {
    const locationName = `${city.name}, ${city.country}`

    onLocationChange({
      location: locationName,
      timezone: city.timezone,
    })

    // Update time if onTimeChange is provided
    if (onTimeChange) {
      onTimeChange(DateTime.now().setZone(city.timezone))
    }

    setSearchQuery("")
    setShowResults(false)
  }

  return (
    <div className="space-y-1 sm:space-y-2 w-full">
      <h2 className="text-base font-medium">{label}</h2>

      <div className="space-y-1 sm:space-y-2 w-full">
        <div className="relative w-full">
          <div className="relative w-full" ref={searchRef}>
            <Input
              placeholder={selectedLocation.location ? "Change location..." : "Search for any city..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowResults(true)
              }}
              onFocus={() => setShowResults(true)}
              className="pr-10 text-sm h-8 sm:h-9 w-full"
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setSearchQuery("")
                  setShowResults(false)
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Search results */}
          {showResults && filteredLocations.length > 0 && (
            <div
              ref={resultsRef}
              className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-[250px] overflow-auto"
            >
              <ScrollArea className="h-full">
                <div className="p-1">
                  {filteredLocations.map((city) => (
                    <button
                      key={`${city.name}-${city.country}`}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center justify-between text-sm"
                      onClick={() => handleLocationSelect(city)}
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
        {selectedLocation.location && (
          <div className="p-2 sm:p-3 bg-gray-50 rounded-md flex items-center justify-between w-full">
            <div>
              <div className="text-sm font-medium">{selectedLocation.location}</div>
              <div className="text-xs text-gray-500">{selectedLocation.timezone}</div>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => {
                onLocationChange({ location: "", timezone: "" })
                setSearchQuery("")
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
