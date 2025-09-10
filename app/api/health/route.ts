import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check database connectivity
    const { supabase } = await import('@/lib/supabase')
    
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      throw error
    }

    // Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ]

    const missingEnvVars = requiredEnvVars.filter(
      envVar => !process.env[envVar]
    )

    if (missingEnvVars.length > 0) {
      return NextResponse.json({
        status: 'unhealthy',
        error: `Missing environment variables: ${missingEnvVars.join(', ')}`,
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
      }, { status: 503 })
    }

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage()
    }, { status: 200 })

  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0'
    }, { status: 503 })
  }
}

export async function HEAD(request: NextRequest) {
  // Simple HEAD request for basic health check
  return new Response(null, { status: 200 })
}
