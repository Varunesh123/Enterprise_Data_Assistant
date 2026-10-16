import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Database, Layers3, Plus, Search, X, RefreshCw } from "lucide-react";

import { createSchema, getSchemas, type DataSchema } from "../api/schemas";

const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

const environments = ["development", "staging", "production"];

function EnvironmentBadge({value}: {value: string}){
    const styles: Record<string, string> = {
        development: "bg-slate-100 text-slate-700",
        staging: "bg-amber-50 text-amber-700",
        production: "bg-emerald-50 text-emerald-700",
    };

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                styles[value] ?? "bg-slate-100 text-slate-700"
            }`}
        >
            {value}
        </span>
    );
}

export default function Schemas(){
    const { catalogId } = useParams<{ catalogId: string }>();

    const [schemas, setSchemas] = useState<DataSchema[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const [name, setName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [description, setDescription] = useState("");
    const [environment, setEnvironment] = useState("development");
    const [ownerTeam, setOwnerTeam] = useState("");

    const loadSchemas = useCallback(async () => {
        if(!catalogId) {
            setError("Catalog ID is missing from the URL.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await getSchemas(catalogId);
            setSchemas(result);
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ?? "Unable to load schemas. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    }, [catalogId]);

    useEffect(() => {
        void loadSchemas();
    }, [loadSchemas]);

    const filteredSchemas = schemas.filter((schema) => {
        const query = search.trim().toLowerCase();

        return [
            schema.name,
            schema.display_name ?? "",
            schema.description ?? "",
            schema.owner_team ?? "",
            schema.environment,
        ].some((value) => value.toLowerCase().includes(query));
    });

    async function handleCreate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!catalogId) {
            setError("Catalog ID is missing from the URL.");
            return;
        }
      
        setSaving(true);
        setError("");
        setNotice("");

        try {
            const created = await createSchema(catalogId, {
              name: name.trim(),
              display_name: displayName.trim() || undefined,
              description: description.trim() || undefined,
              environment,
              owner_team: ownerTeam.trim() || undefined,
            });
      
            setSchemas((current) =>
              [...current, created].sort((a, b) =>
                a.name.localeCompare(b.name),
              ),
            );
      
            setModalOpen(false);
            setName("");
            setDisplayName("");
            setDescription("");
            setEnvironment("development");
            setOwnerTeam("");
            setNotice(`Schema "${created.name}" created successfully.`);
          } catch (err: any) {
            setError(
              err?.response?.data?.detail ??
                "Unable to create schema. Please try again.",
            );
          } finally {
            setSaving(false);
          }
        }
        
        return (
            <div className="min-h-screen bg-slate-50 p-5 sm:p-8">
              <div className="mx-auto max-w-7xl">
                <Link
                  to="/catalog"
                  className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                >
                  <ArrowLeft size={16} />
                  Back to Data Catalog
                </Link>
        
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-500">
                      <Database size={14} />
                      Data Catalog
                      <span>/</span>
                      <span className="text-slate-800">Schemas</span>
                    </div>
        
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                      Schema Management
                    </h1>
        
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                      Organize and discover schemas within this catalog. Add
                      descriptions and ownership details to make metadata easier
                      for your team to understand.
                    </p>
                  </div>
        
                  <button
                    onClick={() => {
                      setError("");
                      setNotice("");
                      setModalOpen(true);
                    }}
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    <Plus size={17} />
                    Add Schema
                  </button>
                </div>
        
                {error && (
                  <div
                    role="alert"
                    className="mt-6 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    <span>{error}</span>
                    <button
                      onClick={() => void loadSchemas()}
                      className="shrink-0 font-semibold underline"
                    >
                      Retry
                    </button>
                  </div>
                )}
        
                {notice && (
                  <div
                    role="status"
                    className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                  >
                    {notice}
                  </div>
                )}
        
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-500">Total schemas</p>
                      <Layers3 size={19} className="text-indigo-500" />
                    </div>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">
                      {loading ? "—" : schemas.length}
                    </p>
                  </div>
        
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">Environments</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">
                      {loading
                        ? "—"
                        : new Set(schemas.map((schema) => schema.environment)).size}
                    </p>
                  </div>
        
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">Owner teams</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">
                      {loading
                        ? "—"
                        : new Set(
                            schemas
                              .map((schema) => schema.owner_team)
                              .filter(Boolean),
                          ).size}
                    </p>
                  </div>
                </div>
        
                <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-semibold text-slate-900">
                        Schemas in this catalog
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Browse schema metadata and ownership.
                      </p>
                    </div>
        
                    <div className="relative w-full sm:max-w-xs">
                      <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search schemas..."
                        aria-label="Search schemas"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
        
                  {loading ? (
                    <div className="space-y-3 p-5" aria-label="Loading schemas">
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className="h-16 animate-pulse rounded-xl bg-slate-100"
                        />
                      ))}
                    </div>
                  ) : filteredSchemas.length === 0 ? (
                    <div className="px-5 py-16 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                        <Layers3 size={22} className="text-slate-500" />
                      </div>
        
                      <h3 className="mt-4 font-semibold text-slate-900">
                        {search ? "No matching schemas" : "No schemas yet"}
                      </h3>
        
                      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                        {search
                          ? "Try another search term."
                          : "Create your first schema to start organizing tables and columns."}
                      </p>
        
                      {!search && (
                        <button
                          onClick={() => setModalOpen(true)}
                          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                          <Plus size={16} />
                          Create first schema
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="hidden grid-cols-[minmax(180px,1.5fr)_minmax(160px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)] gap-4 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
                        <span>Schema</span>
                        <span>Description</span>
                        <span>Environment</span>
                        <span>Owner team</span>
                      </div>
        
                      <div className="divide-y divide-slate-100">
                        {filteredSchemas.map((schema) => (
                          <div
                            key={schema.id}
                            className="grid gap-3 px-5 py-4 transition hover:bg-slate-50 md:grid-cols-[minmax(180px,1.5fr)_minmax(160px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)] md:items-center md:gap-4"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                                <Layers3 size={18} className="text-indigo-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                  {schema.display_name || schema.name}
                                </p>
                                <p className="mt-0.5 truncate font-mono text-xs text-slate-500">
                                  {schema.name}
                                </p>
                              </div>
                            </div>
        
                            <p className="text-sm leading-5 text-slate-500">
                              {schema.description || "No description provided"}
                            </p>
        
                            <div>
                              <span className="mr-2 text-xs text-slate-400 md:hidden">
                                Environment:
                              </span>
                              <EnvironmentBadge value={schema.environment} />
                            </div>
        
                            <p className="text-sm text-slate-600">
                              <span className="mr-2 text-xs text-slate-400 md:hidden">
                                Owner:
                              </span>
                              {schema.owner_team || "Unassigned"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
        
                  <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
                    <p className="text-xs text-slate-500">
                      {loading
                        ? "Loading..."
                        : `Showing ${filteredSchemas.length} of ${schemas.length} schemas`}
                    </p>
                    <button
                      onClick={() => void loadSchemas()}
                      disabled={loading}
                      aria-label="Refresh schemas"
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                    >
                      <RefreshCw size={14} />
                      Refresh
                    </button>
                  </div>
                </section>
              </div>
        
              {modalOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
                  onMouseDown={(event) => {
                    if (event.target === event.currentTarget && !saving) {
                      setModalOpen(false);
                    }
                  }}
                >
                  <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="schema-modal-title"
                    className="my-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
                  >
                    <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
                      <div>
                        <h2
                          id="schema-modal-title"
                          className="text-lg font-semibold text-slate-900"
                        >
                          Add schema
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Register schema metadata in this catalog.
                        </p>
                      </div>
                      <button
                        onClick={() => setModalOpen(false)}
                        disabled={saving}
                        aria-label="Close dialog"
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
        
                    <form onSubmit={handleCreate} className="space-y-4 p-5 sm:p-6">
                      <div>
                        <label
                          htmlFor="schema-name"
                          className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                          Schema name *
                        </label>
                        <input
                          id="schema-name"
                          required
                          maxLength={120}
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          placeholder="e.g. loan_application"
                          className={inputClass}
                        />
                        <p className="mt-1.5 text-xs text-slate-400">
                          Use the technical name that your team recognizes.
                        </p>
                      </div>
        
                      <div>
                        <label
                          htmlFor="schema-display-name"
                          className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                          Display name
                        </label>
                        <input
                          id="schema-display-name"
                          maxLength={180}
                          value={displayName}
                          onChange={(event) => setDisplayName(event.target.value)}
                          placeholder="e.g. Loan Applications"
                          className={inputClass}
                        />
                      </div>
        
                      <div>
                        <label
                          htmlFor="schema-description"
                          className="mb-1.5 block text-sm font-medium text-slate-700"
                        >
                          Description
                        </label>
                        <textarea
                          id="schema-description"
                          rows={3}
                          value={description}
                          onChange={(event) => setDescription(event.target.value)}
                          placeholder="What kind of data does this schema contain?"
                          className={`${inputClass} resize-y`}
                        />
                      </div>
        
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="schema-environment"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                          >
                            Environment *
                          </label>
                          <select
                            id="schema-environment"
                            value={environment}
                            onChange={(event) => setEnvironment(event.target.value)}
                            className={inputClass}
                          >
                            {environments.map((value) => (
                              <option key={value} value={value}>
                                {value.charAt(0).toUpperCase() + value.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
        
                        <div>
                          <label
                            htmlFor="schema-owner"
                            className="mb-1.5 block text-sm font-medium text-slate-700"
                          >
                            Owner team
                          </label>
                          <input
                            id="schema-owner"
                            maxLength={120}
                            value={ownerTeam}
                            onChange={(event) => setOwnerTeam(event.target.value)}
                            placeholder="Data Engineering"
                            className={inputClass}
                          />
                        </div>
                      </div>
        
                      {error && (
                        <p role="alert" className="text-sm text-red-600">
                          {error}
                        </p>
                      )}
        
                      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => setModalOpen(false)}
                          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                          Cancel
                        </button>
        
                        <button
                          type="submit"
                          disabled={saving || !name.trim()}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Create schema"}
                          {!saving && <Plus size={16} />}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ); 
    }