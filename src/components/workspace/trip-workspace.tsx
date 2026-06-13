"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ClipboardCheck,
  FileCheck2,
  Layers3,
  MapPinned,
  PackageCheck,
  Pin,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusMessage } from "@/components/ui/status-message";
import { destinations, getDestinationById } from "@/lib/data/mock-destinations";
import {
  calculateTripReadiness,
  getTripNextActions,
  groupPinsByDay,
} from "@/lib/workspace/readiness";
import { useTrip } from "@/store/trip-store";
import type {
  InsightStatus,
  MapPin,
  MapPinCategory,
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
const pinCategories: MapPinCategory[] = [
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

function SectionHeader({
  icon: Icon,
  label,
  title,
  description,
}: {
  icon: typeof ClipboardCheck;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-line bg-surface text-accent">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="editorial-label text-accent">{label}</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.02em] text-ink">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      </div>
    </div>
  );
}

export function TripWorkspace() {
  const { trip, hasHydrated, storageError, dispatch } = useTrip();
  const [notice, setNotice] = useState<string | null>(null);
  const [packingLabel, setPackingLabel] = useState("");
  const [packingCategory, setPackingCategory] = useState<PackingCategory>("clothing");
  const [documentLabel, setDocumentLabel] = useState("");
  const [decisionTitle, setDecisionTitle] = useState("");
  const [pinTitle, setPinTitle] = useState("");
  const [pinLocation, setPinLocation] = useState("");
  const [pinCategory, setPinCategory] = useState<MapPinCategory>("activity");
  const [pinDayId, setPinDayId] = useState("");
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
  const pinGroups = useMemo(() => groupPinsByDay(trip), [trip]);

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
    setNotice("Packing item added.");
  }

  function updatePackingItem(item: PackingItem, patch: Partial<PackingItem>) {
    dispatch({ type: "updatePackingItem", item: { ...item, ...patch } });
    setNotice("Packing item updated.");
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
    setNotice("Document added.");
  }

  function updateDocument(document: TripDocument, patch: Partial<TripDocument>) {
    dispatch({ type: "updateDocument", document: { ...document, ...patch } });
    setNotice("Document updated.");
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
    setNotice("Decision pinned.");
  }

  function updateDecision(decision: PinnedDecision, patch: Partial<PinnedDecision>) {
    dispatch({ type: "updatePinnedDecision", decision: { ...decision, ...patch } });
    setNotice("Pinned decision updated.");
  }

  function addMapPin() {
    const title = pinTitle.trim();
    const location = pinLocation.trim();
    if (!title || !location) return;
    dispatch({
      type: "addMapPin",
      pin: {
        id: newId("pin"),
        title,
        location,
        category: pinCategory,
        dayId: pinDayId || undefined,
      },
    });
    setPinTitle("");
    setPinLocation("");
    setPinDayId("");
    setNotice("Map pin added.");
  }

  function updateMapPin(pin: MapPin, patch: Partial<MapPin>) {
    dispatch({
      type: "updateMapPin",
      pin: {
        ...pin,
        ...patch,
        dayId: patch.dayId === "" ? undefined : patch.dayId ?? pin.dayId,
      },
    });
    setNotice("Map pin updated.");
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-start">
          <div>
            <p className="editorial-label text-accent">{destination.name} command center</p>
            <h1 className="mt-3 max-w-4xl font-serif text-5xl font-semibold leading-[1.02] tracking-[-0.025em] text-ink md:text-6xl">
              Prepare the whole trip from one workspace.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
              Track readiness, settle decisions, pack essentials, check documents, and keep
              spatial context close to the itinerary.
            </p>
          </div>

          <aside className="motion-panel rounded-2xl border border-accent bg-accent p-6 text-accent-ink">
            <p className="font-serif text-3xl font-semibold">{readiness.label}</p>
            <p className="mt-5 font-serif text-7xl font-semibold leading-none tracking-[-0.03em]">
              {readiness.score}
            </p>
            <p className="mt-5 text-sm font-semibold leading-6 opacity-90">{readiness.detail}</p>
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
              <span className="rounded-lg border border-accent-ink/20 p-3">
                {readiness.counts.packedItems}/{readiness.counts.totalPackingItems} packed
              </span>
              <span className="rounded-lg border border-accent-ink/20 p-3">
                {readiness.counts.readyDocuments}/{readiness.counts.totalDocuments} docs
              </span>
              <span className="rounded-lg border border-accent-ink/20 p-3">
                {readiness.counts.decidedPinnedDecisions}/{readiness.counts.totalPinnedDecisions} decisions
              </span>
              <span className="rounded-lg border border-accent-ink/20 p-3">
                {readiness.counts.mapPins} pins
              </span>
            </div>
          </aside>
        </div>

        <div className="mt-5 space-y-2" aria-live="polite">
          {!hasHydrated ? <StatusMessage tone="info">Loading saved workspace...</StatusMessage> : null}
          {storageError ? <StatusMessage tone="error">{storageError}</StatusMessage> : null}
          {notice ? <StatusMessage tone="success">{notice}</StatusMessage> : null}
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_25rem]">
          <div className="space-y-5">
            <section className="motion-panel rounded-2xl border border-line bg-panel-raised p-5 md:p-6">
              <SectionHeader
                icon={Layers3}
                label="Readiness inputs"
                title="What is driving the score"
                description="Each input is deterministic and updates as the local trip changes."
              />
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {readiness.inputs.map((input) => (
                  <article key={input.label} className="rounded-lg border border-line bg-surface p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-ink">{input.label}</p>
                        <p className="mt-1 text-sm leading-6 text-muted">{input.detail}</p>
                      </div>
                      <span className={`rounded-lg border px-3 py-2 text-sm font-bold ${statusClass(input.status)}`}>
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
            </section>

            <section className="motion-panel rounded-2xl border border-line bg-panel-raised p-5 md:p-6">
              <SectionHeader
                icon={PackageCheck}
                label="Packing"
                title="Essentials checklist"
                description="Add items as they come up, then check them off before departure."
              />
              <form
                className="mt-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_auto]"
                onSubmit={(event) => {
                  event.preventDefault();
                  addPackingItem();
                }}
              >
                <label className="space-y-1.5">
                  <span className="editorial-label text-muted">Item</span>
                  <Input
                    value={packingLabel}
                    onChange={(event) => setPackingLabel(event.target.value)}
                    placeholder="Rain jacket"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="editorial-label text-muted">Category</span>
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
              <div className="mt-5 space-y-3">
                {trip.packingItems.map((item) => (
                  <article key={item.id} className="grid gap-3 rounded-lg border border-line bg-surface p-3 md:grid-cols-[auto_minmax(0,1fr)_12rem_auto] md:items-center">
                    <input
                      type="checkbox"
                      className="size-5 accent-[var(--accent)]"
                      checked={item.packed}
                      aria-label={`Mark ${item.label} packed`}
                      onChange={() => {
                        dispatch({ type: "togglePackingItem", itemId: item.id });
                        setNotice(item.packed ? "Packing item unchecked." : "Packing item packed.");
                      }}
                    />
                    <Input
                      aria-label={`Packing item ${item.label}`}
                      value={item.label}
                      onChange={(event) => updatePackingItem(item, { label: event.target.value })}
                    />
                    <Select
                      aria-label={`Category for ${item.label}`}
                      value={item.category}
                      onChange={(event) =>
                        updatePackingItem(item, { category: event.target.value as PackingCategory })
                      }
                    >
                      {packingCategories.map((category) => (
                        <option key={category} value={category}>
                          {titleCase(category)}
                        </option>
                      ))}
                    </Select>
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-3"
                      onClick={() => {
                        dispatch({ type: "deletePackingItem", itemId: item.id });
                        setNotice("Packing item deleted.");
                      }}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      <span className="sr-only">Delete {item.label}</span>
                    </Button>
                  </article>
                ))}
              </div>
            </section>

            <section className="motion-panel rounded-2xl border border-line bg-panel-raised p-5 md:p-6">
              <SectionHeader
                icon={FileCheck2}
                label="Documents"
                title="Travel document checklist"
                description="Track confirmations, reservations, passports, and files that need offline access."
              />
              <form
                className="mt-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]"
                onSubmit={(event) => {
                  event.preventDefault();
                  addDocument();
                }}
              >
                <label className="space-y-1.5">
                  <span className="editorial-label text-muted">Document</span>
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
              <div className="mt-5 space-y-3">
                {trip.documents.map((document) => (
                  <article key={document.id} className="grid gap-3 rounded-lg border border-line bg-surface p-3 md:grid-cols-[minmax(0,1fr)_10rem_minmax(0,1fr)_auto] md:items-center">
                    <Input
                      aria-label={`Document ${document.label}`}
                      value={document.label}
                      onChange={(event) => updateDocument(document, { label: event.target.value })}
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
                      onChange={(event) => updateDocument(document, { notes: event.target.value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-3"
                      onClick={() => {
                        dispatch({ type: "deleteDocument", documentId: document.id });
                        setNotice("Document deleted.");
                      }}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      <span className="sr-only">Delete {document.label}</span>
                    </Button>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:h-fit">
            <section className="motion-panel rounded-2xl border border-line bg-panel-raised p-5">
              <SectionHeader
                icon={ClipboardCheck}
                label="Next actions"
                title="What to do next"
                description="Generated from the current trip state, not from a network service."
              />
              <div className="mt-5 space-y-3">
                {nextActions.map((item) => (
                  <article key={item.id} className="rounded-lg border border-line bg-surface p-4">
                    <p className="font-bold text-ink">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{item.description}</p>
                    {item.href ? (
                      <Link href={item.href} className="mt-3 inline-flex text-sm font-bold text-accent hover:text-ink">
                        Open related view
                      </Link>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>

            <section className="motion-panel rounded-2xl border border-line bg-panel-raised p-5">
              <SectionHeader
                icon={Pin}
                label="Decisions"
                title="Pinned trip calls"
                description="Keep unresolved choices visible without burying them in notes."
              />
              <form
                className="mt-5 flex gap-2"
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
              <div className="mt-4 space-y-3">
                {trip.pinnedDecisions.map((decision) => (
                  <article key={decision.id} className="rounded-lg border border-line bg-surface p-3">
                    <Input
                      aria-label={`Decision ${decision.title}`}
                      value={decision.title}
                      onChange={(event) => updateDecision(decision, { title: event.target.value })}
                    />
                    <div className="mt-2 grid gap-2 sm:grid-cols-[10rem_1fr_auto]">
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
                        value={decision.notes ?? ""}
                        placeholder="Notes"
                        onChange={(event) => updateDecision(decision, { notes: event.target.value })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="px-3"
                        onClick={() => {
                          dispatch({
                            type: "deletePinnedDecision",
                            decisionId: decision.id,
                          });
                          setNotice("Pinned decision deleted.");
                        }}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        <span className="sr-only">Delete {decision.title}</span>
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <section className="motion-panel mt-5 rounded-2xl border border-line bg-panel-raised p-5 md:p-6">
          <SectionHeader
            icon={MapPinned}
            label="Map context"
            title="Spatial anchors without a map API"
            description="Pin stays, transfers, errands, meals, and activities to the itinerary so the trip has practical geography."
          />
          <form
            className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_12rem_12rem_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              addMapPin();
            }}
          >
            <label className="space-y-1.5">
              <span className="editorial-label text-muted">Pin title</span>
              <Input
                value={pinTitle}
                onChange={(event) => setPinTitle(event.target.value)}
                placeholder="Coffee near station"
              />
            </label>
            <label className="space-y-1.5">
              <span className="editorial-label text-muted">Location</span>
              <Input
                value={pinLocation}
                onChange={(event) => setPinLocation(event.target.value)}
                placeholder="Kyoto Station"
              />
            </label>
            <label className="space-y-1.5">
              <span className="editorial-label text-muted">Category</span>
              <Select
                value={pinCategory}
                onChange={(event) => setPinCategory(event.target.value as MapPinCategory)}
              >
                {pinCategories.map((category) => (
                  <option key={category} value={category}>
                    {titleCase(category)}
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-1.5">
              <span className="editorial-label text-muted">Day</span>
              <Select value={pinDayId} onChange={(event) => setPinDayId(event.target.value)}>
                <option value="">Unassigned</option>
                {trip.days.map((day) => (
                  <option key={day.id} value={day.id}>
                    {day.dateLabel}
                  </option>
                ))}
              </Select>
            </label>
            <Button type="submit" className="self-end gap-2" aria-label="Add map pin">
              <Plus className="size-4" aria-hidden="true" />
              Add
            </Button>
          </form>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {pinGroups.map((group) => (
              <article key={group.dayId ?? "unassigned"} className="rounded-2xl border border-line bg-surface p-4">
                <p className="font-serif text-xl font-semibold text-ink">{group.label}</p>
                <div className="mt-4 space-y-3">
                  {group.pins.map((pin) => (
                    <div key={pin.id} className="rounded-lg border border-line bg-panel p-3">
                      <Input
                        aria-label={`Map pin ${pin.title}`}
                        value={pin.title}
                        onChange={(event) => updateMapPin(pin, { title: event.target.value })}
                      />
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <Input
                          aria-label={`Location for ${pin.title}`}
                          value={pin.location}
                          onChange={(event) =>
                            updateMapPin(pin, { location: event.target.value })
                          }
                        />
                        <Select
                          aria-label={`Category for ${pin.title}`}
                          value={pin.category}
                          onChange={(event) =>
                            updateMapPin(pin, {
                              category: event.target.value as MapPinCategory,
                            })
                          }
                        >
                          {pinCategories.map((category) => (
                            <option key={category} value={category}>
                              {titleCase(category)}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <Select
                          aria-label={`Day for ${pin.title}`}
                          value={pin.dayId ?? ""}
                          onChange={(event) => updateMapPin(pin, { dayId: event.target.value })}
                        >
                          <option value="">Unassigned</option>
                          {trip.days.map((day) => (
                            <option key={day.id} value={day.id}>
                              {day.dateLabel}
                            </option>
                          ))}
                        </Select>
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-3"
                          onClick={() => {
                            dispatch({ type: "deleteMapPin", pinId: pin.id });
                            setNotice("Map pin deleted.");
                          }}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                          <span className="sr-only">Delete {pin.title}</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
