"use client";

import { useRouter } from "next/navigation";

export function CollaboratorLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/colaborar/logout", { method: "POST" });
    router.push("/colaborar");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
    >
      Salir
    </button>
  );
}
