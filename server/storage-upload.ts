import { Router } from "express";
import { storagePut } from "./storage";

const router = Router();

router.post("/upload", async (req, res) => {
  try {
    const { fileName, data, contentType } = req.body;

    if (!fileName || !data || !contentType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Convert base64 back to buffer
    const buffer = Buffer.from(data, "base64");

    // Upload to S3
    const result = await storagePut(fileName, buffer, contentType);

    res.json(result);
  } catch (error) {
    console.error("Storage upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
