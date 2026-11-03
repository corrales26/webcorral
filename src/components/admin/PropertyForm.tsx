"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PropertyMedia } from "@/components/media/PropertyMedia";
import {
  fileExceedsUploadLimit,
  isHeicUpload,
  isVideoMimeType,
  resolveUploadMimeType,
  UPLOAD_MEDIA_ACCEPT,
} from "@/lib/media-utils";
import type { Property } from "@/lib/types/property";
import {
  AMENITY_OPTIONS,
  PROPERTY_CONDITIONS,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  type PropertyInput,
} from "@/lib/types/property";

interface PropertyFormProps {
  initialData?: Property;
  mode: "create" | "edit";
}

const defaultValues: PropertyInput = {
  slug: "",
  title: "",
  location: "",
  address: "",
  province: "Cantabria",
  price: 0,
  status: "venta",
  type: "piso",
  condition: "buen_estado",
  bedrooms: 1,
  bathrooms: 1,
  area: 0,
  parking: false,
  elevator: false,
  terrace: false,
  garden: false,
  pool: false,
  storage: false,
  furnished: false,
  images: [],
  description: "",
  features: [],
  reference: "",
  featured: false,
  published: false,
};

const VIDEO_UPLOAD_TIMEOUT_MS = 15 * 60 * 1000;

async function uploadPropertyVideo(
  file: File
): Promise<{ url?: string; error?: string }> {
  const type = resolveUploadMimeType(file);
  let prepare: Response;
  try {
    prepare = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: file.name, type, size: file.size }),
      signal: AbortSignal.timeout(30000),
    });
  } catch {
    return { error: `${file.name}: no se ha podido subir` };
  }

  const prepared = (await prepare.json().catch(() => null)) as {
    url?: string;
    signedUrl?: string;
    contentType?: string;
    error?: string;
    fallback?: boolean;
  } | null;

  if (prepared?.fallback) return {};

  if (!prepare.ok || !prepared?.signedUrl || !prepared.url) {
    return { error: prepared?.error || `${file.name}: no se ha podido subir` };
  }

  let uploaded: Response;
  try {
    uploaded = await fetch(prepared.signedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": prepared.contentType || type,
        "cache-control": "max-age=3600",
      },
      signal: AbortSignal.timeout(VIDEO_UPLOAD_TIMEOUT_MS),
    });
  } catch {
    return { error: `${file.name}: no se ha podido subir` };
  }

  if (!uploaded.ok) {
    const payload = (await uploaded.json().catch(() => null)) as {
      message?: string;
      error?: string;
    } | null;
    const message = payload?.message || payload?.error || "";
    if (/maximum allowed size|exceeded/i.test(message)) {
      return { error: "El vídeo supera el límite de 50 MB." };
    }
    return { error: message || `${file.name}: no se ha podido subir` };
  }

  return { url: prepared.url };
}

