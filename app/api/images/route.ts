import { getR2Images } from '@/lib/r2-images'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const images = await getR2Images()
    return NextResponse.json({ images })
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}
