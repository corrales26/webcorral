export const CONTRACT_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.oasis.opendocument.text",
  "application/rtf",
  "text/rtf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.oasis.opendocument.spreadsheet",
] as const;

export const CONTRACT_DOCUMENT_ACCEPT = [
  ".pdf,.doc,.docx,.odt,.rtf,.xls,.xlsx,.ods,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,application/rtf,text/rtf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.oasis.opendocument.spreadsheet",
].join(",");

const EXTENSIONS = [".pdf", ".doc", ".docx", ".odt", ".rtf", ".xls", ".xlsx", ".ods"] as const;

const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".odt": "application/vnd.oasis.opendocument.text",
  ".rtf": "application/rtf",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ods": "application/vnd.oasis.opendocument.spreadsheet",
};

export const MAX_CONTRACT_DOCUMENT_BYTES = 10 * 1024 * 1024;

function getExtension(fileName: string): string {
  const match = fileName.toLowerCase().match(/(\.[a-z0-9]+)$/);
  return match?.[1] ?? "";
}

export function isAllowedContractDocument(file: {
  name: string;
  type: string;
}): boolean {
  const extension = getExtension(file.name);
  if (EXTENSIONS.includes(extension as (typeof EXTENSIONS)[number])) {
    return true;
  }

  return (CONTRACT_DOCUMENT_MIME_TYPES as readonly string[]).includes(file.type);
}

export function validateContractDocument(file: {
  name: string;
  type: string;
  size: number;
}): string | null {
  if (!isAllowedContractDocument(file)) {
    return "Formato no permitido. Usa PDF, Word, Excel, ODT u otros documentos ofimáticos.";
  }

  if (file.size > MAX_CONTRACT_DOCUMENT_BYTES) {
    return "El archivo supera el límite de 10 MB";
  }

  return null;
}

export function getContentTypeFromFileName(fileName: string): string {
  const extension = getExtension(fileName);
  return CONTENT_TYPE_BY_EXTENSION[extension] ?? "application/octet-stream";
}
