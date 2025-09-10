"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Quiz {
  id: string
  title: string
  description: string
  created_at: string
  settings: any
}

interface Session {
  id: string
  session_code: string
  status: string
  created_at: string
  quizzes: { title: string }
}

export default function TeacherDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
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

      // Fetch quizzes
      const quizzesResponse = await fetch('/api/quizzes', { headers })
      const quizzesData = await quizzesResponse.json()

      if (!quizzesResponse.ok) {
        throw new Error(quizzesData.error || 'Failed to fetch quizzes')
      }

      // Fetch sessions  
      const sessionsResponse = await fetch('/api/sessions', { headers })
      const sessionsData = await sessionsResponse.json()

      if (!sessionsResponse.ok) {
        throw new Error(sessionsData.error || 'Failed to fetch sessions')
      }

      setQuizzes(quizzesData.quizzes || [])
      setSessions(sessionsData.sessions || [])

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createQuiz = () => {
    router.push('/teacher/quiz/create')
  }

  const startSession = async (quizId: string) => {
    try {
      const token = localStorage.getItem('session_token')
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quiz_id: quizId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create session')
      }

      router.push(`/teacher/session/${data.session.id}`)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start session')
    }
  }

  const logout = () => {
    localStorage.removeItem('session_token')
    localStorage.removeItem('user_profile')
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">BeaconIQ</h1>
              <p className="text-sm text-gray-600">Teacher Dashboard</p>
            </div>
            <button
              onClick={logout}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Manage your quizzes and live sessions</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quizzes Section */}
          <div className="card">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">My Quizzes</h3>
                <button onClick={createQuiz} className="btn-primary">
                  Create Quiz
                </button>
              </div>
              
              <div className="space-y-3">
                {quizzes.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-lg mb-2">📝</div>
                    <p className="text-gray-500">No quizzes created yet.</p>
                    <p className="text-sm text-gray-400">Create your first quiz to get started!</p>
                  </div>
                ) : (
                  quizzes.map((quiz) => (
                    <div key={quiz.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Created: {new Date(quiz.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="ml-4 space-y-2">
                          <button 
                            onClick={() => startSession(quiz.id)}
                            className="btn-primary text-sm px-3 py-1.5"
                          >
                            Start Session
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Sessions</h3>
              
              <div className="space-y-3">
                {sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-lg mb-2">🎯</div>
                    <p className="text-gray-500">No sessions yet.</p>
                    <p className="text-sm text-gray-400">Start a quiz session to see it here!</p>
                  </div>
                ) : (
                  sessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{session.quizzes?.title || 'Quiz'}</h4>
                          <p className="text-sm text-gray-600 mt-1">Code: <span className="font-mono font-bold">{session.session_code}</span></p>
                          <div className="flex items-center mt-2">
                            <span className="text-xs text-gray-500">Status:</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              session.status === 'active' 
                                ? 'bg-green-100 text-green-800'
                                : session.status === 'waiting'
                                ? 'bg-yellow-100 text-yellow-800'  
                                : session.status === 'paused'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {session.status}
                            </span>
                          </div>
                        </div>
                        {['active', 'waiting', 'paused'].includes(session.status) && (
                          <button 
                            onClick={() => router.push(`/teacher/session/${session.id}`)}
                            className="btn-secondary text-sm px-3 py-1.5"
                          >
                            Manage
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
            <h3 className="text-xl font-semibold mb-2">Quick Actions</h3>
            <p className="text-blue-100 mb-4">Get started with BeaconIQ</p>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={createQuiz}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Create New Quiz
              </button>
              <button 
                onClick={() => router.push('/teacher/help')}
                className="bg-blue-400 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-300 transition-colors"
              >
                Help & Tutorials
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
