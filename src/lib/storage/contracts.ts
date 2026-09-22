import { randomUUID } from "crypto";
import {
  decryptBuffer,
  decryptString,
  encryptBuffer,
  encryptString,
} from "@/lib/crypto";
import {
  CONTRACTS_BUCKET,
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase/admin";
import {
  CONTRACT_TYPES,
  type Contract,
  type ContractType,
} from "@/lib/types/contract";

interface ContractRow {
  id: string;
  title: string;
  contract_type: ContractType;
  client_name: string;
  property_reference: string | null;
  notes: string | null;
  signed_at: string | null;
  file_path: string;
  file_name: string;
  created_at: string;
}

function rowToContract(row: ContractRow): Contract {
  return {
    id: row.id,
    title: decryptString(row.title),
    type: row.contract_type,
    clientName: decryptString(row.client_name),
    propertyReference: row.property_reference
      ? decryptString(row.property_reference)
      : undefined,
    notes: row.notes ? decryptString(row.notes) : undefined,
    signedAt: row.signed_at ?? undefined,
    fileName: decryptString(row.file_name),
    createdAt: row.created_at,
  };
}

function assertConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase no está configurado");
  }
}

export async function getAllContracts(): Promise<Contract[]> {
  assertConfigured();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as ContractRow[]).map(rowToContract);
}

export async function createContract(input: {
  title: string;
  type: ContractType;
  clientName: string;
  propertyReference?: string;
  notes?: string;
  signedAt?: string;
  fileName: string;
  file: Buffer;
}): Promise<Contract> {
  assertConfigured();
  if (!(input.type in CONTRACT_TYPES)) {
    throw new Error("Tipo de contrato no válido");
  }

  const id = randomUUID();
  const filePath = `${id}.bin`;
  const supabase = getSupabaseAdmin();
  const encryptedFile = encryptBuffer(input.file);

  const { error: uploadError } = await supabase.storage
    .from(CONTRACTS_BUCKET)
    .upload(filePath, encryptedFile, {
      contentType: "application/octet-stream",
      upsert: false,
    });

  if (uploadError) throw new Error(uploadError.message);

  const row = {
    id,
    title: encryptString(input.title.trim()),
    contract_type: input.type,
    client_name: encryptString(input.clientName.trim()),
    property_reference: input.propertyReference
      ? encryptString(input.propertyReference)
      : null,
    notes: input.notes?.trim() ? encryptString(input.notes.trim()) : null,
    signed_at: input.signedAt || null,
    file_path: filePath,
    file_name: encryptString(input.fileName),
  };

  const { error } = await supabase.from("contracts").insert(row);
  if (error) {
    await supabase.storage.from(CONTRACTS_BUCKET).remove([filePath]);
    throw new Error(error.message);
  }

  return {
    id,
    title: input.title.trim(),
    type: input.type,
    clientName: input.clientName.trim(),
    propertyReference: input.propertyReference || undefined,
    notes: input.notes?.trim() || undefined,
    signedAt: input.signedAt || undefined,
    fileName: input.fileName,
    createdAt: new Date().toISOString(),
  };
}

export async function deleteContract(id: string): Promise<boolean> {
  assertConfigured();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("contracts")
    .select("file_path")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return false;

  const { error: deleteError } = await supabase.from("contracts").delete().eq("id", id);
  if (deleteError) throw new Error(deleteError.message);

  await supabase.storage.from(CONTRACTS_BUCKET).remove([data.file_path as string]);
  return true;
}

export async function getContractFile(
  id: string
): Promise<{ fileName: string; bytes: Buffer } | null> {
  assertConfigured();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("contracts")
    .select("file_path, file_name")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const { data: file, error: downloadError } = await supabase.storage
    .from(CONTRACTS_BUCKET)
    .download(data.file_path as string);

  if (downloadError || !file) throw new Error(downloadError?.message ?? "Archivo no encontrado");

  return {
    fileName: decryptString(data.file_name as string),
    bytes: decryptBuffer(Buffer.from(await file.arrayBuffer())),
  };
}
