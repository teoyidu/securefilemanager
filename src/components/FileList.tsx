// src/components/FileList.tsx
import React from 'react';
import { FileType, ConversionOption, ProcessStatus } from '../types';
import StyledDropdown from './StyledDropdown';

interface FileListProps {
  files: FileType[];
  onDeleteFile: (id: string) => void;
  onConvertTo: (id: string, option: ConversionOption | null) => void;
  showLess: boolean;
}

const FileList: React.FC<FileListProps> = ({
                                             files,
                                             onDeleteFile,
                                             onConvertTo,
                                             showLess
                                           }) => {
  const displayFiles = showLess ? files.slice(0, 5) : files;

  // Format file size
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format icon based on file type
// Updated renderFileIcon function in FileList.tsx
// In FileList.tsx, update the renderFileIcon function
    const renderFileIcon = (format: string) => {
        switch (format) {
            case 'docx':
                return (
                    <div className="w-6 h-6 mr-3 bg-blue-600 rounded flex items-center justify-center text-white text-xs">
                        <span className="font-mono font-bold">DOC</span>
                    </div>
                );
            case 'pdf':
                return (
                    <div className="w-6 h-6 mr-3 bg-red-500 rounded flex items-center justify-center text-white text-xs">
                        <span className="font-mono font-bold">PDF</span>
                    </div>
                );
            case 'xlsx':
                return (
                    <div className="w-6 h-6 mr-3 bg-green-500 rounded flex items-center justify-center text-white text-xs">
                        <span className="font-mono font-bold">XLS</span>
                    </div>
                );
            case 'image':
                return (
                    <div className="w-6 h-6 mr-3 bg-purple-500 rounded flex items-center justify-center text-white text-xs">
                        <span className="font-mono font-bold">IMG</span>
                    </div>
                );
            default:
                return (
                    <div className="w-6 h-6 mr-3 bg-gray-500 rounded flex items-center justify-center text-white text-xs">
                        <span className="font-mono font-bold">DOC</span>
                    </div>
                );
        }
    };

  return (
      <div className="rounded-md overflow-hidden">
          <div className="grid grid-cols-12 gap-2 text-sm text-gray-300 px-4 py-2">
              <div className="col-span-1">Format</div>
              <div className="col-span-4">File name</div>
              {files.some(f => f.status !== ProcessStatus.NotStarted) && (
                  <div className="col-span-3">Progress</div>
              )}
              <div className="col-span-2 text-right">Size</div>
              <div className="col-span-1 text-center">Delete</div>
              <div className="col-span-3 text-center">Convert to</div>
          </div>

          {displayFiles.map((file) => (
              <div
                  key={file.id}
                  className="grid grid-cols-12 gap-2 items-center bg-[#1e1e1e] mb-1 px-4 py-3 rounded-md"
              >
                  <div className="col-span-1 flex items-center">
                      {renderFileIcon(file.format)}
                  </div>

                  <div className="col-span-4 truncate">
                      {file.name}
                  </div>
                  // In FileList.tsx, update the progress indicator section
                  {file.status === ProcessStatus.InProgress && (
                      <div>
                          <div className="w-full bg-[#2d2d2d] rounded-full h-2 overflow-hidden">
                              <div
                                  className="bg-brand-500 h-2 rounded-full transition-all duration-300 ease-in-out"
                                  style={{ width: `${file.progress}%` }}
                              ></div>
                          </div>
                          <div className="flex justify-between mt-1">
                              <span className="text-xs text-gray-400">Processing...</span>
                              <span className="text-xs text-gray-400">{`${file.progress}%`}</span>
                          </div>
                      </div>
                  )}

                  {file.status === ProcessStatus.Completed && (
                      <div className="flex items-center">
                          <div className="w-full bg-brand-500 rounded-full h-2"></div>
                          <div className="flex items-center ml-2">
                              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                          </div>
                      </div>
                  )}

                  {file.status === ProcessStatus.NotStarted && (
                      <div className="text-gray-400 text-sm">Ready to process</div>

              )}

                  <div className="col-span-2 text-right">
                      {formatSize(file.size)}
                  </div>

                  <div className="col-span-1 flex justify-center">
                      {/* Delete button */}
                  </div>

                  <div className="col-span-3 flex justify-center">
                      {/* Conversion dropdown */}
                  </div>

              <div className="col-span-1 flex justify-center">
                <button
                    onClick={() => onDeleteFile(file.id)}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

                  // In FileList.tsx, replace the conversion dropdown section
                  <div className="col-span-3 flex justify-center">
                      <StyledDropdown
                          value={file.convertTo || 'None'}
                          onChange={(e) => {
                              const value = e.target.value as ConversionOption;
                              onConvertTo(file.id, value === 'None' ? null : value);
                          }}
                          options={[
                              { value: 'None', label: 'None' },
                              { value: 'PDF', label: 'PDF' },
                              ...(file.format === 'image' ? [
                                  { value: 'JPEG', label: 'JPEG' },
                                  { value: 'PNG', label: 'PNG' }
                              ] : []),
                              ...(file.format === 'docx' ? [
                                  { value: 'DOCX', label: 'DOCX' }
                              ] : []),
                              ...(file.format === 'xlsx' ? [
                                  { value: 'XLSX', label: 'XLSX' }
                              ] : [])
                          ]}
                          className="w-full"
                      />
                  </div>

              {files.some(f => f.convertTo !== null) && (
                  <div className="col-span-2 flex justify-center">
                      <div className="relative w-full">
                          <select
                              value={file.convertTo || 'None'}
                              onChange={(e) => {
                                  const value = e.target.value as ConversionOption;
                                  onConvertTo(file.id, value === 'None' ? null : value);
                              }}
                              className="appearance-none bg-[#2d2d2d] border border-[#3c3c3c] text-white py-1 px-3 pr-8 rounded w-full focus:outline-none focus:bg-[#3c3c3c] focus:border-brand-500"
                          >
                              <option value="None">None</option>
                              <option value="PDF">PDF</option>
                              {file.format === 'image' && (
                                  <>
                                      <option value="JPEG">JPEG</option>
                                      <option value="PNG">PNG</option>
                                  </>
                              )}

                        {file.format === 'docx' && (
                            <option value="DOCX">DOCX</option>
                        )}
                        {file.format === 'xlsx' && (
                            <option value="XLSX">XLSX</option>
                        )}
                      </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                      </div>
                    </div>
                  </div>
              )}
            </div>
        ))}
      </div>
  );
};

export default FileList;