import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      // אם זה JSON
      data = await req.json();
    } else {
      // אם זה Form Data (מה ש-Grow שולחים בפועל)
      const formData = await req.formData();
      data = Object.fromEntries(formData.entries());
    }

    console.log('--- Grow Webhook Received ---');
    console.log(data); 
    console.log('-----------------------------');

    // תמיד להחזיר 200 ל-Grow
    return NextResponse.json({ received: true }, { status: 200 });
    
  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    
    // אם הכל נכשל, ננסה להדפיס את הטקסט הגולמי כדי לראות מה הם שלחו
    try {
      const rawText = await req.text();
      console.log('Raw body received:', rawText);
    } catch (e) {}

    return NextResponse.json({ error: 'Failed to parse request' }, { status: 400 });
  }
}