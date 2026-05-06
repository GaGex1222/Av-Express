import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log('--- Grow Webhook Received ---');
    console.log(JSON.stringify(data, null, 2));
    console.log('-----------------------------');

    return NextResponse.json({ received: true }, { status: 200 });
    
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}