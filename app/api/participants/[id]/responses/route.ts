import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { question_id, answer, response_time_ms, is_correct, points_awarded } = await request.json()

    if (!question_id || !answer) {
      return NextResponse.json({ 
        error: 'Question ID and answer are required' 
      }, { status: 400 })
    }

    // Verify participant exists
    const { data: participant, error: participantError } = await supabase
      .from('participants')
      .select('*')
      .eq('id', params.id)
      .single()

    if (participantError || !participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 })
    }

    // Check if response already exists for this question
    const { data: existingResponse } = await supabase
      .from('responses')
      .select('id')
      .eq('participant_id', params.id)
      .eq('question_id', question_id)
      .single()

    if (existingResponse) {
      return NextResponse.json({ error: 'Response already submitted for this question' }, { status: 400 })
    }

    // Save response
    const { data: response, error: responseError } = await supabase
      .from('responses')
      .insert([{
        participant_id: params.id,
        question_id,
        answer,
        response_time_ms: response_time_ms || 0,
        is_correct: is_correct || false,
        points_awarded: points_awarded || 0
      }])
      .select()
      .single()

    if (responseError) {
      return NextResponse.json({ error: responseError.message }, { status: 400 })
    }

    // Update participant's total score
    if (points_awarded && points_awarded > 0) {
      await supabase
        .from('participants')
        .update({
          total_score: participant.total_score + points_awarded,
          last_activity: new Date().toISOString()
        })
        .eq('id', params.id)
    }

    return NextResponse.json({ response }, { status: 201 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: responses, error: responsesError } = await supabase
      .from('responses')
      .select('*')
      .eq('participant_id', params.id)
      .order('submitted_at', { ascending: true })

    if (responsesError) {
      return NextResponse.json({ error: responsesError.message }, { status: 400 })
    }

    return NextResponse.json({ responses }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
