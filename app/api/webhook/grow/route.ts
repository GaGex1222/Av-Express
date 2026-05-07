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
          // הגדרת תוכן ההודעה החדש
          const messageBody = `🚀 *ההזמנה שלך ב-DeliveryNow אושרה!*

        שלום ${updatedOrder.customer_name || 'אורח'}, איזה כיף, אנחנו כבר בדרך! 🏎️

        🔐 *קוד אימות למסירה:* ${verificationCode}
        (_יש למסור את הקוד לשליח בעת ההגעה_)

        📍 *למעקב בזמן אמת ופרטי המשלוח:*
        https://swiper.co.il/order/${orderId}

        תודה שבחרת בנו! 🙌`;

          await client.messages.create({
            from: 'whatsapp:+14155238886',
            to: `whatsapp:${updatedOrder.customer_phone}`,
            body: messageBody
          });

          console.log(`WhatsApp confirmation sent to ${updatedOrder.customer_phone}`);
        } catch (twilioError) {
          // שגיאת וואטסאפ לא מפילה את ה-Webhook כדי למנוע כפילויות בתשלום
          console.error('Failed to send WhatsApp, but order is paid:', twilioError);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}