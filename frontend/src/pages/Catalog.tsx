import {
  Database,
  Plus,
  Search,
  Server,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";


import { useEffect, useState } from "react";

import api from "../api/axios";
import { useAuthStore } from "../store/authStore";

interface Catalog {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  environment: string;
  owner_team: string | null;
}


export default function Catalog() {
  const accessToken = useAuthStore((state) => state.accessToken,);

  const [catalogs, setCatalogs] =
    useState<Catalog[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [showCreate, setShowCreate] =
    useState(false);


  const loadCatalogs = async () => {

    try {

      const response =
        await api.get<Catalog[]>(
          "/catalogs",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

      setCatalogs(response.data);

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    if (accessToken) {
      loadCatalogs()
    }
  }, [accessToken]);


  const filteredCatalogs =
    catalogs.filter((catalog) =>
      `${catalog.name} ${catalog.display_name}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );


  return (
    <div className="min-h-screen">

      <header className="border-b border-slate-200 bg-white">

        <div className="flex items-center justify-between px-6 py-5 lg:px-8">

          <div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Workspace</span>
              <span>/</span>
              <span>Data Catalog</span>
            </div>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              Data Catalog
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Discover and manage enterprise data metadata.
            </p>

          </div>


          <button
            onClick={() =>
              setShowCreate(true)
            }
            className="hidden items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 sm:flex"
          >
            <Plus size={17} />
            Add Catalog
          </button>

        </div>

      </header>


      <div className="p-6 lg:p-8">

        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          <StatCard
            label="Catalogs"
            value={catalogs.length}
            icon={<Database size={19} />}
          />

          <StatCard
            label="Environments"
            value={
              new Set(
                catalogs.map(
                  (catalog) =>
                    catalog.environment,
                ),
              ).size
            }
            icon={<Server size={19} />}
          />

          <StatCard
            label="Owner Teams"
            value={
              new Set(
                catalogs
                  .map(
                    (catalog) =>
                      catalog.owner_team,
                  )
                  .filter(Boolean),
              ).size
            }
            icon={<Database size={19} />}
          />

        </div>


        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Catalogs
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Data domains available in your workspace.
              </p>
            </div>


            <div className="relative w-full sm:w-72">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search catalogs..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
              />

            </div>

          </div>


          {loading ? (

            <div className="space-y-3 p-5">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-lg bg-slate-100"
                />
              ))}

            </div>

          ) : filteredCatalogs.length === 0 ? (

            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <Database size={22} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                No catalogs found
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Create your first data catalog to start documenting schemas, tables, and columns.
              </p>

              <button
                onClick={() =>
                  setShowCreate(true)
                }
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                <Plus size={16} />
                Add Catalog
              </button>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {filteredCatalogs.map(
                (catalog) => (

                  <div
                    key={catalog.id}
                    className="group flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                  >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <Database size={19} />
                    </div>


                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="text-sm font-semibold text-slate-900">
                          {catalog.display_name}
                        </h3>

                        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-600">
                          {catalog.name}
                        </span>

                      </div>

                      <p className="mt-1 truncate text-sm text-slate-500">
                        {catalog.description ||
                          "No description provided."}
                      </p>

                    </div>


                    <div className="hidden text-right sm:block">

                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium capitalize text-emerald-700">
                        {catalog.environment}
                      </span>

                      <p className="mt-1 text-xs text-slate-400">
                        {catalog.owner_team ||
                          "No owner"}
                      </p>
                    </div>
                    
                    <Link
                      to={`/catalogs/${catalog.id}/schemas`}
                      className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-indigo-600 transition hover:border-indigo-200 hover:bg-indigo-50"
                    >
                      Explore schemas
                      <ArrowRight size={16} />
                    </Link>
                  </div>

                ),
              )}

            </div>

          )}

        </div>

      </div>


      {showCreate && (
        <CreateCatalogModal
          onClose={() =>
            setShowCreate(false)
          }
          onCreated={() => {
            setShowCreate(false);
            loadCatalogs();
          }}
        />
      )}

    </div>
  );
}


function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          {icon}
        </div>

      </div>

      <p className="mt-4 text-2xl font-semibold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {label}
      </p>

    </div>
  );
}


function CreateCatalogModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {

  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [environment, setEnvironment] = useState("development");
  const [ownerTeam, setOwnerTeam] = useState("");

  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);

  const accessToken = useAuthStore((state) => state.accessToken)

  const submit = async (
    event: React.FormEvent,
  ) => {

    event.preventDefault();

    setError("");
    setSaving(true);

    try {

      await api.post(
        "/catalogs", 
        {
          name,
          display_name: displayName,
          description: description || null,
          environment,
          owner_team: ownerTeam || null,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      onCreated();

    } catch (error: any) {

      setError(
        error?.response?.data?.detail ||
        "Unable to create catalog.",
      );

    } finally {

      setSaving(false);

    }

  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Create catalog
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Define a data domain for your organization.
          </p>

        </div>


        <form
          onSubmit={submit}
          className="space-y-5 p-6"
        >

          <Field
            label="Catalog name"
            placeholder="lending"
            value={name}
            onChange={setName}
            required
          />

          <Field
            label="Display name"
            placeholder="Lending Data"
            value={displayName}
            onChange={setDisplayName}
            required
          />


          <div>

            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              rows={3}
              placeholder="Describe the purpose and scope of this catalog..."
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
            />

          </div>


          <div className="grid gap-4 sm:grid-cols-2">

            <div>

              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Environment
              </label>

              <select
                value={environment}
                onChange={(event) =>
                  setEnvironment(
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              >
                <option value="development">
                  Development
                </option>

                <option value="staging">
                  Staging
                </option>

                <option value="production">
                  Production
                </option>

              </select>

            </div>


            <Field
              label="Owner team"
              placeholder="Data Engineering"
              value={ownerTeam}
              onChange={setOwnerTeam}
            />

          </div>


          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}


          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving
                ? "Creating..."
                : "Create catalog"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}


function Field({
  label,
  placeholder,
  value,
  onChange,
  required = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {

  return (
    <div>

      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
      />

    </div>
  );
}