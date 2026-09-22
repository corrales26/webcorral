import bcrypt from "bcryptjs";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

const DUMMY_HASH = "$2b$08$jBT/IdNnlmXCG3czZn1qqehdsRxK7QYsKUJpUHft8Vm.xcl8BDbT6";

export interface CollaboratorGrant {
  id: string;
  name: string;
  email: string;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function verifyAdminPassword(
  email: string,
  password: string
): Promise<boolean> {
  const normalized = normalizeEmail(email);

  if (!isSupabaseConfigured() || !isEmail(normalized)) {
    await bcrypt.compare(password, DUMMY_HASH);
    return false;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("access_grants")
    .select("password_hash")
    .eq("role", "admin")
    .eq("active", true)
    .eq("email", normalized)
    .maybeSingle();

  const hash = !error && data?.password_hash ? data.password_hash : DUMMY_HASH;

  try {
    const matches = await bcrypt.compare(password, hash);
    return Boolean(data?.password_hash) && matches;
  } catch {
    return false;
  }
}

export async function findCollaboratorByEmail(
  email: string
): Promise<CollaboratorGrant | null> {
  const normalized = normalizeEmail(email);
  if (!isSupabaseConfigured() || !isEmail(normalized)) return null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("access_grants")
    .select("id, name, email")
    .eq("role", "collaborator")
    .eq("active", true)
    .eq("email", normalized)
    .maybeSingle();

  if (error || !data?.email) return null;
  return { id: data.id, name: data.name, email: data.email };
}

export async function findCollaboratorById(
  id: string
): Promise<CollaboratorGrant | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("access_grants")
    .select("id, name, email")
    .eq("role", "collaborator")
    .eq("active", true)
    .eq("id", id)
    .maybeSingle();

  if (error || !data?.email) return null;
  return { id: data.id, name: data.name, email: data.email };
}

export async function inviteCollaborator(name: string, email: string): Promise<void> {
  const normalized = normalizeEmail(email);
  const trimmedName = name.trim();

  if (!isEmail(normalized)) {
    throw new Error("Correo no válido");
  }
  if (!trimmedName) {
    throw new Error("El nombre es obligatorio");
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("access_grants").insert({
    role: "collaborator",
    name: trimmedName,
    email: normalized,
    password_hash: null,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("Ese correo ya está invitado");
    }
    throw new Error(error.message);
  }
}

export async function listCollaborators(): Promise<CollaboratorGrant[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("access_grants")
    .select("id, name, email")
    .eq("role", "collaborator")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? [])
    .filter((row) => row.email)
    .map((row) => ({ id: row.id, name: row.name, email: row.email as string }));
}
