declare module "heic-convert" {
  function convert(args: {
    buffer: Uint8Array | ArrayBuffer;
    format: "JPEG" | "PNG";
    quality?: number;
  }): Promise<Uint8Array>;

  export default convert;
}
