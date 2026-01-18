/**
 * Client-side storage helper for uploading files to S3
 * This calls the server-side storage API endpoint
 */

export async function storagePut(
  fileName: string,
  data: Uint8Array,
  contentType: string
): Promise<{ url: string; key: string }> {
  // Convert Uint8Array to base64 for transmission
  const base64 = btoa(String.fromCharCode.apply(null, Array.from(data)));
  
  const response = await fetch("/api/storage/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName,
      data: base64,
      contentType,
    }),
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
}
