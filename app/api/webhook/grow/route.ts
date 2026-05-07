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
      const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

      const { data: updatedOrder, error } = await supabaseAdmin
        .from('orders')
        .update({ 
          status: 'paid',
          verification_code:verificationCode,
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
          
          await client.messages.create({
            from: 'whatsapp:+14155238886', 
            to: `whatsapp:${updatedOrder.customer_phone}`,
            body: `שלום ${updatedOrder.customer_name || ''}! ההזמנה שלך ב-A.V Express אושרה. קוד האימות שלך הוא: ${verificationCode}. לצפייה בפרטים: https://your-site.co.il/order/${orderId}`
          });
          
          console.log(`WhatsApp confirmation sent to ${updatedOrder.customer_phone}`);
        } catch (twilioError) {
          // אנחנו לא עוצרים את כל התהליך אם הוואטסאפ נכשל, כי התשלום כבר עבר וה-DB עודכן
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