import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="text-6xl mb-6">🎯</div>
            <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                BeaconIQ
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The interactive quiz platform that transforms learning through real-time engagement 
              and intelligent insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-soft">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Create and launch quizzes in seconds with our intuitive interface.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-soft">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Collaboration</h3>
              <p className="text-gray-600">
                Engage students with live quizzes and instant feedback.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-soft">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Analytics</h3>
              <p className="text-gray-600">
                Get detailed insights into student performance and engagement.
              </p>
            </div>
          </div>

          <div className="pt-8">
            <div className="bg-white p-8 rounded-2xl shadow-medium max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Started</h2>
              <div className="space-y-4">
                <Link href="/auth/register" className="block">
                  <button className="btn-primary w-full py-3">
                    Sign Up as Teacher
                  </button>
                </Link>
                <Link href="/join" className="block">
                  <button className="btn-secondary w-full py-3">
                    Join a Quiz
                  </button>
                </Link>
                <Link href="/auth/login" className="block">
                  <button className="text-blue-600 hover:text-blue-500 text-sm">
                    Already have an account? Sign in
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 text-sm text-gray-500">
            <p>🚀 Frontend Integration Complete | Ready for Real-time Features</p>
          </div>
        </div>
      </div>
    </div>
  )
}
