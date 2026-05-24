"use client";

import { UploadCloud, X, File } from "lucide-react";
import { useState, useRef } from "react";

interface FileUploadProps {
  onFileSelect?: (file: File | null) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check file size (e.g. 10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit");
      return;
    }
    setSelectedFile(file);
    if (onFileSelect) onFileSelect(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div className="file-upload-wrapper">
      {!selectedFile ? (
        <div 
          className={`dropzone ${dragActive ? "drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            className="file-input"
            onChange={handleChange}
            accept="image/jpeg,image/png,application/pdf"
          />
          <div className="upload-content">
            <div className="upload-icon-wrapper">
              <UploadCloud size={24} />
            </div>
            <p className="upload-title">Choose a file or drag & drop it here</p>
            <p className="upload-subtitle">JPEG, PNG, upto 10MB</p>
            <button type="button" className="btn btn-outline browse-btn">
              Browse Files
            </button>
          </div>
        </div>
      ) : (
        <div className="file-preview">
          <div className="file-info">
            <File size={24} className="file-icon" />
            <div className="file-details">
              <p className="file-name">{selectedFile.name}</p>
              <p className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button type="button" className="remove-btn" onClick={removeFile}>
            <X size={18} />
          </button>
        </div>
      )}
      <p className="helper-text">Upload images of your preferred document/image</p>

      <style jsx>{`
        .file-upload-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .dropzone {
          border: 2px dashed var(--border-dashed);
          border-radius: var(--radius-lg);
          padding: 2.5rem 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background-color: var(--bg-white);
        }

        .dropzone:hover {
          background-color: var(--bg-hover);
          border-color: var(--border-focus);
        }

        .drag-active {
          background-color: rgba(34, 197, 94, 0.05);
          border-color: var(--brand-green);
        }

        .file-input {
          display: none;
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .upload-icon-wrapper {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .upload-title {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .upload-subtitle {
          color: var(--text-muted);
          font-size: 0.8rem;
          margin-bottom: 0.75rem;
        }

        .browse-btn {
          border-radius: var(--radius-full);
          padding: 0.5rem 1.5rem;
          font-weight: 600;
          pointer-events: none; /* Let parent handle click */
        }

        .file-preview {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          background-color: var(--bg-hover);
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .file-icon {
          color: var(--text-secondary);
        }

        .file-details {
          display: flex;
          flex-direction: column;
        }

        .file-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .file-size {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .remove-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .remove-btn:hover {
          background-color: var(--border-light);
          color: var(--error);
        }

        .helper-text {
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
