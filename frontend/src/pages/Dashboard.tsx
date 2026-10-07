import {
  ArrowRight,
  Database,
  GitBranch,
  Search,
  Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";

import AppShell from "../components/AppShell";
import { useAuthStore } from "../store/authStore";


export default function Dashboard() {

  const user = useAuthStore(
    (state) => state.user,
  );


  return (
    <AppShell>

      <div className="border-b border-slate-200 bg-white px-6 py-8 lg:px-8">

        <p className="text-sm font-medium text-slate-500">
          Workspace overview
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Discover enterprise metadata, understand table relationships,
          and use AI-assisted data discovery from one workspace.
        </p>

      </div>


      <div className="p-6 lg:p-8">

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          <FeatureCard
            icon={<Database size={20} />}
            title="Data Catalog"
            description="Browse catalogs, schemas, tables and columns."
            href="/catalog"
          />

          <FeatureCard
            icon={<Search size={20} />}
            title="Metadata Search"
            description="Find columns and tables across your data estate."
            href="/search"
          />

          <FeatureCard
            icon={<GitBranch size={20} />}
            title="Relationships"
            description="Understand how tables can be joined."
            href="/relationships"
          />

          <FeatureCard
            icon={<Sparkles size={20} />}
            title="AI Copilot"
            description="Ask questions about enterprise metadata."
            href="/copilot"
          />

        </div>


        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <h2 className="text-base font-semibold text-slate-900">
                Getting started
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Build your organization's metadata knowledge base.
              </p>

            </div>

          </div>


          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <Step
              number="01"
              title="Create a catalog"
              description="Define a business data domain."
            />

            <Step
              number="02"
              title="Add metadata"
              description="Document schemas, tables and columns."
            />

            <Step
              number="03"
              title="Document relationships"
              description="Capture how datasets can be joined."
            />

          </div>

        </div>

      </div>

    </AppShell>
  );
}


function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {

  return (
    <Link
      to={href}
      className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >

      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-slate-700">
        Open
        <ArrowRight
          size={14}
          className="transition group-hover:translate-x-0.5"
        />
      </div>

    </Link>
  );
}


function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {

  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">

      <span className="text-xs font-semibold text-slate-400">
        {number}
      </span>

      <h3 className="mt-2 text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  );
}