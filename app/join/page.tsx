"use client"
import { Suspense, useState } from 'react'
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
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-500 to-blue-600 p-12 items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl font-bold mb-6">🎯</div>
          <h1 className="text-4xl font-bold mb-4">Ready to Join?</h1>
          <p className="text-xl text-green-100 mb-8">Enter your session code and get ready for an interactive quiz experience</p>
          <div className="space-y-4 text-left bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Real-time questions and answers</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Instant feedback on your performance</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Compete with other participants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="lg:hidden text-4xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Quiz Session</h2>
            <p className="text-gray-600">Enter the session code provided by your instructor</p>
          </div>

          <form onSubmit={handleJoin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="sessionCode" className="block text-sm font-semibold text-gray-700 mb-2">
                Session Code
              </label>
              <input
                id="sessionCode"
                type="text"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                className="input-field text-center text-2xl font-bold tracking-widest"
                placeholder="ABCD1234"
                maxLength={8}
                style={{ letterSpacing: '0.2em' }}
                required
              />
            </div>

            <div>
              <label htmlFor="participantName" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name
              </label>
              <input
                id="participantName"
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className="input-field"
                placeholder="Enter your name"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isJoining}
              className="btn-primary w-full text-lg"
            >
              {isJoining ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-3"></div>
                  Joining Session...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>🚀 Join Session</span>
                </div>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              Need help?{' '}
              <a href="/" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                Contact your instructor
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function JoinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <JoinForm />
    </Suspense>
  )
}
