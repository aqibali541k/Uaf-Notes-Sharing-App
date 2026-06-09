import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../../Dashboard/pages/SearchBar";
import { Spin, message } from "antd";
import { useAuthContext } from "../../../context/AuthContext";
import { API_URL, CATEGORIES } from "../../../constants";
import NoteCard from "../../../components/common/NoteCard";
import LoadingSkeleton from "../../../components/common/LoadingSkeleton";

const Public = () => {
  const { token } = useAuthContext();

  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/notes/public`, {
          headers: { Authorization: `Bearer ${token}` },
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
      } catch (error) {
        console.error("Error fetching public notes:", error);
        setNotes([]);
        message.error("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchNotes();
    }
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

  const renderSection = (title, notesArr, accentColor) => (
    <div className="mb-24">
      <div className="text-center mb-16">
        <h2 className={`text-4xl font-extrabold ${accentColor} mb-4 tracking-tight`}>
          {title}
        </h2>
        <div className={`w-20 h-1.5 mx-auto bg-current opacity-20 rounded-full`} />
      </div>

      {groupByCategory(notesArr).map(
        ({ category, notes }) =>
          notes.length > 0 && (
            <div key={category} className="mb-20 last:mb-0">
              <div className="flex items-center gap-4 mb-10">
                <h3 className="text-2xl font-bold text-gray-800 shrink-0">
                  {category}
                </h3>
                <div className="h-px bg-gray-200 w-full" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  {notes.length} Notes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Knowledge <span className="text-indigo-600">Shared</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-10">
            Access high-quality university notes shared by your peers. Search, browse, and download resources instantly.
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar onSearch={setSearchTerm} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="py-20">
            <LoadingSkeleton count={6} />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-40">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No notes found</h3>
            <p className="text-gray-500">Try adjusting your search or check back later.</p>
          </div>
        ) : (
          <>
            {sectionANotes.length > 0 && renderSection("Section A Notes", sectionANotes, "text-indigo-600")}
            {sectionBNotes.length > 0 && renderSection("Section B Notes", sectionBNotes, "text-emerald-600")}
          </>
        )}
      </div>
    </div>
  );
};

export default Public;