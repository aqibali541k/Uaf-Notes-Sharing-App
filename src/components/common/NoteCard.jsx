import React from "react";
import { Avatar, Button } from "antd";
import {
  UserOutlined,
  FilePdfOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  LockOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  FileZipOutlined,
  FileImageOutlined,
  FileUnknownOutlined,
} from "@ant-design/icons";

const getFileIcon = (type = "") => {
  const t = type.toLowerCase();
  if (t.includes("pdf")) return <FilePdfOutlined className="text-red-500" />;
  if (t.includes("word") || t.includes("doc")) return <FileWordOutlined className="text-blue-600" />;
  if (t.includes("excel") || t.includes("sheet")) return <FileExcelOutlined className="text-emerald-600" />;
  if (t.includes("image")) return <FileImageOutlined className="text-sky-500" />;
  if (t.includes("zip") || t.includes("rar")) return <FileZipOutlined className="text-amber-500" />;
  if (t.includes("text") || t.includes("txt")) return <FileTextOutlined className="text-slate-500" />;
  return <FileUnknownOutlined className="text-slate-400" />;
};

const NoteCard = ({ note, onDownload, downloadingId, extraActions }) => {
  const isDownloading = downloadingId === note._id;

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-lg">
            {getFileIcon(note.fileType || note.fileExt)}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-800">
              {note.title}
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">
              {note.fileExt?.toUpperCase() || "File"} · {note.category || "General"}
            </p>
          </div>
        </div>

        {/* Privacy badge */}
        {note.isPrivate ? (
          <span className="flex shrink-0 items-center gap-1 rounded-md border border-amber-100 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
            <LockOutlined style={{ fontSize: 10 }} aria-hidden="true" /> Private
          </span>
        ) : (
          <span className="flex shrink-0 items-center gap-1 rounded-md border border-brand-100 bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
            <ShareAltOutlined style={{ fontSize: 10 }} aria-hidden="true" /> Public
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <Avatar
            size={20}
            src={note?.user?.image}
            alt={`${note?.user?.firstName || "Student"} profile picture`}
            icon={<UserOutlined />}
            className="bg-slate-100 text-slate-500"
          />
          <span className="text-xs text-slate-600">
            {note?.user?.firstName} {note?.user?.lastName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded border border-slate-100 bg-slate-50 px-2 py-0.5 text-xs text-slate-500">
            Sec {note?.user?.section || "N/A"}
          </span>
          <span className="rounded border border-slate-100 bg-slate-50 px-2 py-0.5 text-xs text-slate-500">
            Sem {note?.user?.semester || "?"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto flex flex-col gap-2">
        <Button
          type="primary"
          block
          icon={<DownloadOutlined />}
          loading={isDownloading}
          onClick={() => onDownload(note)}
          className="h-9 rounded-lg border-none text-sm font-medium"
        >
          {isDownloading ? "Preparing…" : "Download"}
        </Button>

        {extraActions && <div className="flex gap-2">{extraActions}</div>}
      </div>
    </article>
  );
};

export default NoteCard;
