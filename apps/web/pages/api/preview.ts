import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { imageBase64, overlayBase64 } = req.body || {};
    if (!imageBase64 || !overlayBase64) {
      return res.status(400).json({ error: "Missing base64 inputs" });
    }
    // stub for future server-side compositing
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}