const MAX_EDGE = 1920;

type CompressRequest = { file: File };
type CompressResponse =
  | { blob: Blob; name: string; type: string }
  | { failed: true };

const scope = globalThis as unknown as {
  onmessage: ((event: MessageEvent<CompressRequest>) => void) | null;
  postMessage: (message: CompressResponse) => void;
};

scope.onmessage = async (event) => {
  const file = event.data.file;
  try {
    const bitmap = await createImageBitmap(file);
    try {
      const longest = Math.max(bitmap.width, bitmap.height);
      const scale = longest > MAX_EDGE ? MAX_EDGE / longest : 1;
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = new OffscreenCanvas(width, height);
      const context = canvas.getContext("2d");
      if (!context) {
        scope.postMessage({ failed: true });
        return;
      }
      context.drawImage(bitmap, 0, 0, width, height);
      const blob =
        (await canvas.convertToBlob({ type: "image/webp", quality: 0.82 })) ??
        (await canvas.convertToBlob({ type: "image/jpeg", quality: 0.82 }));
      const base = file.name.replace(/\.[^.]+$/, "") || "foto";
      const type = blob.type || "image/jpeg";
      const extension = type === "image/webp" ? "webp" : "jpg";
      scope.postMessage({ blob, name: `${base}.${extension}`, type });
    } finally {
      bitmap.close();
    }
  } catch {
    scope.postMessage({ failed: true });
  }
};
