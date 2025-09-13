'use client'

import { Suspense } from 'react'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

function JoinForm() {
  const searchParams = useSearchParams()
  const [sessionCode, setSessionCode] = useState(searchParams?.get('code') || '')
  const [participantName, setParticipantName] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState('')

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessionCode.trim() || !participantName.trim()) {
      setError('Please enter both session code and your name')
      return
    }

    setIsJoining(true)
    setError('')

    try {
      const response = await fetch(`/api/join/${sessionCode.toUpperCase()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participant_name: participantName,
          participant_data: {}
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to join session')
      }

      const data = await response.json()
      
      // Redirect to quiz session
      window.location.href = `/quiz/${sessionCode.toUpperCase()}`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900">
            Join Quiz Session
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Enter the session code provided by your instructor
          </p>
        </div>

        <form onSubmit={handleJoin} className="mt-8 space-y-6">
          <div>
            <label htmlFor="sessionCode" className="block text-sm font-medium text-gray-700">
              Session Code
            </label>
            <input
              id="sessionCode"
              type="text"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter session code"
              maxLength={8}
            />
          </div>

          <div>
            <label htmlFor="participantName" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              id="participantName"
              type="text"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isJoining}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isJoining ? 'Joining...' : 'Join Session'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function JoinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <JoinForm />
    </Suspense>
  )
}
