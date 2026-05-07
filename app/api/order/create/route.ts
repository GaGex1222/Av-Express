import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerPrice } from '@/lib/maps';

// פונקציית עזר לפורמט מספר טלפון בשרת
const formatToE164 = (phone: string) => {
  if (!phone) return phone;
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '972' + cleaned.substring(1);
  }
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      customer,
      packageType, 
      isScheduled, 
      scheduledDate, 
      pickup, 
      dropOffs,
      latestDeliveryTime
    } = body;

    // 1. ניקוי ופורמט מספרי הטלפון לפני הזנה ל-DB ול-Make/Grow
    const formattedCustomerPhone = formatToE164(customer.phone);
    const formattedPickupPhone = formatToE164(pickup.contactPhone);

    const secureAmount = await getServerPrice(pickup, dropOffs, packageType);

    // 2. הכנסה לטבלת orders עם הטלפונים המפורמטים
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        status: 'pending_payment',
        customer_name: customer.fullName,
        customer_phone: formattedCustomerPhone, // מעודכן
        total_price: secureAmount,
        weight_category: packageType,
        pickup_name: pickup.contactName,
        pickup_address: pickup.address,
        pickup_phone: formattedPickupPhone, // מעודכן
        pickup_date: new Date().toISOString(),
        is_scheduled: isScheduled,
        scheduled_at: isScheduled ? scheduledDate : null,
        latest_delivery_time: latestDeliveryTime || null,
      })
      .select()
      .single();

    if (orderError) throw new Error(`Order creation failed: ${orderError.message}`);

    // 3. הכנת נקודות המסירה עם טלפונים מפורמטים
    const deliveryPoints = dropOffs.map((drop: any) => ({
      order_id: order.id,
      destination_address: drop.address,
      delivery_phone: formatToE164(drop.contactPhone), // מעודכן
      delivery_name: drop.contactName,
      notes: drop.notes || '',
      status: 'pending'
    }));

    const { error: pointsError } = await supabaseAdmin
      .from('delivery_points')
      .insert(deliveryPoints);

    if (pointsError) throw new Error(`Delivery points failed: ${pointsError.message}`);

    // 4. שליחה ל-Make/Grow (עכשיו האובייקט מכיל את הטלפונים המפורמטים)
    const makeResponse = await fetch('https://hook.eu1.make.com/javaepckm2hpi8orvfoss2mhcl4871je', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: customer,
        orderId: order.id,
        packageType,
        totalAmount: secureAmount,
        pickup: pickup,
        dropOffs: dropOffs.map((d: any) => ({ ...d, contactPhone: formatToE164(d.contactPhone) }))
      }),
    });

    const makeResult = await makeResponse.json();

    return NextResponse.json({ 
      status: 'success', 
      checkoutUrl: makeResult.checkoutUrl,
      orderId: order.id 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Order Creation Error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: error.message || 'שגיאה בתהליך יצירת ההזמנה' 
    }, { status: 400 });
  }
}