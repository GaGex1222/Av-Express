// app/api/order/create/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerPrice } from '@/lib/maps';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      packageType, 
      isScheduled, 
      scheduledDate, 
      pickup, 
      dropOffs 
    } = body;

    console.log(body)

    const secureAmount = await getServerPrice(pickup, dropOffs, packageType);

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        status: 'pending_payment',
        total_price: secureAmount, // המחיר שחושב בשרת
        weight_category: packageType,
        pickup_address: pickup.address,
        pickup_phone: pickup.contactPhone,
        pickup_date: new Date().toISOString(),
        is_scheduled: isScheduled,
        scheduled_at: isScheduled ? scheduledDate : null,
      })
      .select()
      .single();

    if (orderError) throw new Error(`Order creation failed: ${orderError.message}`);

    // 4. יצירת נקודות המסירה
    const deliveryPoints = dropOffs.map((drop: any) => ({
      order_id: order.id,
      destination_address: drop.address,
      delivery_phone: drop.contactPhone,
      delivery_name: drop.contactName,
      notes: drop.notes || '',
      status: 'pending'
    }));

    const { error: pointsError } = await supabaseAdmin
      .from('delivery_points')
      .insert(deliveryPoints);

    if (pointsError) throw new Error(`Delivery points failed: ${pointsError.message}`);

    // 5. שליחת הבקשה ל-Make (עבור תשלום)
    const makeResponse = await fetch('https://hook.eu1.make.com/javaepckm2hpi8orvfoss2mhcl4871je', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order.id,
        packageType,
        totalAmount: secureAmount,
        pickup,
        dropOffs
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