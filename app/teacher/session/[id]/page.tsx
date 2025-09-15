"use client"
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function SessionManagePage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string
  
  const [session, setSession] = useState({
    id: sessionId,
    quiz_title: 'Math Quiz 1',
    session_code: 'ABC123',
    status: 'active',
    current_question: 0,
    total_questions: 10,
    participants: [
      { id: 1, name: 'John Doe', score: 8, answered: true },
      { id: 2, name: 'Jane Smith', score: 6, answered: false },
      { id: 3, name: 'Bob Johnson', score: 9, answered: true },
      { id: 4, name: 'Alice Brown', score: 7, answered: true }
    ]
  })

  const [currentQuestion, setCurrentQuestion] = useState({
    text: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    responses: [2, 15, 1, 0]
  })

  const handleNextQuestion = () => {
    if (session.current_question < session.total_questions - 1) {
      setSession({
        ...session,
        current_question: session.current_question + 1
      })
    }
  }

  const handleEndSession = () => {
    setSession({ ...session, status: 'ended' })
  }

  const totalParticipants = session.participants.length
  const answeredCount = session.participants.filter(p => p.answered).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button onClick={() => router.push('/teacher')} className="text-2xl hover:text-blue-600 transition-colors">
                ←
              </button>
              <span className="text-2xl">📊</span>
              <span className="text-2xl font-bold text-gray-900">BeaconIQ</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`badge ${session.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                {session.status}
              </span>
              <button onClick={() => router.push('/teacher')} className="btn-secondary">
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Session Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{session.quiz_title}</h1>
          <div className="flex items-center space-x-6 text-gray-600">
            <span>Session Code: <span className="font-mono font-bold text-2xl text-blue-600">{session.session_code}</span></span>
            <span>Question {session.current_question + 1} of {session.total_questions}</span>
            <span>{totalParticipants} Participants</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Question & Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Display */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-bold text-gray-900">Current Question</h2>
                <div className="text-sm text-gray-600">
                  {answeredCount}/{totalParticipants} answered
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {currentQuestion.text}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{String.fromCharCode(65 + index)}. {option}</span>
                        <span className="badge badge-info">{currentQuestion.responses[index]}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(currentQuestion.responses[index] / totalParticipants) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Session Controls */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-bold text-gray-900">Session Controls</h3>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {session.status === 'active' && (
                  <>
                    <button 
                      onClick={handleNextQuestion}
                      disabled={session.current_question >= session.total_questions - 1}
                      className="btn-primary"
                    >
                      Next Question
                    </button>
                    <button className="btn-secondary">
                      Pause Session
                    </button>
                    <button 
                      onClick={handleEndSession}
                      className="btn-danger"
                    >
                      End Session
                    </button>
                  </>
                )}
                {session.status === 'ended' && (
                  <div className="bg-gray-100 rounded-xl p-4 w-full text-center">
                    <p className="text-gray-600">Session has ended</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Participants Panel */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-bold text-gray-900">Participants</h3>
                <span className="badge badge-info">{totalParticipants}</span>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {session.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${participant.answered ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="font-medium">{participant.name}</span>
                    </div>
                    <span className="font-bold text-blue-600">{participant.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Score:</span>
                  <span className="font-bold">7.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Rate:</span>
                  <span className="font-bold">{Math.round((answeredCount / totalParticipants) * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-bold">{Math.round(((session.current_question + 1) / session.total_questions) * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
