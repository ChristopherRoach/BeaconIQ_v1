"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateQuizPage() {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    time_limit: 30,
    questions: [
      {
        text: '',
        type: 'multiple_choice',
        options: ['', '', '', ''],
        correct_answer: 0,
        points: 1
      }
    ]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          text: '',
          type: 'multiple_choice',
          options: ['', '', '', ''],
          correct_answer: 0,
          points: 1
        }
      ]
    })
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...quizData.questions]
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }
    setQuizData({ ...quizData, questions: updatedQuestions })
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...quizData.questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setQuizData({ ...quizData, questions: updatedQuestions })
  }

  const removeQuestion = (index: number) => {
    if (quizData.questions.length > 1) {
      const updatedQuestions = quizData.questions.filter((_, i) => i !== index)
      setQuizData({ ...quizData, questions: updatedQuestions })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // API call would go here
      console.log('Creating quiz:', quizData)
      
      // Mock success - redirect to dashboard
      setTimeout(() => {
        router.push('/teacher')
      }, 1000)
    } catch (err) {
      setError('Failed to create quiz')
    } finally {
      setLoading(false)
    }
  }

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
            <button onClick={() => router.push('/teacher')} className="btn-secondary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Quiz</h1>
          <p className="text-gray-600">Design an interactive quiz for your students</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Quiz Details */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-bold text-gray-900">Quiz Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quiz Title</label>
                <input
                  type="text"
                  value={quizData.title}
                  onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                  className="input-field"
                  placeholder="Enter quiz title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time Limit (minutes)</label>
                <input
                  type="number"
                  value={quizData.time_limit}
                  onChange={(e) => setQuizData({ ...quizData, time_limit: parseInt(e.target.value) })}
                  className="input-field"
                  min="1"
                  max="120"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={quizData.description}
                onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Brief description of the quiz"
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {quizData.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="card">
                <div className="card-header">
                  <h3 className="text-lg font-bold text-gray-900">Question {questionIndex + 1}</h3>
                  {quizData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      🗑️ Remove
                    </button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Question Text</label>
                    <textarea
                      value={question.text}
                      onChange={(e) => updateQuestion(questionIndex, 'text', e.target.value)}
                      className="input-field"
                      rows={2}
                      placeholder="Enter your question"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={`correct-${questionIndex}`}
                          checked={question.correct_answer === optionIndex}
                          onChange={() => updateQuestion(questionIndex, 'correct_answer', optionIndex)}
                          className="text-blue-600"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                          className="input-field"
                          placeholder={`Option ${optionIndex + 1}`}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Points</label>
                      <input
                        type="number"
                        value={question.points}
                        onChange={(e) => updateQuestion(questionIndex, 'points', parseInt(e.target.value))}
                        className="input-field w-20"
                        min="1"
                        max="10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="btn-secondary w-full"
            >
              ➕ Add Another Question
            </button>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/teacher')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="loading-spinner mr-2"></div>
                  Creating Quiz...
                </div>
              ) : (
                'Create Quiz'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
