"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ClipboardCheck,
  Pencil,
  FileCheck2,
  Layers3,
  MapPinned,
  PackageCheck,
  Pin,
  Plus,
  Trash2,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusMessage } from "@/components/ui/status-message";
import { destinations, getDestinationById } from "@/lib/data/mock-destinations";
import {
  calculateTripReadiness,
  getTripNextActions,
  groupSpatialAnchorsByDay,
} from "@/lib/workspace/readiness";
import { useTrip } from "@/store/trip-store";
import type {
  InsightStatus,
  SpatialAnchor,
  SpatialAnchorCategory,
  PackingCategory,
  PackingItem,
  PinnedDecision,
  TripDecisionStatus,
  TripDocument,
  TripDocumentStatus,
} from "@/types/travel";

const packingCategories: PackingCategory[] = [
  "clothing",
  "documents",
  "health",
  "electronics",
  "comfort",
  "other",
];
const documentStatuses: TripDocumentStatus[] = ["needed", "ready", "missing"];
const decisionStatuses: TripDecisionStatus[] = ["open", "decided", "watch"];
const anchorCategories: SpatialAnchorCategory[] = [
  "arrival",
  "stay",
  "food",
  "activity",
  "transfer",
  "errand",
  "other",
];

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function statusClass(status: InsightStatus) {
  if (status === "good") return "border-positive/30 bg-positive/10 text-positive";
  if (status === "watch") return "border-warning/35 bg-warning/10 text-ink";
  return "border-danger/35 bg-danger/10 text-danger";
}

