interface EmailAddressProps {
  email: string;
  className?: string;
}

/** Evita cortes feos del dominio en columnas estrechas. */
export function EmailAddress({ email, className }: EmailAddressProps) {
  const at = email.indexOf("@");
  if (at === -1) {
    return <span className={className}>{email}</span>;
  }

  const local = email.slice(0, at + 1);
  const domain = email.slice(at + 1);

  return (
    <span className={className}>
      <span className="whitespace-nowrap">{local}</span>
      <wbr />
      <span className="whitespace-nowrap">{domain}</span>
    </span>
  );
}
