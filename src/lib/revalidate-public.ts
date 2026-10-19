import { revalidatePath } from "next/cache";

export function revalidatePublicProperties() {
  revalidatePath("/");
  revalidatePath("/inmuebles");
  revalidatePath("/inmuebles/[slug]", "page");
}
