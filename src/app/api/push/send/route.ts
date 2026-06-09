import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import PushSubscription from "@/lib/db/models/PushSubscription";
import webpush from "web-push";

// Initialize web-push
webpush.setVapidDetails(
  "mailto:contact@nitrr-oss.org",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string
);

export async function POST(request: Request) {
  try {
    // Basic API Key protection (using cron secret or any secure env var)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || process.env.GEMINI_API_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, body, url } = await request.json();
    await dbConnect();

    const subscriptions = await PushSubscription.find();
    const payload = JSON.stringify({ title, body, url: url || "/" });

    const notifications = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, payload);
      } catch (error) {
        // @ts-expect-error - web-push error type is complex
        if (error.statusCode === 404 || error.statusCode === 410) {
          // Subscription has expired or is no longer valid, delete it
          await PushSubscription.findByIdAndDelete(sub._id);
        } else {
          console.error("Error sending push notification:", error);
        }
      }
    });

    await Promise.all(notifications);

    return NextResponse.json({ success: true, count: subscriptions.length });
  } catch (error) {
    console.error("Send notification error:", error);
    // @ts-expect-error - Error is mostly of Error type
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
