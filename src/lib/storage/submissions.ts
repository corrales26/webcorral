import { randomUUID } from "crypto";
import { decryptBuffer, decryptString, encryptBuffer, encryptString } from "@/lib/crypto";
import { listCollaborators, type CollaboratorGrant } from "@/lib/access";
import {
  COLLABORATOR_FILES_BUCKET,
  getSupabaseAdmin,
} from "@/lib/supabase/admin";

export interface SubmissionImage {
  id: string;
  contentType: string;
}

export interface CollaboratorSubmission {
  id: string;
  body: string;
  createdAt: string;
  images: SubmissionImage[];
}

export interface CollaboratorFeed {
  collaborator: CollaboratorGrant;
  submissions: CollaboratorSubmission[];
}

interface SubmissionRow {
  id: string;
  grant_id: string;
  body: string;
  created_at: string;
}

interface ImageRow {
  id: string;
  submission_id: string;
  storage_path: string;
  content_type: string;
}

export async function createSubmission(input: {
  grantId: string;
  body: string;
  files: { bytes: Buffer; contentType: string }[];
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  const submissionId = randomUUID();
  const uploaded: { id: string; path: string; contentType: string }[] = [];

  try {
    for (const file of input.files) {
      const imageId = randomUUID();
      const storagePath = `${submissionId}/${imageId}.bin`;
      const { error } = await supabase.storage
        .from(COLLABORATOR_FILES_BUCKET)
        .upload(storagePath, encryptBuffer(file.bytes), {
          contentType: "application/octet-stream",
          upsert: false,
        });

      if (error) throw new Error(error.message);
      uploaded.push({
        id: imageId,
        path: storagePath,
        contentType: file.contentType,
      });
    }

    const { error: submissionError } = await supabase
      .from("collaborator_submissions")
      .insert({
        id: submissionId,
        grant_id: input.grantId,
        body: encryptString(input.body.trim()),
      });

    if (submissionError) throw new Error(submissionError.message);

    const { error: imagesError } = await supabase.from("submission_images").insert(
      uploaded.map((file) => ({
        id: file.id,
        submission_id: submissionId,
        storage_path: file.path,
        content_type: file.contentType,
      }))
    );

    if (imagesError) throw new Error(imagesError.message);
  } catch (error) {
    if (uploaded.length > 0) {
      await supabase.storage
        .from(COLLABORATOR_FILES_BUCKET)
        .remove(uploaded.map((file) => file.path));
    }
    throw error;
  }
}

export async function getCollaboratorFeed(): Promise<CollaboratorFeed[]> {
  const collaborators = await listCollaborators();
  if (collaborators.length === 0) return [];

  const supabase = getSupabaseAdmin();
  const ids = collaborators.map((collaborator) => collaborator.id);

  const { data: submissions, error } = await supabase
    .from("collaborator_submissions")
    .select("id, grant_id, body, created_at")
    .in("grant_id", ids)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const rows = (submissions ?? []) as SubmissionRow[];
  const submissionIds = rows.map((row) => row.id);
  let images: ImageRow[] = [];

  if (submissionIds.length > 0) {
    const { data: imageRows, error: imagesError } = await supabase
      .from("submission_images")
      .select("id, submission_id, storage_path, content_type")
      .in("submission_id", submissionIds);

    if (imagesError) throw new Error(imagesError.message);
    images = (imageRows ?? []) as ImageRow[];
  }

  return collaborators.map((collaborator) => ({
    collaborator,
    submissions: rows
      .filter((row) => row.grant_id === collaborator.id)
      .map((row) => ({
        id: row.id,
        body: decryptString(row.body),
        createdAt: row.created_at,
        images: images
          .filter((image) => image.submission_id === row.id)
          .map((image) => ({ id: image.id, contentType: image.content_type })),
      })),
  }));
}

export async function getSubmissionImage(
  imageId: string
): Promise<{ bytes: Buffer; contentType: string } | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("submission_images")
    .select("storage_path, content_type")
    .eq("id", imageId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const { data: file, error: downloadError } = await supabase.storage
    .from(COLLABORATOR_FILES_BUCKET)
    .download(data.storage_path as string);

  if (downloadError || !file) {
    throw new Error(downloadError?.message ?? "Imagen no encontrada");
  }

  return {
    contentType: data.content_type as string,
    bytes: decryptBuffer(Buffer.from(await file.arrayBuffer())),
  };
}
