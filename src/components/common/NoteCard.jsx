import React from "react";
import { Tag, Button, Avatar } from "antd";
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
import { COLORS } from "../../constants";

const getFileIcon = (type = "") => {
  const t = type.toLowerCase();
  if (t.includes("pdf")) return <FilePdfOutlined className="text-red-500" />;
  if (t.includes("word") || t.includes("doc")) return <FileWordOutlined className="text-blue-600" />;
  if (t.includes("excel") || t.includes("sheet")) return <FileExcelOutlined className="text-emerald-600" />;
  if (t.includes("image")) return <FileImageOutlined className="text-sky-500" />;
  if (t.includes("zip") || t.includes("rar")) return <FileZipOutlined className="text-amber-500" />;
  if (t.includes("text") || t.includes("txt")) return <FileTextOutlined className="text-gray-500" />;
  return <FileUnknownOutlined className="text-gray-400" />;
};

const NoteCard = ({ note, onDownload, downloadingId, extraActions }) => {
  const isDownloading = downloadingId === note._id;

  return (
    <div className="bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200 flex flex-col p-5">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-lg text-lg">
            {getFileIcon(note.fileType || note.fileExt)}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
              {note.title}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {note.fileExt?.toUpperCase() || "File"} · {note.category || "General"}
            </p>
          </div>
        </div>

        {/* Privacy badge */}
        {note.isPrivate ? (
          <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
            <LockOutlined style={{ fontSize: 10 }} /> Private
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
            <ShareAltOutlined style={{ fontSize: 10 }} /> Public
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <Avatar size={20} src={note?.user?.image} icon={<UserOutlined />} className="bg-gray-100 text-gray-500" />
          <span className="text-xs text-gray-600">
            {note?.user?.firstName} {note?.user?.lastName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
            Sec {note?.user?.section || "N/A"}
          </span>
          <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
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
          className="h-9 rounded-lg text-sm font-medium border-none"
          style={{ backgroundColor: COLORS.primary }}
        >
          {isDownloading ? "Preparing…" : "Download"}
        </Button>

        {extraActions && (
          <div className="flex gap-2">
            {extraActions}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
