"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function QuizPage() {
  const params = useParams()
  const sessionId = params.sessionId as string
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizData, setQuizData] = useState({
    title: 'Sample Quiz',
    questions: [
      {
        text: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correct_answer: 1
      },
      {
        text: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correct_answer: 2
      }
    ]
  })
  const [score, setScore] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmitAnswer()
    }
  }, [timeLeft, isSubmitted])

  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null) {
      if (selectedAnswer === quizData.questions[currentQuestion].correct_answer) {
        setScore(score + 1)
      }
    }
    setIsSubmitted(true)
    
    setTimeout(() => {
      if (currentQuestion + 1 < quizData.questions.length) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setTimeLeft(30)
        setIsSubmitted(false)
      } else {
        setQuizCompleted(true)
      }
    }, 2000)
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Complete!</h1>
          <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl p-6 mb-6">
            <p className="text-lg mb-2">Your Score</p>
            <p className="text-4xl font-bold">{score}/{quizData.questions.length}</p>
            <p className="text-lg">{Math.round((score / quizData.questions.length) * 100)}%</p>
          </div>
          <p className="text-gray-600 mb-6">Great job! Your results have been submitted.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="btn-primary w-full"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  const question = quizData.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{quizData.title}</h1>
            <div className="text-sm text-gray-600">
              Session: <span className="font-mono font-bold">{sessionId}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {quizData.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Timer */}
          <div className="flex justify-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full font-bold ${
              timeLeft <= 10 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {timeLeft}s
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {question.text}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !isSubmitted && setSelectedAnswer(index)}
                disabled={isSubmitted}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left font-semibold ${
                  isSubmitted
                    ? index === question.correct_answer
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : index === selectedAnswer && index !== question.correct_answer
                      ? 'border-red-500 bg-red-50 text-red-800'
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                    : selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold mr-4">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                  {isSubmitted && index === question.correct_answer && (
                    <span className="ml-auto text-green-600">✓</span>
                  )}
                  {isSubmitted && index === selectedAnswer && index !== question.correct_answer && (
                    <span className="ml-auto text-red-600">✗</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {!isSubmitted && (
            <div className="text-center">
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="btn-primary text-lg px-8 py-4"
              >
                Submit Answer
              </button>
            </div>
          )}

          {isSubmitted && (
            <div className="text-center">
              <div className={`inline-flex items-center px-6 py-3 rounded-xl font-bold ${
                selectedAnswer === question.correct_answer 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedAnswer === question.correct_answer ? '🎉 Correct!' : '❌ Incorrect'}
              </div>
              <p className="text-gray-600 mt-4">
                {currentQuestion + 1 < quizData.questions.length 
                  ? 'Next question loading...' 
                  : 'Calculating final score...'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
