export const CONTRACT_TYPES = {
  arras: "Contrato de arras",
  compraventa: "Compraventa",
  alquiler: "Alquiler",
  encargo: "Encargo de venta",
  otro: "Otro",
} as const;

export type ContractType = keyof typeof CONTRACT_TYPES;

export interface Contract {
  id: string;
  title: string;
  type: ContractType;
  clientName: string;
  propertyReference?: string;
  notes?: string;
  signedAt?: string;
  fileName: string;
  createdAt: string;
}
