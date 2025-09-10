"use client"
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Participant {
  id: string
  participant_name: string
  participant_data: any
  status: string
  total_score: number
  joined_at: string
}

interface Session {
  id: string
  session_code: string
  status: string
  current_question_index: number
  quiz_id: string
  quizzes?: {
    title: string
    description: string
  }
}

export default function SessionManagePage({ params }: { params: { id: string } }) {
  const [session, setSession] = useState<Session | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState('')
  const router = useRouter()

  const fetchSessionData = useCallback(async () => {
    try {
      const token = localStorage.getItem('session_token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      // Fetch participants
      const participantsResponse = await fetch(`/api/participants?session_id=${params.id}`, { headers })
      const participantsData = await participantsResponse.json()

      if (participantsResponse.ok) {
        setParticipants(participantsData.participants || [])
      }

      // Mock session data for demo (replace with actual API call)
      const mockSession: Session = {
        id: params.id,
        session_code: 'ABC123',
        status: 'waiting',
        current_question_index: 0,
        quiz_id: 'quiz-1',
        quizzes: {
          title: 'Sample Quiz',
          description: 'A demo quiz'
        }
      }
      setSession(mockSession)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    fetchSessionData()
    // Set up polling for updates
    const interval = setInterval(fetchSessionData, 3000)
    return () => clearInterval(interval)
  }, [fetchSessionData])

  const handleSessionControl = async (action: string, additional?: any) => {
    setActionLoading(action)
    try {
      const token = localStorage.getItem('session_token')
      const response = await fetch(`/api/sessions/${params.id}/control`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, ...additional })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Action failed')
      }

      await fetchSessionData()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setActionLoading('')
    }
  }

  const copySessionCode = () => {
    if (session) {
      navigator.clipboard.writeText(session.session_code)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Session not found</h2>
          <button onClick={() => router.push('/teacher')} className="btn-primary mt-4">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/teacher')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {session.quizzes?.title || 'Quiz Session'}
                </h1>
                <p className="text-sm text-gray-600">Live Session Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                session.status === 'active' 
                  ? 'bg-green-100 text-green-800'
                  : session.status === 'waiting'
                  ? 'bg-yellow-100 text-yellow-800'  
                  : session.status === 'paused'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button 
              onClick={() => setError('')}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Session Control Panel */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Session Control</h3>
                
                {/* Session Code Display */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-blue-600 mb-2">Session Code</p>
                  <div className="text-3xl font-mono font-bold text-blue-900 mb-3">
                    {session.session_code}
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={copySessionCode}
                      className="btn-secondary text-sm w-full"
                    >
                      Copy Code
                    </button>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="space-y-3">
                  {session.status === 'waiting' && (
                    <button
                      onClick={() => handleSessionControl('start')}
                      disabled={actionLoading === 'start'}
                      className="btn-primary w-full"
                    >
                      {actionLoading === 'start' ? 'Starting...' : 'Start Quiz'}
                    </button>
                  )}

                  {session.status === 'active' && (
                    <>
                      <button
                        onClick={() => handleSessionControl('pause')}
                        disabled={actionLoading === 'pause'}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg w-full hover:bg-orange-600 disabled:opacity-50"
                      >
                        {actionLoading === 'pause' ? 'Pausing...' : 'Pause Quiz'}
                      </button>
                      <button
                        onClick={() => handleSessionControl('next_question', { current_question_index: session.current_question_index + 1 })}
                        disabled={actionLoading === 'next_question'}
                        className="btn-secondary w-full"
                      >
                        {actionLoading === 'next_question' ? 'Loading...' : 'Next Question'}
                      </button>
                    </>
                  )}

                  {session.status === 'paused' && (
                    <button
                      onClick={() => handleSessionControl('resume')}
                      disabled={actionLoading === 'resume'}
                      className="btn-primary w-full"
                    >
                      {actionLoading === 'resume' ? 'Resuming...' : 'Resume Quiz'}
                    </button>
                  )}

                  {['active', 'paused'].includes(session.status) && (
                    <button
                      onClick={() => handleSessionControl('complete')}
                      disabled={actionLoading === 'complete'}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600 disabled:opacity-50"
                    >
                      {actionLoading === 'complete' ? 'Ending...' : 'End Quiz'}
                    </button>
                  )}
                </div>

                {/* Session Stats */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">Session Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Participants:</span>
                      <span className="font-medium">{participants.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Question:</span>
                      <span className="font-medium">{session.current_question_index + 1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium">{session.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Participants List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Participants ({participants.length})</h3>
                  <button 
                    onClick={fetchSessionData}
                    className="btn-secondary text-sm"
                  >
                    Refresh
                  </button>
                </div>
                
                {participants.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-4xl mb-4">👥</div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No participants yet</h4>
                    <p className="text-gray-600 mb-4">Share the session code for students to join</p>
                    <div className="bg-gray-100 p-3 rounded-lg inline-block">
                      <span className="font-mono text-xl font-bold">{session.session_code}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            participant.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                          <div>
                            <p className="font-medium">{participant.participant_name}</p>
                            <p className="text-sm text-gray-600">
                              Score: {participant.total_score} | 
                              Joined: {new Date(participant.joined_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            participant.status === 'connected' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {participant.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