export function PropertyForm({ initialData, mode }: PropertyFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<PropertyInput>(
    initialData
      ? {
          slug: initialData.slug,
          title: initialData.title,
          location: initialData.location,
          address: initialData.address,
          province: initialData.province,
          price: initialData.price,
          priceLabel: initialData.priceLabel,
          status: initialData.status,
          type: initialData.type,
          condition: initialData.condition,
          bedrooms: initialData.bedrooms,
          bathrooms: initialData.bathrooms,
          area: initialData.area,
          plotArea: initialData.plotArea,
          floor: initialData.floor,
          totalFloors: initialData.totalFloors,
          yearBuilt: initialData.yearBuilt,
          energyRating: initialData.energyRating,
          orientation: initialData.orientation,
          parking: initialData.parking,
          elevator: initialData.elevator,
          terrace: initialData.terrace,
          garden: initialData.garden,
          pool: initialData.pool,
          storage: initialData.storage,
          furnished: initialData.furnished,
          images: initialData.images,
          description: initialData.description,
          features: initialData.features,
          reference: initialData.reference,
          featured: initialData.featured,
          published: initialData.published,
        }
      : defaultValues
  );

  useEffect(() => {
    if (mode !== "create") return;

    let cancelled = false;
    fetch("/api/properties?nextReference=true")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { reference?: string } | null) => {
        if (cancelled || !data?.reference) return;
        setForm((current) =>
          current.reference ? current : { ...current, reference: data.reference! }
        );
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [mode]);
  const [featureInput, setFeatureInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadLabel, setUploadLabel] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!error) return;
    errorRef.current?.scrollIntoView({ block: "center" });
  }, [error]);

  function updateField<K extends keyof PropertyInput>(
    key: K,
    value: PropertyInput[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = [...(e.target.files ?? [])];
    e.target.value = "";
    if (files.length === 0) return;

    const failures: string[] = [];
    const accepted: File[] = [];

    for (const original of files) {
      const tooLarge = fileExceedsUploadLimit({
        type: original.type,
        name: original.name,
        size: original.size,
      });
      if (tooLarge) {
        failures.push(
          `${tooLarge} Puedes guardar el inmueble con las fotos ya añadidas o elegir un archivo más pequeño.`
        );
        continue;
      }
      accepted.push(original);
    }

    if (failures.length > 0) {
      const message = failures.join(" ");
      setUploadError(message);
      setError(message);
    } else {
      setUploadError("");
      setError("");
    }

    if (accepted.length === 0) {
      setUploading(false);
      setUploadLabel("");
      return;
    }

    setUploading(true);
    const watchdog = window.setTimeout(() => {
      setUploading(false);
      setUploadLabel("");
      const message =
        "No se ha podido subir la foto. Si pesa más de 5 MB, elige una más pequeña. Puedes guardar el inmueble con las fotos ya añadidas.";
      setUploadError(message);
      setError(message);
    }, 50000);
    try {
      for (let index = 0; index < accepted.length; index += 1) {
        const original = accepted[index];
        setUploadLabel(
          accepted.length > 1
            ? `Subiendo ${index + 1} de ${accepted.length}...`
            : "Subiendo..."
        );

        const video = isVideoMimeType(resolveUploadMimeType(original));
        const heic = isHeicUpload(original);
        let file = original;
        if (video) {
          const uploaded = await uploadPropertyVideo(original);
          if (uploaded.error) {
            failures.push(uploaded.error);
            continue;
          }
          if (uploaded.url) {
            const url = uploaded.url;
            setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
            continue;
          }
        }

        const formData = new FormData();
        formData.append("file", file);

        let response: Response;
        try {
          response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
            signal: AbortSignal.timeout(45000),
          });
        } catch {
          failures.push(
            heic
              ? "No se ha podido procesar la foto del iPhone. Prueba con JPG o PNG."
              : `${original.name}: no se ha podido subir`
          );
          continue;
        }

        const data = (await response.json().catch(() => null)) as {
          url?: string;
          error?: string;
        } | null;

        if (!response.ok || !data?.url) {
          const oversize = !video && original.size > 4 * 1000 * 1000;
          failures.push(
            oversize
              ? `«${original.name}» supera el límite de 5 MB. Puedes guardar el inmueble con las fotos ya añadidas o elegir un archivo más pequeño.`
              : data?.error ||
                (heic
                  ? "No se ha podido procesar la foto del iPhone. Prueba con JPG o PNG."
                  : `${original.name}: no se ha podido subir`)
          );
          continue;
        }

        const url = data.url;
        setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
      }
    } finally {
      window.clearTimeout(watchdog);
      setUploading(false);
      setUploadLabel("");
    }

    if (failures.length > 0) {
      const message = failures.join(" ");
      setUploadError(message);
      setError(message);
    }
  }

  function addImageUrl() {
    if (imageUrlInput.trim()) {
      updateField("images", [...form.images, imageUrlInput.trim()]);
      setImageUrlInput("");
    }
  }

  function removeImage(index: number) {
    updateField(
      "images",
      form.images.filter((_, i) => i !== index)
    );
  }

  function addFeature() {
    if (featureInput.trim()) {
      updateField("features", [...form.features, featureInput.trim()]);
      setFeatureInput("");
    }
  }

  function removeFeature(index: number) {
    updateField(
      "features",
      form.features.filter((_, i) => i !== index)
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (uploading) {
      setError("Espera a que terminen de subirse las fotos.");
      return;
    }

    const missing = !form.title.trim()
      ? "Escribe el título."
      : !form.location.trim()
        ? "Escribe la localidad."
        : !form.province.trim()
          ? "Escribe la provincia."
          : !form.description.trim()
            ? "Escribe la descripción."
            : null;
    if (missing) {
      setError(missing);
      return;
    }

    setSaving(true);
    setError("");

    const url =
      mode === "create"
        ? "/api/properties"
        : `/api/properties/${initialData!.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/inmuebles");
        router.refresh();
        return;
      }

      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || "Error al guardar");
      setSaving(false);
    } catch {
      setError("No se ha podido guardar el inmueble.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initialData || !confirm("¿Eliminar este inmueble?")) return;

    const res = await fetch(`/api/properties/${initialData.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/admin/inmuebles");
      router.refresh();
    }
  }

  const inputClass =
    "w-full rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]";

  const labelClass =
    "mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {error && (
        <p ref={errorRef} className="rounded-md border border-red-600 bg-white px-4 py-3 text-sm text-black">
          {error}
        </p>
      )}

      <section className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4 sm:p-6">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
          Información básica
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className={labelClass}>Título</label>
            <input id="title" required value={form.title} onChange={(e) => updateField("title", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="reference" className={labelClass}>Referencia</label>
            <input
              id="reference"
              required
              value={form.reference}
              onChange={(e) => updateField("reference", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="slug" className={labelClass}>Slug URL (opcional)</label>
            <input id="slug" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} className={inputClass} placeholder="piso-centro-santander" />
          </div>
          <div>
            <label htmlFor="status" className={labelClass}>Operación</label>
            <select id="status" value={form.status} onChange={(e) => updateField("status", e.target.value as PropertyInput["status"])} className={inputClass}>
              {Object.entries(PROPERTY_STATUSES).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              Vendida, alquilada y reservada siguen publicadas con cartel de no disponible. Próximamente deja ver las fotos, para promociones que aún no han empezado.
            </p>
          </div>
          <div>
            <label htmlFor="type" className={labelClass}>Tipo</label>
            <select id="type" value={form.type} onChange={(e) => updateField("type", e.target.value as PropertyInput["type"])} className={inputClass}>
              {Object.entries(PROPERTY_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="condition" className={labelClass}>Estado</label>
            <select id="condition" value={form.condition} onChange={(e) => updateField("condition", e.target.value as PropertyInput["condition"])} className={inputClass}>
              {Object.entries(PROPERTY_CONDITIONS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="price" className={labelClass}>Precio (€)</label>
            <input id="price" type="number" required min={0} value={form.price} onChange={(e) => updateField("price", Number(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label htmlFor="priceLabel" className={labelClass}>Etiqueta precio (alquiler)</label>
            <input id="priceLabel" value={form.priceLabel || ""} onChange={(e) => updateField("priceLabel", e.target.value || undefined)} className={inputClass} placeholder="950 €/mes" />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4 sm:p-6">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
          Ubicación
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="location" className={labelClass}>Localidad</label>
            <input id="location" required value={form.location} onChange={(e) => updateField("location", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="province" className={labelClass}>Provincia</label>
            <input id="province" required value={form.province} onChange={(e) => updateField("province", e.target.value)} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="address" className={labelClass}>Dirección completa</label>
            <input id="address" value={form.address || ""} onChange={(e) => updateField("address", e.target.value)} className={inputClass} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4 sm:p-6">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
          Superficie y distribución
        </h2>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <div>
            <label htmlFor="area" className={labelClass}>m² construidos</label>
            <input id="area" type="number" required min={0} value={form.area} onChange={(e) => updateField("area", Number(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label htmlFor="plotArea" className={labelClass}>m² parcela</label>
            <input id="plotArea" type="number" min={0} value={form.plotArea || ""} onChange={(e) => updateField("plotArea", e.target.value ? Number(e.target.value) : undefined)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="bedrooms" className={labelClass}>Habitaciones</label>
            <input id="bedrooms" type="number" required min={0} value={form.bedrooms} onChange={(e) => updateField("bedrooms", Number(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label htmlFor="bathrooms" className={labelClass}>Baños</label>
            <input id="bathrooms" type="number" required min={0} value={form.bathrooms} onChange={(e) => updateField("bathrooms", Number(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label htmlFor="floor" className={labelClass}>Planta</label>
            <input id="floor" type="number" value={form.floor ?? ""} onChange={(e) => updateField("floor", e.target.value ? Number(e.target.value) : undefined)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="totalFloors" className={labelClass}>Total plantas</label>
            <input id="totalFloors" type="number" value={form.totalFloors ?? ""} onChange={(e) => updateField("totalFloors", e.target.value ? Number(e.target.value) : undefined)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="yearBuilt" className={labelClass}>Año construcción</label>
            <input id="yearBuilt" type="number" value={form.yearBuilt ?? ""} onChange={(e) => updateField("yearBuilt", e.target.value ? Number(e.target.value) : undefined)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="energyRating" className={labelClass}>Cert. energética</label>
            <input id="energyRating" value={form.energyRating || ""} onChange={(e) => updateField("energyRating", e.target.value)} className={inputClass} placeholder="A-G" />
          </div>
          <div>
            <label htmlFor="orientation" className={labelClass}>Orientación</label>
            <input id="orientation" value={form.orientation || ""} onChange={(e) => updateField("orientation", e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          {AMENITY_OPTIONS.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm text-[var(--color-ink-2)]">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => updateField(key, e.target.checked)}
                className="rounded border-[var(--color-rule)] text-[var(--color-accent)] focus:ring-[var(--color-focus)]"
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4 sm:p-6">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
          Imágenes y vídeos
        </h2>
        <div className="flex flex-wrap gap-3">
          {form.images.map((image, index) => (
            <div key={`${image}-${index}`} className="relative h-24 w-32 overflow-hidden rounded-md border border-[var(--color-rule)]">
              <PropertyMedia src={image} alt="" fill className="object-cover" sizes="128px" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                aria-label="Eliminar archivo"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="cursor-pointer rounded-sm border border-[var(--color-accent)] px-4 py-2 text-center text-sm font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-on-accent)]">
            {uploadError ? "Supera el límite" : uploading ? uploadLabel || "Subiendo..." : "Subir fotos o vídeos"}
            <input
              type="file"
              accept={UPLOAD_MEDIA_ACCEPT}
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <input
            type="url"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            placeholder="URL de imagen o vídeo"
            className={`${inputClass} min-w-0 sm:max-w-xs`}
          />
          <button type="button" onClick={addImageUrl} className="rounded-sm bg-[var(--color-navy)] px-4 py-2 text-sm text-[var(--color-on-navy)]">
            Añadir URL
          </button>
          {uploadError && (
            <p className="w-full rounded-md border border-red-600 bg-white px-4 py-3 text-sm text-black">
              {uploadError}
            </p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4 sm:p-6">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
          Descripción y características
        </h2>
        <div>
          <label htmlFor="description" className={labelClass}>Descripción</label>
          <textarea
            id="description"
            required
            rows={8}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="mt-4">
          <label className={labelClass}>Detalles destacados</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} className={`${inputClass} min-w-0`} placeholder="Ej: Reforma integral 2024" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())} />
            <button type="button" onClick={addFeature} className="shrink-0 rounded-sm bg-[var(--color-navy)] px-4 py-2 text-sm text-[var(--color-on-navy)]">Añadir</button>
          </div>
          <ul className="mt-2 space-y-1">
            {form.features.map((feature, index) => (
              <li key={feature} className="flex items-center justify-between rounded-md bg-[var(--color-paper)] px-3 py-1.5 text-sm">
                {feature}
                <button type="button" onClick={() => removeFeature(index)} className="text-red-500">×</button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4 sm:p-6">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
          Publicación
        </h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => updateField("published", e.target.checked)} className="rounded border-[var(--color-rule)] text-[var(--color-accent)]" />
            Publicado en la web
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => updateField("featured", e.target.checked)}
              className="mt-0.5 rounded border-[var(--color-rule)] text-[var(--color-accent)]"
            />
            <span>
              <span className="font-medium text-[var(--color-ink)]">Destacado</span>
              <span className="mt-0.5 block text-xs text-[var(--color-muted)]">
                Prioriza la portada (hasta 4 inmuebles) y el listado. Solo 2 muestran la
                etiqueta «Destacado» en la web.
              </span>
            </span>
          </label>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="submit"
          disabled={saving}
          className="rounded-sm bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-on-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
        >
          {saving ? "Guardando..." : mode === "create" ? "Crear inmueble" : "Guardar cambios"}
        </button>
        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-sm border border-red-500 px-6 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Eliminar
          </button>
        )}
      </div>
    </form>
  );
}
