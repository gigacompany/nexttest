import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { authOptions } from '../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export async function GET(request) {
    const session = await getServerSession(authOptions)
    if(session){
  const url = 'https://api-dash.powerelay.softcell.com/v1/stats/top-senders';

  // Get the session token from the cookie
  const cookieStore = cookies();
  const sessionToken = request.cookies.get('next-auth.session-token')?.value;
console.log(sessionToken,'soT');
  try {
    if (!sessionToken) {
      console.error('Session token is missing. Please log in first.');
      return new Response('Unauthorized', { status: 401 });
    }

    const response = await axios.get(url, {
      headers: {
        'Cookie': `access_token=${sessionToken}`,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

}