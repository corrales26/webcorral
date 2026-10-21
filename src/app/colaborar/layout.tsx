import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colaboradores",
  robots: { index: false, follow: false },
};

export default function CollaboratorLayout({ children }: LayoutProps<"/colaborar">) {
  return children;
}
