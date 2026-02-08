import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../../Dashboard/pages/SearchBar";
import { Tag, Spin, Button } from "antd";
import {
  UserOutlined,
  FilePdfOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useAuthContext } from "../../../context/AuthContext";

const categories = [
  "Statistics",
  "Cs-412",
  "Database",
  "Dsa",
  "Virtual Programming",
  "Enterpreneurship",
  "Announcements",
];

const Public = () => {
  const { token } = useAuthContext();
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= FETCH PUBLIC NOTES =================
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/notes/public`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // ⚠️ backend se array aa rahi ho to safe handling
        setNotes(res.data.notes || res.data || []);
      } catch (err) {
        console.error("Error fetching public notes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [token]);

  // ================= SEARCH FILTER =================
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ================= SECTION FILTER (FROM USER PROFILE) =================
  const sectionANotes = filteredNotes.filter(
    (note) => note.user?.section === "A",
  );

  const sectionBNotes = filteredNotes.filter(
    (note) => note.user?.section === "B",
  );

  // ================= CATEGORY GROUP =================
  const groupByCategory = (notesArr) =>
    categories.map((cat) => ({
      category: cat,
      notes: notesArr.filter((note) => note.category === cat),
    }));

  // ================= NOTE CARD =================
  const renderNoteCard = (note) => (
    <div
      key={note._id}
      className="relative bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-500 to-pink-500 rounded-t-2xl" />

      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <FilePdfOutlined className="text-red-500" />
        {note.title}
      </h3>

      <div className="mt-auto flex justify-end">
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          className="bg-linear-to-r from-purple-500 to-pink-500 border-none text-white"
          onClick={() => {
            const link = document.createElement("a");
            link.href = note.pdfUrl;
            link.download = `${note.title}.pdf`;
            link.click();
          }}
        >
          Download
        </Button>
      </div>

      <div className="flex items-center gap-2 text-xs mt-4 text-gray-500">
        <UserOutlined className="text-purple-500" />
        Created by {note.user?.firstName} {note.user?.lastName}
        <span className="ml-auto font-semibold text-purple-600">
          Section {note.user?.section}
        </span>
      </div>

      {(note.sharedWith || []).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {note.sharedWith.map((u) => (
            <Tag key={u._id} color="purple" className="text-xs">
              {u.firstName} {u.lastName}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-16">
      {/* ================= SEARCH BAR ================= */}
      <div className="flex justify-center mb-12">
        <SearchBar onSearch={setSearchTerm} />
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* ================= SECTION A ================= */}
          {sectionANotes.length > 0 && (
            <div className="mb-28">
              <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-12">
                Section A Notes
              </h1>

              {groupByCategory(sectionANotes).map(
                ({ category, notes }) =>
                  notes.length > 0 && (
                    <div key={category} className="mb-20">
                      <div className="flex flex-col items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">
                          {category}
                        </h2>
                        <div className="w-24 h-1 mt-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-full" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {notes.map(renderNoteCard)}
                      </div>
                    </div>
                  ),
              )}
            </div>
          )}

          {/* ================= SECTION B ================= */}
          {sectionBNotes.length > 0 && (
            <div>
              <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-12">
                Section B Notes
              </h1>

              {groupByCategory(sectionBNotes).map(
                ({ category, notes }) =>
                  notes.length > 0 && (
                    <div key={category} className="mb-20">
                      <div className="flex flex-col items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">
                          {category}
                        </h2>
                        <div className="w-24 h-1 mt-2 bg-linear-to-r from-pink-500 to-purple-500 rounded-full" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {notes.map(renderNoteCard)}
                      </div>
                    </div>
                  ),
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Public;
