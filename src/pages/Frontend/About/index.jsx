import React from "react";
import { Link } from "react-router-dom";
import Seo from "../../../components/Seo";
import { SITE_URL } from "../../../constants";

const ABOUT_TITLE = "About UAF Notes Sharing App";
const ABOUT_DESCRIPTION =
  "Learn what UAF Notes Sharing App does, which UAF subjects it covers, who can create an account, and how University of Agriculture Faisalabad students share notes.";

/* Module scope keeps the object identity stable for the Seo effect. */
const ABOUT_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${SITE_URL}/about#page`,
      url: `${SITE_URL}/about`,
      name: ABOUT_TITLE,
      description: ABOUT_DESCRIPTION,
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#webapp` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/about#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: `${SITE_URL}/about`,
        },
      ],
    },
  ],
};

const COURSE_CATEGORIES = [
  "Stat-402",
  "Cs-406",
  "Cs-408",
  "Cs-410",
  "Cs-412",
  "Bms-402",
  "Is-402",
];

const FEATURES = [
  "Create a note from any file on your device and give it a title and a course category.",
  "Choose the privacy of every note: public for the whole app, shared with specific classmates, or private to you.",
  "Find notes quickly with the search bar, or browse them grouped by section and course code.",
  "Download any note you are allowed to see straight to your device.",
];

const linkClass = "font-medium text-brand-600 hover:text-brand-700 hover:underline";
const headingClass = "mt-10 mb-3 text-xl font-semibold text-slate-900";

const About = () => {
  return (
    <div className="bg-slate-50">
      <Seo
        title={`${ABOUT_TITLE} | University of Agriculture Faisalabad`}
        description={ABOUT_DESCRIPTION}
        path="/about"
        structuredData={ABOUT_STRUCTURED_DATA}
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="transition-colors hover:text-brand-600">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="font-medium text-slate-800" aria-current="page">
                About
              </span>
            </li>
          </ol>
        </nav>

        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 sm:px-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            About UAF Notes Sharing App
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            UAF Notes Sharing App is a free web app where University of
            Agriculture Faisalabad students keep their course notes in one
            place. Instead of passing files around in chat groups, students
            upload a note once and decide exactly who is allowed to see it.
          </p>

          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-base font-semibold text-amber-900">
              An independent student project
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-amber-900/90">
              This app is built and maintained by a UAF student. It is not an
              official website of the University of Agriculture Faisalabad and
              it is not affiliated with or endorsed by the university.
            </p>
          </div>

          <section>
            <h2 className={headingClass}>What students can do in the app</h2>
            <ul className="space-y-3 text-slate-600">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600"
                  />
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className={headingClass}>Which subjects are covered</h2>
            <p className="mb-5 leading-relaxed text-slate-600">
              Notes are organised under the course codes used in the current
              semester, plus an <strong className="font-semibold">Announcements</strong>{" "}
              category for general updates. The categories available right now
              are:
            </p>
            <ul className="flex flex-wrap gap-2">
              {COURSE_CATEGORIES.map((course) => (
                <li
                  key={course}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
                >
                  {course}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-slate-500">
              You can see which of these have notes right now on the{" "}
              <Link to="/" className={linkClass}>
                shared notes page
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className={headingClass}>Who the app is for</h2>
            <p className="leading-relaxed text-slate-600">
              The app is made for UAF students who want a single place for their
              study material. Registration currently accepts the 2024 intake of
              the BSSE programme, in sections A and B, and every new account is
              verified against the student AG number during sign-up. Students
              from other batches can still read the notes that are shared
              publicly.
            </p>
          </section>

          <section>
            <h2 className={headingClass}>How to get started</h2>
            <ol className="list-inside list-decimal space-y-3 leading-relaxed text-slate-600">
              <li>
                Register with your student details and AG number on the{" "}
                <Link to="/auth/register" className={linkClass}>
                  account registration page
                </Link>
                .
              </li>
              <li>
                Sign in to open your dashboard, where you can create notes,
                review your own uploads and see the notes shared with you.
              </li>
              <li>
                Browse the notes on the{" "}
                <Link to="/" className={linkClass}>
                  public notes page
                </Link>{" "}
                and download whatever you need for your semester.
              </li>
            </ol>
          </section>

          <section>
            <h2 className={headingClass}>
              Who built it and how to give feedback
            </h2>
            <p className="leading-relaxed text-slate-600">
              The app is designed and developed by Aqib Shabbir, a UAF student,
              as a project to make notes easier to share within a class. If you
              find a wrong note, a broken download or have an idea for the app,
              get in touch on{" "}
              <a
                href="https://wa.me/923078244507"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                WhatsApp
              </a>
              ,{" "}
              <a
                href="https://www.linkedin.com/in/aqib-shabbir-62a16a345"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                LinkedIn
              </a>{" "}
              or{" "}
              <a
                href="https://facebook.com/AqibShabbir"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Facebook
              </a>
              . More common questions are answered on the{" "}
              <Link to="/faq" className={linkClass}>
                FAQ page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
