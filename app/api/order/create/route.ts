import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerPrice } from '@/lib/maps';

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

    console.log(customer)

    const secureAmount = await getServerPrice(pickup, dropOffs, packageType);

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        status: 'pending_payment',
        customer_name: customer.fullName,
        customer_phone: customer.phone,
        total_price: secureAmount, // המחיר שחושב בשרת
        weight_category: packageType,
        pickup_name: pickup.contactName,
        pickup_address: pickup.address,
        pickup_phone: pickup.contactPhone,
        pickup_date: new Date().toISOString(),
        is_scheduled: isScheduled,
        scheduled_at: isScheduled ? scheduledDate : null,
        latest_delivery_time: latestDeliveryTime || null,
      })
      .select()
      .single();

    if (orderError) throw new Error(`Order creation failed: ${orderError.message}`);

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

    const makeResponse = await fetch('https://hook.eu1.make.com/javaepckm2hpi8orvfoss2mhcl4871je', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer,
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