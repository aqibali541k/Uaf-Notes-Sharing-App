import React from "react";
import { Link, useLocation } from "react-router-dom";
import Seo from "../../../components/Seo";

const NotFound = () => {
  const { pathname } = useLocation();

  return (
    <div className="bg-slate-50">
      <Seo
        title="Page Not Found (404) | UAF Notes Sharing App"
        description="This page could not be found on UAF Notes Sharing App. Use the links on this page to get back to the shared UAF notes."
        path={pathname}
        noindex
      />

      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold tracking-wide text-brand-700">
          Error 404
        </p>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          This page could not be found
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-slate-500">
          The link may be broken or the page may have been moved. Head back to
          the shared notes, read more about the app, or sign in to your student
          account.
        </p>

        <nav
          aria-label="Helpful links"
          className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Browse public notes
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            About the app
          </Link>
          <Link
            to="/auth/login"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Student login
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default NotFound;
