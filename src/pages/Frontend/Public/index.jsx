import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../../Dashboard/pages/SearchBar";
import { message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useAuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { API_URL, CATEGORIES, SITE_URL } from "../../../constants";
import NoteCard from "../../../components/common/NoteCard";
import LoadingSkeleton from "../../../components/common/LoadingSkeleton";
import Seo from "../../../components/Seo";

/* Homepage structured data. Kept at module scope so the object identity
 * stays stable between renders (it is used in the effect dependencies). */
const HOME_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/#home`,
  name: "UAF Notes Sharing App",
  url: `${SITE_URL}/`,
  description:
    "Public collection of course notes shared by University of Agriculture Faisalabad students, grouped by section and subject.",
  inLanguage: "en",
  isPartOf: { "@id": `${SITE_URL}/#website` },
};

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const Public = () => {
  const { token } = useAuthContext();

  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        /* Guest friendly: the auth token is only attached when a student
         * is signed in, so the public notes list can also render for
         * visitors and search-engine crawlers. */
        const res = await axios.get(`${API_URL}/notes/public`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        let notesData = [];
        if (Array.isArray(res.data)) {
          notesData = res.data;
        } else if (res.data?.notes && Array.isArray(res.data.notes)) {
          notesData = res.data.notes;
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          notesData = res.data.data;
        }

        setNotes(notesData);
        setNeedsSignIn(false);
      } catch (error) {
        const status = error.response?.status;

        /* If this deployment still protects the route with a session,
         * show a sign-in prompt instead of an empty page. */
        if (status === 401 || status === 403) {
          setNeedsSignIn(true);
        } else {
          console.error("Error fetching public notes:", error);
          message.error("Failed to load notes");
        }

        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [token]);

  const filteredNotes = notes.filter((note) =>
    note?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sectionANotes = filteredNotes.filter(
    (note) => note?.user?.section === "A"
  );
  const sectionBNotes = filteredNotes.filter(
    (note) => note?.user?.section === "B"
  );

  const groupByCategory = (notesArr) =>
    CATEGORIES.map((cat) => ({
      category: cat,
      notes: notesArr.filter((note) => note?.category === cat),
    }));

  const handleDownload = async (note) => {
    try {
      setDownloadingId(note._id);
      const response = await axios.get(note.fileUrl, { responseType: "blob" });
      const blob = new Blob([response.data], {
        type: note.fileType || response.data.type,
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${note.title || "note"}.${note.fileExt || note.fileUrl?.split(".").pop() || "pdf"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success("Download Started");
    } catch (error) {
      console.error(error);
      message.error("Download failed");
    } finally {
      setDownloadingId(null);
    }
  };

  const renderSection = (title, notesArr, accentBar) => {
    const headingId = `${slugify(title)}-heading`;

    return (
      <section key={headingId} aria-labelledby={headingId} className="mb-16">
        <div className="mb-8 flex items-center gap-3">
          <span
            className={`h-6 w-1 rounded-full ${accentBar}`}
            aria-hidden="true"
          />
          <h2
            id={headingId}
            className="text-2xl font-bold tracking-tight text-slate-900"
          >
            {title}
          </h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
            {notesArr.length} notes
          </span>
        </div>

        {groupByCategory(notesArr).map(
          ({ category, notes }) =>
            notes.length > 0 && (
              <div key={category} className="mb-12 last:mb-0">
                <div className="mb-6 flex items-center gap-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {category}
                  </h3>
                  <span
                    className="h-px flex-1 bg-slate-200"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-medium text-slate-400">
                    {notes.length} notes
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {notes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onDownload={handleDownload}
                      downloadingId={downloadingId}
                    />
                  ))}
                </div>
              </div>
            )
        )}
      </section>
    );
  };

  return (
    <div className="bg-slate-50">
      <Seo
        title="UAF Notes Sharing App | University of Agriculture Faisalabad"
        description="UAF Notes Sharing App lets University of Agriculture Faisalabad students share, browse and download course notes securely by subject and section."
        path="/"
        structuredData={HOME_STRUCTURED_DATA}
      />

      {/* Hero */}
      <section
        aria-labelledby="home-heading"
        className="border-b border-slate-200 bg-white py-14 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1
              id="home-heading"
              className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl"
            >
              UAF Notes <span className="text-brand-600">Sharing App</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
              Browse course notes shared by University of Agriculture
              Faisalabad students. Search by subject and section, then download
              the notes you need for your semester.
            </p>
            <div className="mx-auto mt-8 max-w-xl">
              <SearchBar onSearch={setSearchTerm} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <div role="status" aria-live="polite">
            <span className="sr-only">Loading shared notes…</span>
            <LoadingSkeleton count={6} />
          </div>
        ) : needsSignIn ? (
          <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
            <div
              className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600"
              aria-hidden="true"
            >
              <SearchOutlined className="text-lg" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Sign in to browse the shared notes
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Notes are shared between registered UAF students. Sign in with
              your student account, or create a free one, to open the notes
              library.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/auth/login"
                className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                Student login
              </Link>
              <Link
                to="/auth/register"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Create a free account
              </Link>
            </div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="py-20 text-center">
            <div
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400"
              aria-hidden="true"
            >
              <SearchOutlined className="text-xl" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">
              No notes found
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Try adjusting your search or check back later.
            </p>
          </div>
        ) : (
          <>
            {sectionANotes.length > 0 &&
              renderSection("Section A Notes", sectionANotes, "bg-brand-600")}
            {sectionBNotes.length > 0 &&
              renderSection("Section B Notes", sectionBNotes, "bg-teal-600")}
          </>
        )}
      </div>
    </div>
  );
};

export default Public;