function titleCase(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function driverAction(label: string) {
  const actions: Record<string, string> = {
    "Itinerary readiness": "Add complete times or resolve the first overlap.",
    "Budget readiness": "Set a trip target or review the budget pressure.",
    "Packing readiness": "Pack the remaining essentials before departure.",
    "Document readiness": "Mark ready documents and flag anything missing.",
    "Decision readiness": "Settle open decisions or move them to watch.",
    "Spatial anchors": "Pin the stay, arrival point, or next transfer.",
  };

  return actions[label] ?? "Open the related section and clear the lowest-scoring input.";
}

function SectionHeader({
  icon: Icon,
  title,
  summary,
}: {
  icon: typeof ClipboardCheck;
  title: string;
  summary: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
      <div className="min-w-0">
        <h2 className="text-lg font-bold tracking-[-0.01em] text-ink">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-muted">{summary}</p>
      </div>
    </div>
  );
}

function DisclosurePanel({
  icon,
  title,
  summary,
  defaultOpen = false,
  children,
}: {
  icon: typeof ClipboardCheck;
  title: string;
  summary: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="motion-panel group rounded-2xl border border-line bg-panel-raised p-5 md:p-6"
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
        <SectionHeader icon={icon} title={title} summary={summary} />
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-surface text-muted transition group-open:text-accent">
          <ChevronDown
            className="size-4 transition-transform duration-200 group-open:rotate-180"
            aria-hidden="true"
          />
        </span>
      </summary>
      <div className="mt-6">{children}</div>
    </details>
  );
}

type UndoState =
  | { kind: "packing"; item: PackingItem; message: string }
  | { kind: "document"; item: TripDocument; message: string }
  | { kind: "decision"; item: PinnedDecision; message: string }
  | { kind: "anchor"; item: SpatialAnchor; message: string };

export function TripWorkspace() {
  const { trip, hasHydrated, storageError, dispatch } = useTrip();
  const [notice, setNotice] = useState<string | null>(null);
  const [undoState, setUndoState] = useState<UndoState | null>(null);
  const [editingPackingId, setEditingPackingId] = useState<string | null>(null);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [editingDecisionId, setEditingDecisionId] = useState<string | null>(null);
  const [editingAnchorId, setEditingAnchorId] = useState<string | null>(null);
  const [packingLabel, setPackingLabel] = useState("");
  const [packingCategory, setPackingCategory] = useState<PackingCategory>("clothing");
  const [documentLabel, setDocumentLabel] = useState("");
  const [decisionTitle, setDecisionTitle] = useState("");
  const [anchorTitle, setAnchorTitle] = useState("");
  const [anchorLocation, setAnchorLocation] = useState("");
  const [anchorCategory, setAnchorCategory] = useState<SpatialAnchorCategory>("activity");
  const [anchorDayId, setAnchorDayId] = useState("");
  const destination = useMemo(
    () => getDestinationById(trip.destinationId) ?? destinations[0],
    [trip.destinationId],
  );
  const readiness = useMemo(
    () => calculateTripReadiness(trip, destination),
    [destination, trip],
  );
  const nextActions = useMemo(
    () => getTripNextActions(trip, destination),
    [destination, trip],
  );
  const anchorGroups = useMemo(() => groupSpatialAnchorsByDay(trip), [trip]);
  const priorityDrivers = useMemo(() => {
    const drivers = readiness.inputs
      .filter((input) => input.status !== "good")
      .sort((first, second) => first.score - second.score);
    const rankedDrivers =
      drivers.length > 0
        ? drivers
        : [...readiness.inputs].sort((first, second) => first.score - second.score);

    return rankedDrivers.slice(0, 2);
  }, [readiness]);
  const openSection = useMemo(() => {
    const sectionByLabel: Record<string, string> = {
      "Packing readiness": "packing",
      "Document readiness": "documents",
      "Decision readiness": "decisions",
      "Spatial anchors": "anchors",
    };
    const ranked = [...readiness.inputs].sort((first, second) => first.score - second.score);

    for (const input of ranked) {
      if (input.status !== "good" && sectionByLabel[input.label]) {
        return sectionByLabel[input.label];
      }
    }

    return null;
  }, [readiness]);
  const unpackedCount = readiness.counts.totalPackingItems - readiness.counts.packedItems;
  const documentAttentionCount =
    readiness.counts.totalDocuments - readiness.counts.readyDocuments;
  const openDecisionCount =
    readiness.counts.totalPinnedDecisions - readiness.counts.decidedPinnedDecisions;
  const packingSummary = `${readiness.counts.packedItems} packed, ${unpackedCount} ${
    unpackedCount === 1 ? "item is" : "items are"
  } still open. Add or edit only when the list needs attention.`;
  const documentSummary = `${readiness.counts.readyDocuments} ready, ${documentAttentionCount} ${
    documentAttentionCount === 1 ? "needs" : "need"
  } attention. Track confirmations, passports, and offline files.`;
  const decisionSummary = `${readiness.counts.decidedPinnedDecisions} settled, ${openDecisionCount} ${
    openDecisionCount === 1 ? "is" : "are"
  } still open or on watch.`;
  const anchorSummary = `${readiness.counts.spatialAnchors} ${
    readiness.counts.spatialAnchors === 1 ? "anchor" : "anchors"
  }. Add stays, transfers, errands, meals, and activities when location context matters.`;

  function showNotice(message: string) {
    setUndoState(null);
    setNotice(message);
  }

  function showUndoDelete(undo: UndoState) {
    setUndoState(undo);
    setNotice(undo.message);
  }

  function restoreDeletedItem() {
    if (!undoState) return;

    switch (undoState.kind) {
      case "packing":
        dispatch({ type: "addPackingItem", item: undoState.item });
        break;
      case "document":
        dispatch({ type: "addDocument", document: undoState.item });
        break;
      case "decision":
        dispatch({ type: "addPinnedDecision", decision: undoState.item });
        break;
      case "anchor":
        dispatch({ type: "addSpatialAnchor", anchor: undoState.item });
        break;
    }

    setNotice("Deleted item restored.");
    setUndoState(null);
  }

  function addPackingItem() {
    const label = packingLabel.trim();
    if (!label) return;
    dispatch({
      type: "addPackingItem",
      item: {
        id: newId("pack"),
        label,
        category: packingCategory,
        packed: false,
      },
    });
    setPackingLabel("");
    showNotice("Packing item added.");
  }

  function updatePackingItem(item: PackingItem, patch: Partial<PackingItem>) {
    dispatch({ type: "updatePackingItem", item: { ...item, ...patch } });
    showNotice("Packing item updated.");
  }

  function addDocument() {
    const label = documentLabel.trim();
    if (!label) return;
    dispatch({
      type: "addDocument",
      document: {
        id: newId("doc"),
        label,
        status: "needed",
        notes: "",
      },
    });
    setDocumentLabel("");
    showNotice("Document added.");
  }

  function updateDocument(document: TripDocument, patch: Partial<TripDocument>) {
    dispatch({ type: "updateDocument", document: { ...document, ...patch } });
    showNotice("Document updated.");
  }

  function addDecision() {
    const title = decisionTitle.trim();
    if (!title) return;
    dispatch({
      type: "addPinnedDecision",
      decision: {
        id: newId("decision"),
        title,
        status: "open",
        notes: "",
      },
    });
    setDecisionTitle("");
    showNotice("Decision pinned.");
  }

  function updateDecision(decision: PinnedDecision, patch: Partial<PinnedDecision>) {
    dispatch({ type: "updatePinnedDecision", decision: { ...decision, ...patch } });
    showNotice("Pinned decision updated.");
  }

  function addSpatialAnchor() {
    const title = anchorTitle.trim();
    const location = anchorLocation.trim();
    if (!title || !location) return;
    dispatch({
      type: "addSpatialAnchor",
      anchor: {
        id: newId("anchor"),
        title,
        location,
        category: anchorCategory,
        dayId: anchorDayId || undefined,
      },
    });
    setAnchorTitle("");
    setAnchorLocation("");
    setAnchorDayId("");
    showNotice("Spatial anchor added.");
  }

  function updateSpatialAnchor(anchor: SpatialAnchor, patch: Partial<SpatialAnchor>) {
    dispatch({
      type: "updateSpatialAnchor",
      anchor: {
        ...anchor,
        ...patch,
        dayId: patch.dayId === "" ? undefined : patch.dayId ?? anchor.dayId,
      },
    });
    showNotice("Spatial anchor updated.");
  }

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <p className="editorial-label text-accent">{destination.name} command center</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-5xl">
            Prepare the whole trip from one workspace.
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">
            Start with the next actions below. Readiness updates automatically as you make progress.
          </p>
        </header>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <section className="motion-panel rounded-2xl border border-line bg-panel-raised p-5 md:p-6">
            <SectionHeader
              icon={ClipboardCheck}
              title="What to do next"
              summary="Generated from the current trip state, not from a network service."
            />
            <div className="mt-5 divide-y divide-line">
              {nextActions.map((item) => (
                <article key={item.id} className="py-4 first:pt-0 last:pb-0">
                  <p className="font-bold text-ink">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{item.description}</p>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-accent hover:text-ink"
                    >
                      Open related view
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <aside className="motion-panel rounded-2xl border border-accent bg-accent p-5 text-accent-ink md:p-6 lg:sticky lg:top-28">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-lg font-bold tracking-[-0.01em]">{readiness.label}</p>
              <p className="text-4xl font-extrabold leading-none tracking-[-0.02em] tabular-nums">
                {readiness.score}
              </p>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 opacity-90">{readiness.detail}</p>
            <div className="mt-5 divide-y divide-accent-ink/15 text-sm">
              <p className="py-2">
                {readiness.counts.packedItems}/{readiness.counts.totalPackingItems} packed
              </p>
              <p className="py-2">
                {readiness.counts.readyDocuments}/{readiness.counts.totalDocuments} docs
              </p>
              <p className="py-2">
                {readiness.counts.decidedPinnedDecisions}/{readiness.counts.totalPinnedDecisions} decisions
              </p>
              <p className="py-2">
                {readiness.counts.spatialAnchors} anchors
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-5 space-y-2" aria-live="polite">
          {!hasHydrated ? <StatusMessage tone="info">Loading saved workspace...</StatusMessage> : null}
          {storageError ? <StatusMessage tone="error">{storageError}</StatusMessage> : null}
          {notice ? (
            <StatusMessage
              tone="success"
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <span>{notice}</span>
              {undoState ? (
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-positive/30 bg-surface px-3 py-2 text-sm font-bold text-ink transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  onClick={restoreDeletedItem}
                >
                  <Undo2 className="size-4" aria-hidden="true" />
                  Undo delete
                </button>
              ) : null}
            </StatusMessage>
          ) : null}
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_25rem]">
          <div className="space-y-5">
            <section className="motion-panel rounded-2xl border border-line bg-panel-raised p-5 md:p-6">
              <SectionHeader
                icon={Layers3}
                title="Top score drivers"
                summary="Start with the lowest inputs. The full deterministic formula stays available when you need it."
              />
              <div className="mt-6 divide-y divide-line">
                {priorityDrivers.map((input) => (
                  <article key={input.label} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-bold text-ink">{input.label}</p>
                        <p className="mt-1 text-sm leading-6 text-muted">{input.detail}</p>
                        <p className="mt-2 text-xs font-semibold text-accent">
                          Next: {driverAction(input.label)}
                        </p>
                      </div>
                      <span className={`rounded-lg border px-3 py-2 text-sm font-bold ${statusClass(input.status)}`}>
                        {input.score}
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              <details className="group mt-5 border-t border-line pt-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-ink [&::-webkit-details-marker]:hidden">
                  <span>View full formula</span>
                  <ChevronDown
                    className="size-4 text-muted transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="mt-4 grid gap-x-6 md:grid-cols-2">
                  {readiness.inputs.map((input) => (
                    <article key={input.label} className="border-t border-line py-4 first:border-t-0 md:[&:nth-child(2)]:border-t-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-bold text-ink">{input.label}</p>
                          <p className="mt-1 text-sm leading-6 text-muted">{input.detail}</p>
                        </div>
                        <span
                          className={`rounded-lg border px-3 py-2 text-sm font-bold ${statusClass(input.status)}`}
                        >
                          {input.score}
                        </span>
                      </div>
                      <ul className="mt-3 space-y-1 text-xs font-semibold leading-5 text-muted">
                        {input.inputs.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </details>
            </section>

            <DisclosurePanel
              icon={PackageCheck}
              title="Essentials checklist"
              summary={packingSummary}
              defaultOpen={openSection === "packing"}
            >
              <form
                className="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_auto]"
                onSubmit={(event) => {
                  event.preventDefault();
                  addPackingItem();
                }}
              >
                <label className="space-y-1.5">
                  <span className="text-sm font-semibold text-muted">Item</span>
                  <Input
                    value={packingLabel}
                    onChange={(event) => setPackingLabel(event.target.value)}
                    placeholder="Rain jacket"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-semibold text-muted">Category</span>
                  <Select
                    value={packingCategory}
                    onChange={(event) => setPackingCategory(event.target.value as PackingCategory)}
                  >
                    {packingCategories.map((category) => (
                      <option key={category} value={category}>
                        {titleCase(category)}
                      </option>
                    ))}
                  </Select>
                </label>
                <Button type="submit" className="self-end gap-2" aria-label="Add packing item">
                  <Plus className="size-4" aria-hidden="true" />
                  Add
                </Button>
              </form>
              {trip.packingItems.length === 0 ? (
                <EmptyState
                  className="mt-5"
                  title="No packing items yet"
                  description="Add the first essential above to start the packing checklist."
                />
              ) : null}
              <div className="mt-5 divide-y divide-line">
                {trip.packingItems.map((item) => (
                  <article key={item.id} className="py-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <label className="flex min-w-0 items-center gap-3">
                        <input
                          type="checkbox"
                          className="size-8 shrink-0 accent-[var(--accent)]"
                          checked={item.packed}
                          aria-label={`Mark ${item.label} packed`}
                          onChange={() => {
                            dispatch({ type: "togglePackingItem", itemId: item.id });
                            showNotice(
                              item.packed ? "Packing item unchecked." : "Packing item packed.",
                            );
                          }}
                        />
                        <span className="min-w-0">
                          <span
                            className={`block truncate font-bold text-ink ${item.packed ? "line-through opacity-60" : ""}`}
                          >
                            {item.label}
                          </span>
                          <span className="mt-1 block text-xs font-semibold text-muted">
                            {titleCase(item.category)}
                          </span>
                        </span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          className="gap-2 px-3"
                          onClick={() =>
                            setEditingPackingId(editingPackingId === item.id ? null : item.id)
                          }
                        >
                          <Pencil className="size-4" aria-hidden="true" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-3"
                          onClick={() => {
                            dispatch({ type: "deletePackingItem", itemId: item.id });
                            setEditingPackingId(null);
                            showUndoDelete({
                              kind: "packing",
                              item,
                              message: "Packing item deleted.",
                            });
                          }}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                          <span className="sr-only">Delete {item.label}</span>
                        </Button>
                      </div>
                    </div>
                    {editingPackingId === item.id ? (
                      <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem]">
                        <Input
                          aria-label={`Packing item ${item.label}`}
                          value={item.label}
                          onChange={(event) =>
                            updatePackingItem(item, { label: event.target.value })
                          }
                        />
                        <Select
                          aria-label={`Category for ${item.label}`}
                          value={item.category}
                          onChange={(event) =>
                            updatePackingItem(item, {
                              category: event.target.value as PackingCategory,
                            })
                          }
                        >
                          {packingCategories.map((category) => (
                            <option key={category} value={category}>
                              {titleCase(category)}
                            </option>
                          ))}
                        </Select>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </DisclosurePanel>

            <DisclosurePanel
              icon={FileCheck2}
              title="Travel document checklist"
              summary={documentSummary}
              defaultOpen={openSection === "documents"}
            >
              <form
                className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]"
                onSubmit={(event) => {
                  event.preventDefault();
                  addDocument();
                }}
              >
                <label className="space-y-1.5">
                  <span className="text-sm font-semibold text-muted">Document</span>
                  <Input
                    value={documentLabel}
                    onChange={(event) => setDocumentLabel(event.target.value)}
                    placeholder="Hotel confirmation"
                  />
                </label>
                <Button type="submit" className="self-end gap-2" aria-label="Add document">
                  <Plus className="size-4" aria-hidden="true" />
                  Add
                </Button>
              </form>
              {trip.documents.length === 0 ? (
                <EmptyState
                  className="mt-5"
                  title="No documents tracked yet"
                  description="Add passports, confirmations, or offline files to track their status."
                />
              ) : null}
              <div className="mt-5 divide-y divide-line">
                {trip.documents.map((document) => (
                  <article key={document.id} className="py-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate font-bold text-ink">{document.label}</p>
                        <p className="mt-1 text-xs font-semibold text-muted">
                          {titleCase(document.status)}
                          {document.notes ? ` - ${document.notes}` : ""}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          className="gap-2 px-3"
                          onClick={() =>
                            setEditingDocumentId(
                              editingDocumentId === document.id ? null : document.id,
                            )
                          }
                        >
                          <Pencil className="size-4" aria-hidden="true" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-3"
                          onClick={() => {
                            dispatch({ type: "deleteDocument", documentId: document.id });
                            setEditingDocumentId(null);
                            showUndoDelete({
                              kind: "document",
                              item: document,
                              message: "Document deleted.",
                            });
                          }}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                          <span className="sr-only">Delete {document.label}</span>
                        </Button>
                      </div>
                    </div>
                    {editingDocumentId === document.id ? (
                      <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_10rem_minmax(0,1fr)]">
                        <Input
                          aria-label={`Document ${document.label}`}
                          value={document.label}
                          onChange={(event) =>
                            updateDocument(document, { label: event.target.value })
                          }
                        />
                        <Select
                          aria-label={`Status for ${document.label}`}
                          value={document.status}
                          onChange={(event) =>
                            updateDocument(document, {
                              status: event.target.value as TripDocumentStatus,
                            })
                          }
                        >
                          {documentStatuses.map((status) => (
                            <option key={status} value={status}>
                              {titleCase(status)}
                            </option>
                          ))}
                        </Select>
                        <Input
                          aria-label={`Notes for ${document.label}`}
                          value={document.notes ?? ""}
                          placeholder="Notes"
                          onChange={(event) =>
                            updateDocument(document, { notes: event.target.value })
                          }
                        />
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </DisclosurePanel>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:h-fit">
            <DisclosurePanel
              icon={Pin}
              title="Pinned trip calls"
              summary={decisionSummary}
              defaultOpen={openSection === "decisions"}
            >
              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  addDecision();
                }}
              >
                <label className="sr-only" htmlFor="decision-title">Decision title</label>
                <Input
                  id="decision-title"
                  value={decisionTitle}
                  onChange={(event) => setDecisionTitle(event.target.value)}
                  placeholder="Choose dinner seating"
                />
                <Button type="submit" className="px-3" aria-label="Add decision">
                  <Plus className="size-4" aria-hidden="true" />
                  <span className="sr-only">Add decision</span>
                </Button>
              </form>
              {trip.pinnedDecisions.length === 0 ? (
                <EmptyState
                  className="mt-4"
                  title="No pinned decisions yet"
                  description="Pin a recurring trip question above to track how it gets settled."
                />
              ) : null}
              <div className="mt-4 divide-y divide-line">
                {trip.pinnedDecisions.map((decision) => (
                  <article key={decision.id} className="py-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate font-bold text-ink">{decision.title}</p>
                        <p className="mt-1 text-xs font-semibold text-muted">
                          {titleCase(decision.status)}
                          {decision.notes ? ` - ${decision.notes}` : ""}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          className="gap-2 px-3"
                          onClick={() =>
                            setEditingDecisionId(
                              editingDecisionId === decision.id ? null : decision.id,
                            )
                          }
                        >
                          <Pencil className="size-4" aria-hidden="true" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-3"
                          onClick={() => {
                            dispatch({
                              type: "deletePinnedDecision",
                              decisionId: decision.id,
                            });
                            setEditingDecisionId(null);
                            showUndoDelete({
                              kind: "decision",
                              item: decision,
                              message: "Pinned decision deleted.",
                            });
                          }}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                          <span className="sr-only">Delete {decision.title}</span>
                        </Button>
                      </div>
                    </div>
                    {editingDecisionId === decision.id ? (
                      <div className="mt-3 grid gap-2 sm:grid-cols-[10rem_1fr]">
                        <Input
                          aria-label={`Decision ${decision.title}`}
                          value={decision.title}
                          onChange={(event) =>
                            updateDecision(decision, { title: event.target.value })
                          }
                        />
                        <Select
                          aria-label={`Status for ${decision.title}`}
                          value={decision.status}
                          onChange={(event) =>
                            updateDecision(decision, {
                              status: event.target.value as TripDecisionStatus,
                            })
                          }
                        >
                          {decisionStatuses.map((status) => (
                            <option key={status} value={status}>
                              {titleCase(status)}
                            </option>
                          ))}
                        </Select>
                        <Input
                          aria-label={`Notes for ${decision.title}`}
                          className="sm:col-span-2"
                          value={decision.notes ?? ""}
                          placeholder="Notes"
                          onChange={(event) =>
                            updateDecision(decision, { notes: event.target.value })
                          }
                        />
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </DisclosurePanel>
          </aside>
        </div>

        <div className="mt-5">
          <DisclosurePanel
            icon={MapPinned}
            title="Trip geography"
            summary={anchorSummary}
            defaultOpen={openSection === "anchors"}
          >
            <form
              className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_12rem_12rem_auto]"
              onSubmit={(event) => {
                event.preventDefault();
                addSpatialAnchor();
              }}
            >
              <label className="space-y-1.5">
                <span className="text-sm font-semibold text-muted">Anchor title</span>
                <Input
                  value={anchorTitle}
                  onChange={(event) => setAnchorTitle(event.target.value)}
                  placeholder="Coffee near station"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-semibold text-muted">Location</span>
                <Input
                  value={anchorLocation}
                  onChange={(event) => setAnchorLocation(event.target.value)}
                  placeholder="Kyoto Station"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-semibold text-muted">Category</span>
                <Select
                  value={anchorCategory}
                  onChange={(event) => setAnchorCategory(event.target.value as SpatialAnchorCategory)}
                >
                  {anchorCategories.map((category) => (
                    <option key={category} value={category}>
                      {titleCase(category)}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-semibold text-muted">Day</span>
                <Select value={anchorDayId} onChange={(event) => setAnchorDayId(event.target.value)}>
                  <option value="">Unassigned</option>
                  {trip.days.map((day) => (
                    <option key={day.id} value={day.id}>
                      {day.dateLabel}
                    </option>
                  ))}
                </Select>
              </label>
              <Button type="submit" className="self-end gap-2" aria-label="Add spatial anchor">
                <Plus className="size-4" aria-hidden="true" />
                Add
              </Button>
            </form>

            {anchorGroups.length === 0 ? (
              <EmptyState
                className="mt-6"
                title="No spatial anchors yet"
                description="Add the stay or arrival point first so the trip has geographic context."
              />
            ) : null}
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {anchorGroups.map((group) => (
                <section
                  key={group.dayId ?? "unassigned"}
                  className="min-w-0"
                >
                  <p className="font-serif text-xl font-semibold text-ink">{group.label}</p>
                  <div className="mt-4 divide-y divide-line">
                    {group.anchors.map((anchor) => (
                      <div key={anchor.id} className="py-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="truncate font-bold text-ink">{anchor.title}</p>
                            <p className="mt-1 text-sm leading-6 text-muted">{anchor.location}</p>
                            <p className="mt-1 text-xs font-semibold text-muted">
                              {titleCase(anchor.category)}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              className="gap-2 px-3"
                              onClick={() =>
                                setEditingAnchorId(editingAnchorId === anchor.id ? null : anchor.id)
                              }
                            >
                              <Pencil className="size-4" aria-hidden="true" />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              className="px-3"
                              onClick={() => {
                                dispatch({ type: "deleteSpatialAnchor", anchorId: anchor.id });
                                setEditingAnchorId(null);
                                showUndoDelete({
                                  kind: "anchor",
                                  item: anchor,
                                  message: "Spatial anchor deleted.",
                                });
                              }}
                            >
                              <Trash2 className="size-4" aria-hidden="true" />
                              <span className="sr-only">Delete {anchor.title}</span>
                            </Button>
                          </div>
                        </div>
                        {editingAnchorId === anchor.id ? (
                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            <Input
                              aria-label={`Spatial anchor ${anchor.title}`}
                              value={anchor.title}
                              onChange={(event) =>
                                updateSpatialAnchor(anchor, { title: event.target.value })
                              }
                            />
                            <Input
                              aria-label={`Location for ${anchor.title}`}
                              value={anchor.location}
                              onChange={(event) =>
                                updateSpatialAnchor(anchor, { location: event.target.value })
                              }
                            />
                            <Select
                              aria-label={`Category for ${anchor.title}`}
                              value={anchor.category}
                              onChange={(event) =>
                                updateSpatialAnchor(anchor, {
                                  category: event.target.value as SpatialAnchorCategory,
                                })
                              }
                            >
                              {anchorCategories.map((category) => (
                                <option key={category} value={category}>
                                  {titleCase(category)}
                                </option>
                              ))}
                            </Select>
                            <Select
                              aria-label={`Day for ${anchor.title}`}
                              value={anchor.dayId ?? ""}
                              onChange={(event) =>
                                updateSpatialAnchor(anchor, { dayId: event.target.value })
                              }
                            >
                              <option value="">Unassigned</option>
                              {trip.days.map((day) => (
                                <option key={day.id} value={day.id}>
                                  {day.dateLabel}
                                </option>
                              ))}
                            </Select>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </DisclosurePanel>
        </div>
      </div>
    </section>
  );
}
