"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clock Compare
        </Link>

        <h1 className="text-3xl font-bold mb-6">How Clock Compare Works</h1>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Overview</h2>
            <p className="text-gray-700">
              Clock Compare is a simple web application that allows you to compare the time between two different
              locations around the world. It's perfect for planning international calls, meetings, or simply
              understanding time differences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Getting Started</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                <span className="font-medium">Select your input location</span> - This is typically your current
                location or a location you're familiar with.
              </li>
              <li>
                <span className="font-medium">Select your output location</span> - This is the location you want to
                compare with your input location.
              </li>
              <li>
                <span className="font-medium">View the time comparison</span> - The app will display the current time in
                both locations.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <span className="font-medium">Dynamic backgrounds</span> - The background color changes based on the
                local time in each location (day/night).
              </li>
              <li>
                <span className="font-medium">Time editing</span> - Click the edit icon next to the input time to
                manually set a specific time and see what time it will be in the output location.
              </li>
              <li>
                <span className="font-medium">Default locations</span> - Set your preferred default locations in the
                settings menu (gear icon in the top right).
              </li>
              <li>
                <span className="font-medium">Automatic updates</span> - The time updates automatically every minute to
                stay current.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Settings</h2>
            <p className="text-gray-700">
              Click the gear icon in the top right corner to access settings. Here you can:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
              <li>Toggle dynamic backgrounds on/off</li>
              <li>Set default input and output locations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Tips</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Use the "Now" button to reset to the current time after manually editing the input time.</li>
              <li>The app works offline once loaded, so you can use it even without an internet connection.</li>
              <li>Your settings are saved locally in your browser, so they'll persist between visits.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
