import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../api/auth/[...nextauth]/route'
import { redirect, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export async function GET() {
  const session = await getServerSession(authOptions)
  // const session = await useSession(authOptions)
 

  if (!session) {
    return NextResponse.json({ message: 'You are not logged in.' })
redirect('/api/auth/signin')
  }

  return NextResponse.json({ message: 'hello' })

}
