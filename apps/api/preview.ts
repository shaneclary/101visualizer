import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64, overlayBase64 } = req.body;

    if (!imageBase64 || !overlayBase64) {
      return res.status(400).json({ error: "Missing base64 inputs" });
    }

    // Future: apply OpenCV compositing / scaling here.
    // For now, just echo back success.
    return res.status(200).json({
      message: "Preview route operational",
      received: {
        imageSize: imageBase64.length,
        overlaySize: overlayBase64.length,
      },
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}