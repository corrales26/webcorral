import { isHeicUpload } from "@/lib/media-utils";

const COMPRESS_TIMEOUT_MS = 12000;
const DIRECT_UPLOAD_BYTES = 4 * 1024 * 1024;

export async function compressImageFile(file: File): Promise<File> {
  if (isHeicUpload(file) || !file.type.startsWith("image/")) return file;

  const compressed = await compressInWorker(file);
  if (compressed) return compressed;
  if (file.size <= DIRECT_UPLOAD_BYTES) return file;

  throw new Error(
    `«${file.name}» no se ha podido preparar. Puedes guardar el inmueble con las fotos ya añadidas o elegir un archivo más pequeño.`
  );
}

function compressInWorker(file: File): Promise<File | null> {
  return new Promise((resolve) => {
    let worker: Worker;
    try {
      worker = new Worker(new URL("./compress-image.worker.ts", import.meta.url));
    } catch {
      resolve(null);
      return;
    }

    let settled = false;
    const finish = (result: File | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      resolve(result);
    };

    const timer = setTimeout(() => finish(null), COMPRESS_TIMEOUT_MS);

    worker.onmessage = (event: MessageEvent<{ blob?: Blob; name?: string; type?: string }>) => {
      const data = event.data;
      if (!data?.blob || !data.name || !data.type) {
        finish(null);
        return;
      }
      finish(new File([data.blob], data.name, { type: data.type }));
    };
    worker.onerror = () => finish(null);
    worker.postMessage({ file });
  });
}
