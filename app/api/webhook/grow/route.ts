import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import twilio from 'twilio';

export async function POST(req: Request) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    const formData = await req.formData();
    const rawData = Object.fromEntries(formData.entries());

    const isSuccess = rawData['status'] === '1';
    const orderId = rawData['data[customFields][cField1]'] as string;
    const transactionId = rawData['data[transactionId]'];

    console.log(`Processing Webhook: Order ${orderId}, Success: ${isSuccess}`);

    if (isSuccess && orderId) {
      // יצירת קוד אימות רנדומלי
      const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

      // עדכון ה-DB וקבלת פרטי הלקוח
      const { data: updatedOrder, error } = await supabaseAdmin
        .from('orders')
        .update({
          status: 'paid',
          verification_code: verificationCode,
          payment_id: transactionId,
        })
        .eq('id', orderId)
        .select('customer_phone, customer_name')
        .single();

      if (error) {
        console.error('Supabase Update Error:', error.message);
        throw error;
      }

      console.log(`Order ${orderId} marked as PAID successfully.`);

        if (updatedOrder?.customer_phone) {
        try {
            const targetNumber = `whatsapp:${updatedOrder.customer_phone}`;
            const fromNumber = 'whatsapp:+14155238886';

            // לוג לפני השליחה כדי לראות את הפורמט הסופי
            console.log('--- Attempting WhatsApp Send ---');
            console.log('From:', fromNumber);
            console.log('To:', targetNumber);
            console.log('Order ID:', orderId);

            const messageBody = `🚀 *ההזמנה שלך ב-DeliveryNow אושרה!* ...`; // תוכן ההודעה

            const message = await client.messages.create({
            from: fromNumber,
            to: targetNumber,
            body: messageBody
            });

            // לוג במקרה של הצלחה - ה-SID הוא המזהה הייחודי של ההודעה ב-Twilio
            console.log('✅ WhatsApp Sent Successfully. Message SID:', message.sid);
            console.log('Status:', message.status);

        } catch (twilioError: any) {
            // לוג מפורט מאוד במקרה של שגיאה
            console.error('❌ Twilio Error Detected:');
            console.error('Error Code:', twilioError.code); // קוד השגיאה של Twilio (למשל 21608)
            console.error('Error Message:', twilioError.message);
            console.error('More Info:', twilioError.moreInfo); // לינק לפתרון השגיאה באתר של Twilio
        }
        }
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}