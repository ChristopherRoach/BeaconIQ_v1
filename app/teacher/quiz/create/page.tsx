"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface QuizSettings {
  allowAnonymousParticipants: boolean
  showCorrectAnswers: boolean
  timeLimit: number
  maxParticipants: number
}

export default function CreateQuizPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    settings: {
      allowAnonymousParticipants: true,
      showCorrectAnswers: false,
      timeLimit: 300,
      maxParticipants: 50
    } as QuizSettings
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('session_token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create quiz')
      }

      router.push('/teacher')

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = (key: keyof QuizSettings, value: any) => {
    setFormData({
      ...formData,
      settings: {
        ...formData.settings,
        [key]: value
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Create New Quiz</h1>
              <p className="text-sm text-gray-600">Build an interactive quiz for your students</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="card">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="input-field"
                  required
                  placeholder="Enter quiz title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input-field"
                  rows={3}
                  placeholder="Describe your quiz (optional)"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Quiz Settings</h3>
                
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={formData.settings.allowAnonymousParticipants}
                      onChange={(e) => updateSettings('allowAnonymousParticipants', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="anonymous" className="text-sm text-gray-700">
                      Allow anonymous participants
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showAnswers"
                      checked={formData.settings.showCorrectAnswers}
                      onChange={(e) => updateSettings('showCorrectAnswers', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showAnswers" className="text-sm text-gray-700">
                      Show correct answers after submission
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time limit (seconds)
                      </label>
                      <input
                        type="number"
                        value={formData.settings.timeLimit}
                        onChange={(e) => updateSettings('timeLimit', parseInt(e.target.value))}
                        className="input-field"
                        min={30}
                        max={3600}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max participants
                      </label>
                      <input
                        type="number"
                        value={formData.settings.maxParticipants}
                        onChange={(e) => updateSettings('maxParticipants', parseInt(e.target.value))}
                        className="input-field"
                        min={1}
                        max={500}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
                <p className="text-sm text-blue-700">
                  After creating your quiz, you&apos;ll be able to add questions, customize the appearance, 
                  and start live sessions with your students.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn-secondary w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full sm:w-auto"
                >
                  {loading ? 'Creating...' : 'Create Quiz'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Card */}
        <div className="mt-8 card">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Preview</h3>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg">
              <h4 className="font-semibold text-lg">
                {formData.title || 'Your Quiz Title'}
              </h4>
              <p className="text-blue-100 text-sm mt-1">
                {formData.description || 'Quiz description will appear here'}
              </p>
              <div className="flex items-center space-x-4 mt-3 text-sm">
                <span>⏱️ {formData.settings.timeLimit}s</span>
                <span>👥 Max {formData.settings.maxParticipants}</span>
                <span>{formData.settings.allowAnonymousParticipants ? '🔓' : '🔒'} {formData.settings.allowAnonymousParticipants ? 'Open' : 'Closed'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
