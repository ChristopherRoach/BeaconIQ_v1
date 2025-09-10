"use client"
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function JoinQuizPage() {
  const [sessionCode, setSessionCode] = useState('')
  const [participantData, setParticipantData] = useState({
    participant_name: '',
    class: '',
    division: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Pre-fill code if provided in URL
  useState(() => {
    const code = searchParams.get('code')
    if (code) setSessionCode(code)
  })

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/sessions/${sessionCode.toUpperCase()}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(participantData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join session')
      }

      // Store participant info and redirect to quiz
      localStorage.setItem('participant_id', data.participant.id)
      localStorage.setItem('session_id', data.participant.session_id)
      localStorage.setItem('participant_name', participantData.participant_name)
      
      router.push(`/quiz/${data.participant.session_id}`)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="text-6xl mb-6">🎯</div>
          <h1 className="text-4xl font-bold text-gray-900">BeaconIQ</h1>
          <p className="mt-4 text-lg text-gray-600">Join the quiz session</p>
        </div>
        
        <div className="card">
          <div className="p-6">
            <form onSubmit={handleJoin} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Code *
                </label>
                <input
                  type="text"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                  className="input-field text-center text-2xl font-mono tracking-widest"
                  required
                  maxLength={6}
                  placeholder="XXXXXX"
                  style={{textTransform: 'uppercase'}}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the 6-character code from your teacher
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={participantData.participant_name}
                  onChange={(e) => setParticipantData({...participantData, participant_name: e.target.value})}
                  className="input-field"
                  required
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <input
                    type="text"
                    value={participantData.class}
                    onChange={(e) => setParticipantData({...participantData, class: e.target.value})}
                    className="input-field"
                    placeholder="Grade/Class"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Division
                  </label>
                  <input
                    type="text"
                    value={participantData.division}
                    onChange={(e) => setParticipantData({...participantData, division: e.target.value})}
                    className="input-field"
                    placeholder="Section"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading || !sessionCode || !participantData.participant_name}
                className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Joining...
                  </span>
                ) : (
                  'Join Quiz'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-500">
                <p className="mb-2">🔒 Your information is secure</p>
                <p>Need help? Contact your teacher</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Powered by <span className="font-semibold text-blue-600">BeaconIQ</span>
          </p>
        </div>
      </div>
    </div>
  )
}
