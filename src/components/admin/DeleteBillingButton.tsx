"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteBillingButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    const res = await fetch(`/api/billing/${id}`, { method: "DELETE" });
    setPending(false);
    if (res.ok) router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="text-[var(--color-muted)] hover:text-red-600 disabled:opacity-60 dark:hover:text-red-400"
    >
      {pending ? "Eliminando…" : "Eliminar"}
    </button>
  );
}
