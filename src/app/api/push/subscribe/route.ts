import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import PushSubscription from "@/lib/db/models/PushSubscription";

export async function POST(request: Request) {
  try {
    const subscription = await request.json();
    await dbConnect();

    // Upsert subscription based on endpoint
    await PushSubscription.findOneAndUpdate({ endpoint: subscription.endpoint }, subscription, {
      upsert: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
