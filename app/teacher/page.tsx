"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Quiz {
  id: number
  title: string
  questions: number
  created_at: string
  participants: number
}

interface ActiveSession {
  id: number
  quiz_title: string
  session_code: string
  participants: number
  status: string
}

export default function TeacherDashboard() {
  const [user, setUser] = useState<any>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userProfile = localStorage.getItem('user_profile')
    if (!userProfile) {
      router.push('/auth/login')
      return
    }
    setUser(JSON.parse(userProfile))
    fetchQuizzes()
    fetchActiveSessions()
  }, [])

  const fetchQuizzes = async () => {
    // Mock data for now
    setQuizzes([
      { id: 1, title: 'Math Quiz 1', questions: 10, created_at: '2025-09-10', participants: 25 },
      { id: 2, title: 'Science Review', questions: 15, created_at: '2025-09-12', participants: 18 },
      { id: 3, title: 'History Test', questions: 20, created_at: '2025-09-14', participants: 32 }
    ])
    setLoading(false)
  }

  const fetchActiveSessions = async () => {
    // Mock data for now
    setActiveSessions([
      { id: 1, quiz_title: 'Math Quiz 1', session_code: 'ABC123', participants: 15, status: 'active' },
      { id: 2, quiz_title: 'Science Review', session_code: 'XYZ789', participants: 8, status: 'paused' }
    ])
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📊</span>
              <span className="text-2xl font-bold text-gray-900">BeaconIQ</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.full_name}</span>
              <button onClick={handleLogout} className="btn-secondary text-sm">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your quizzes and view session analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-900">{quizzes.length}</p>
              </div>
              <div className="text-3xl">📝</div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{activeSessions.length}</p>
              </div>
              <div className="text-3xl">🔴</div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold text-gray-900">75</p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Score</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Sessions */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-header">
                <h3 className="text-xl font-bold text-gray-900">Active Sessions</h3>
              </div>
              <div className="space-y-4">
                {activeSessions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No active sessions</p>
                ) : (
                  activeSessions.map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{session.quiz_title}</h4>
                        <span className={`badge ${session.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                          {session.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Code: {session.session_code}</p>
                      <p className="text-sm text-gray-600">{session.participants} participants</p>
                      <button
                        onClick={() => router.push(`/teacher/session/${session.id}`)}
                        className="btn-primary w-full mt-3 text-sm"
                      >
                        Manage Session
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Recent Quizzes */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <h3 className="text-xl font-bold text-gray-900">Recent Quizzes</h3>
                <button
                  onClick={() => router.push('/teacher/quiz/create')}
                  className="btn-primary"
                >
                  Create Quiz
                </button>
              </div>
              <div className="space-y-4">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{quiz.title}</h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/teacher/quiz/${quiz.id}`)}
                          className="btn-secondary text-sm"
                        >
                          View
                        </button>
                        <button className="btn-primary text-sm">
                          Start Session
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>📝 {quiz.questions} questions</span>
                      <span>👥 {quiz.participants} participants</span>
                      <span>📅 {new Date(quiz.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
