import React from "react";
import { useDropzone, Accept } from "react-dropzone";

interface FileUploaderProps {
  onFile: (file: File) => void;
  disabled?: boolean;
  label?: string; // fallback default label
  translations?: Record<string, string>;
  accept?: Accept;
  multiple?: boolean;
  className?: string;
}

export function FileUploader({
  onFile,
  disabled = false,
  label = "Upload file",
  translations = {},
  accept = { "image/*": [] },
  multiple = false,
  className = "",
}: FileUploaderProps) {
  const [selectedFileNames, setSelectedFileNames] = React.useState<string[]>(
    [],
  );

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      setSelectedFileNames(acceptedFiles.map((f) => f.name));
      if (multiple) {
        acceptedFiles.forEach((f) => onFile(f));
      } else {
        onFile(acceptedFiles[0]);
      }
    },
    [onFile, multiple],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    accept: accept || undefined,
    multiple,
  });

  const labelText =
    translations["builder.images.upload_label"] || label || "Upload file";
  const dropText =
    translations["builder.images.drop_here"] || "Drop file here…";
  const clickOrDragText =
    translations["builder.images.click_or_drag"] || "Click or drag & drop.";
  const selectedFilesText =
    translations["builder.images.selected_files"] || "Selected files:";

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-4 cursor-pointer bg-white flex flex-col items-center transition ${
        isDragActive ? "border-blue-600 bg-blue-50" : "border-gray-300"
      } ${disabled ? "opacity-40 pointer-events-none" : ""} ${className}`}
      aria-disabled={disabled}
      aria-labelledby="file-uploader-label"
    >
      <input {...getInputProps()} />
      <div id="file-uploader-label" className="text-sm font-medium mb-2">
        {labelText}
      </div>
      <div className="text-xs text-gray-500 mb-2">
        {isDragActive ? dropText : clickOrDragText}
      </div>
      {selectedFileNames.length > 0 && (
        <div className="text-xs text-blue-700 mt-2">
          {selectedFilesText} {selectedFileNames.join(", ")}
        </div>
      )}
    </div>
  );
}

export default FileUploader;
