"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Property, PropertyStatus, PropertyType } from "@/lib/types/property";
import { PROPERTY_STATUSES, PROPERTY_TYPES } from "@/lib/types/property";
import {
  comparePropertiesForListing,
  featuredBadgePropertyIds,
} from "@/lib/property-utils";
import { PropertyCard } from "./PropertyCard";

function parseStatus(value: string | null): PropertyStatus | "all" {
  if (value && value in PROPERTY_STATUSES) return value as PropertyStatus;
  return "all";
}

function parseType(value: string | null): PropertyType | "all" {
  if (value && value in PROPERTY_TYPES) return value as PropertyType;
  return "all";
}

interface PropertyListingProps {
  properties: Property[];
}

export function PropertyListing({ properties }: PropertyListingProps) {
  const searchParams = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | "all">(() =>
    parseStatus(searchParams.get("status"))
  );
  const [typeFilter, setTypeFilter] = useState<PropertyType | "all">(() =>
    parseType(searchParams.get("type"))
  );
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [sort, setSort] = useState<"recent" | "price-asc" | "price-desc">("recent");

  const featuredBadgeIds = useMemo(
    () => featuredBadgePropertyIds(properties),
    [properties],
  );

  const filtered = useMemo(() => {
    let result = [...properties];

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }
    if (typeFilter !== "all") {
      result = result.filter((p) => p.type === typeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.province.toLowerCase().includes(q) ||
          p.reference.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) =>
      comparePropertiesForListing(a, b, sort, featuredBadgeIds),
    );

    return result;
  }, [properties, statusFilter, typeFilter, search, sort, featuredBadgeIds]);

  return (
    <div>
      <div className="mb-8 rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="search" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Buscar
            </label>
            <input
              id="search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ubicación, referencia..."
              className="w-full rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            />
          </div>
          <div>
            <label htmlFor="status" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Operación
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PropertyStatus | "all")}
              className="w-full rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              <option value="all">Todas</option>
              {Object.entries(PROPERTY_STATUSES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="type" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Tipo
            </label>
            <select
              id="type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as PropertyType | "all")}
              className="w-full rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              <option value="all">Todos</option>
              {Object.entries(PROPERTY_TYPES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sort" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Ordenar
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="w-full rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              <option value="recent">Más recientes</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          {filtered.length} inmueble{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-[var(--color-muted)]">
          No hay inmuebles que coincidan con tu búsqueda.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              showTitle
              showFeaturedBadge={featuredBadgeIds.has(property.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
