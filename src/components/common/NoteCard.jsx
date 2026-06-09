import React from "react";
import { Tag, Button, Space, Avatar } from "antd";
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

const NoteCard = ({ note, onDownload, downloadingId, extraActions }) => {
  const isDownloading = downloadingId === note._id;

  const getFileIcon = (type = "") => {
    const t = type.toLowerCase();
    if (t.includes("pdf")) return <FilePdfOutlined className="text-red-500" />;
    if (t.includes("word") || t.includes("doc")) return <FileWordOutlined className="text-blue-500" />;
    if (t.includes("excel") || t.includes("sheet")) return <FileExcelOutlined className="text-green-600" />;
    if (t.includes("image")) return <FileImageOutlined className="text-emerald-500" />;
    if (t.includes("zip") || t.includes("rar")) return <FileZipOutlined className="text-amber-500" />;
    if (t.includes("text") || t.includes("txt")) return <FileTextOutlined className="text-gray-500" />;
    return <FileUnknownOutlined className="text-gray-400" />;
  };

  return (
    <div
      key={note._id}
      className="group relative bg-white border border-gray-100 rounded-4xl shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col p-6 overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
            <span className="text-2xl flex items-center justify-center">
               {getFileIcon(note.fileType || note.fileExt)}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-800 line-clamp-1 uppercase tracking-tight">
              {note.title}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
              {note.fileExt || "Unknown"} • {note.category || "General"}
            </p>
          </div>
        </div>
        {note.isPrivate ? (
          <div className="p-2 bg-amber-50 rounded-lg">
             <LockOutlined className="text-amber-500 flex" title="Private" />
          </div>
        ) : (
          <div className="p-2 bg-indigo-50 rounded-lg">
             <ShareAltOutlined className="text-indigo-500 flex" title="Public" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-2">
           <Avatar size="small" src={note?.user?.image} icon={<UserOutlined />} className="bg-indigo-100" />
           <span className="text-xs font-bold text-gray-600">
             {note?.user?.firstName} {note?.user?.lastName}
           </span>
        </div>
        
        <div className="flex items-center gap-2">
           <Tag className="m-0 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border-none bg-indigo-50 text-indigo-600 rounded-lg">
              Section {note?.user?.section || "N/A"}
           </Tag>
           <Tag className="m-0 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border-none bg-emerald-50 text-emerald-600 rounded-lg">
              {note?.user?.semester || "4"}th Sem
           </Tag>
        </div>
      </div>

      {/* Action Area */}
      <div className="mt-auto flex flex-col gap-3">
        <Button
          type="primary"
          block
          icon={<DownloadOutlined />}
          loading={isDownloading}
          onClick={() => onDownload(note)}
          className="h-12 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 hover:shadow-indigo-200 border-none transition-all duration-300"
          style={{ backgroundColor: COLORS.primary }}
        >
          {isDownloading ? "Preparing..." : "Download Notes"}
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
