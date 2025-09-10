"use client"
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Question {
  id: string
  content: any
  question_type: string
  options?: string[]
  time_limit?: number
  points?: number
}

interface Session {
  id: string
  status: string
  current_question_index: number
  quizzes?: {
    title: string
  }
}

interface ResponseFeedback {
  is_correct: boolean
  points_awarded: number
  correct_answer?: any
}

export default function QuizPage({ params }: { params: { sessionId: string } }) {
  const [session, setSession] = useState<Session | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [feedback, setFeedback] = useState<ResponseFeedback | null>(null)
  const [totalScore, setTotalScore] = useState(0)
  const router = useRouter()

  // Mock questions for demo (replace with actual API)
  const mockQuestions: Question[] = [
    {
      id: '1',
      content: {
        question: 'What is 2 + 2?',
        options: ['3', '4', '5', '6']
      },
      question_type: 'multiple_choice',
      time_limit: 30,
      points: 1
    },
    {
      id: '2',
      content: {
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid']
      },
      question_type: 'multiple_choice',
      time_limit: 25,
      points: 1
    },
    {
      id: '3',
      content: {
        question: 'Is the Earth round?',
        options: ['True', 'False']
      },
      question_type: 'true_false',
      time_limit: 20,
      points: 1
    }
  ]

  // Fetch current question based on session state
  const fetchCurrentQuestion = useCallback(async (questionIndex?: number) => {
    try {
      const index = questionIndex ?? session?.current_question_index ?? 0
      const question = mockQuestions[index] || mockQuestions[0]
      
      setCurrentQuestion(question)
      setTimeLeft(question.time_limit || 30)
      setFeedback(null)
      setSelectedAnswer(null)
      
    } catch (err) {
      console.error('Failed to fetch question:', err)
    }
  }, [session, mockQuestions])

  // Fetch session data
  const fetchSessionData = useCallback(async () => {
    try {
      const participantId = localStorage.getItem('participant_id')
      const sessionId = localStorage.getItem('session_id')
      
      if (!participantId || sessionId !== params.sessionId) {
        router.push('/join')
        return
      }

      // Mock session data for demo (replace with actual API call)
      const mockSession: Session = {
        id: params.sessionId,
        status: 'active',
        current_question_index: 0,
        quizzes: {
          title: 'Demo Quiz'
        }
      }
      
      setSession(mockSession)
      
      if (!currentQuestion) {
        fetchCurrentQuestion()
      }
      
    } catch (err) {
      console.error('Failed to fetch session:', err)
      setError('Failed to load quiz session')
    } finally {
      setLoading(false)
    }
  }, [params.sessionId, router, currentQuestion, fetchCurrentQuestion])

  useEffect(() => {
    fetchSessionData()
    // Set up polling for session updates
    const interval = setInterval(fetchSessionData, 3000)
    return () => clearInterval(interval)
  }, [fetchSessionData])

  // Timer countdown
  useEffect(() => {
    if (timeLeft && timeLeft > 0 && session?.status === 'active' && !feedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !submitting) {
      // Auto-submit when time runs out
      handleSubmitAnswer()
    }
  }, [timeLeft, session?.status, feedback, submitting])

  const handleSubmitAnswer = async () => {
    if (submitting || !currentQuestion || !session) return

    setSubmitting(true)
    
    try {
      const participantId = localStorage.getItem('participant_id')
      
      const response = await fetch(`/api/participants/${participantId}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question_id: currentQuestion.id,
          answer: { selected: selectedAnswer },
          response_time_ms: timeLeft ? (currentQuestion.time_limit || 30) - timeLeft : 0
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit answer')
      }

      // Show feedback
      const isCorrect = selectedAnswer === getCorrectAnswer()
      const points = isCorrect ? (currentQuestion.points || 1) : 0
      
      setFeedback({
        is_correct: isCorrect,
        points_awarded: points
      })

      setTotalScore(prev => prev + points)
      
      // Auto-advance after showing feedback
      setTimeout(() => {
        const nextIndex = session.current_question_index + 1
        if (nextIndex < mockQuestions.length) {
          setSession({...session, current_question_index: nextIndex})
          fetchCurrentQuestion(nextIndex)
        } else {
          setQuizCompleted(true)
        }
      }, 2000)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer')
    } finally {
      setSubmitting(false)
    }
  }

  const getCorrectAnswer = () => {
    // Mock correct answers (replace with actual logic)
    const correctAnswers: { [key: string]: string } = {
      '1': '4',
      '2': 'Paris',
      '3': 'True'
    }
    return correctAnswers[currentQuestion?.id || ''] || ''
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Complete!</h1>
          <div className="bg-white p-6 rounded-xl shadow-soft mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">Your Score</h2>
            <p className="text-4xl font-bold text-gray-900">{totalScore}</p>
            <p className="text-gray-600">out of {mockQuestions.length} points</p>
          </div>
          <p className="text-gray-600 mb-6">
            Thank you for participating! Your responses have been submitted.
          </p>
          <button
            onClick={() => router.push('/join')}
            className="btn-primary"
          >
            Join Another Quiz
          </button>
        </div>
      </div>
    )
  }

  if (!session || session.status === 'waiting') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Waiting for quiz to start...</h2>
          <p className="text-gray-600 mb-6">Your teacher will start the quiz shortly</p>
          <div className="animate-pulse flex justify-center">
            <div className="h-2 bg-blue-300 rounded w-64"></div>
          </div>
        </div>
      </div>
    )
  }

  if (session.status === 'paused') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">⏸️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Paused</h2>
          <p className="text-gray-600 mb-6">The teacher has paused the quiz. Please wait...</p>
          <div className="animate-pulse flex justify-center">
            <div className="h-2 bg-orange-300 rounded w-64"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse bg-gray-200 h-8 w-64 rounded mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {session.quizzes?.title || 'Quiz'}
              </h1>
              <p className="text-sm text-gray-600">
                Question {session.current_question_index + 1} of {mockQuestions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Score */}
              <div className="text-right">
                <p className="text-sm text-gray-600">Score</p>
                <p className="text-lg font-bold text-blue-600">{totalScore}</p>
              </div>
              
              {/* Timer */}
              {timeLeft && !feedback && (
                <div className="flex items-center space-x-2">
                  <div className={`text-lg font-mono font-bold ${
                    timeLeft <= 10 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {timeLeft}s
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    timeLeft <= 10 ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                  }`}></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto py-8 px-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Feedback Display */}
        {feedback && (
          <div className={`p-6 rounded-lg mb-6 ${
            feedback.is_correct 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="text-3xl">
                {feedback.is_correct ? '✅' : '❌'}
              </div>
              <div>
                <p className="font-semibold text-lg">
                  {feedback.is_correct ? 'Correct!' : 'Incorrect'}
                </p>
                <p className="text-sm">
                  Points earned: {feedback.points_awarded}
                </p>
                {!feedback.is_correct && (
                  <p className="text-sm mt-1">
                    Correct answer: {getCorrectAnswer()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="card mb-8">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {currentQuestion.content.question}
            </h2>

            {currentQuestion.question_type === 'multiple_choice' && currentQuestion.content.options && (
              <div className="space-y-3">
                {currentQuestion.content.options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => !feedback && setSelectedAnswer(option)}
                    disabled={submitting || feedback !== null}
                    className={`quiz-option ${
                      selectedAnswer === option ? 'selected' : ''
                    } ${
                      feedback && option === getCorrectAnswer() ? 'correct' : 
                      feedback && selectedAnswer === option && !feedback.is_correct ? 'incorrect' : ''
                    } ${submitting || feedback ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                        selectedAnswer === option 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswer === option && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer || submitting || feedback !== null}
            className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </span>
            ) : feedback ? (
              'Waiting for next question...'
            ) : (
              'Submit Answer'
            )}
          </button>
        </div>

        {/* Participant Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Logged in as: <span className="font-medium">{localStorage.getItem('participant_name')}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
