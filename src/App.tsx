// src/App.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FileType, ActionType, ConversionOption, ProcessStatus } from './types';
import FileDropZone from './components/FileDropZone';
import FileList from './components/FileList';
import ActionPanel from './components/ActionPanel';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [actions, setActions] = useState<ActionType[]>([]);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [showLess, setShowLess] = useState<boolean>(false);
  const [processedFiles, setProcessedFiles] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    const size = files.reduce((total, file) => total + file.size, 0);
    setTotalSize(size);
  }, [files]);

  const handleFileDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => {
      // Determine file format based on extension
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      let format = '';

      if (['docx', 'doc'].includes(extension)) {
        format = 'docx';
      } else if (extension === 'pdf') {
        format = 'pdf';
      } else if (['xls', 'xlsx'].includes(extension)) {
        format = 'xlsx';
      } else if (['png', 'jpg', 'jpeg', 'gif'].includes(extension)) {
        format = 'image';
      } else {
        format = 'other';
      }

      return {
        id: `${file.name}-${Date.now()}`,
        name: file.name,
        size: file.size,
        format,
        file,
        convertTo: null,
        status: ProcessStatus.NotStarted,
        progress: 0
      };
    });

    setFiles([...files, ...newFiles]);
  };

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const handleConvertTo = (id: string, option: ConversionOption | null) => {
    setFiles(files.map(file =>
        file.id === id ? { ...file, convertTo: option } : file
    ));
  };

  const addAction = (action: ActionType) => {
    setActions([...actions, action]);
  };

  const deleteAction = (id: string) => {
    setActions(actions.filter(action => action.id !== id));
  };

  const toggleShowLess = () => {
    setShowLess(!showLess);
  };

  const processAndDownload = async () => {
    setIsProcessing(true);

    // Simulate processing files
    const totalFiles = files.length;
    for (let i = 0; i < totalFiles; i++) {
      setFiles(prevFiles =>
          prevFiles.map((file, index) =>
              index === i
                  ? { ...file, status: ProcessStatus.InProgress, progress: 0 }
                  : file
          )
      );

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prevFiles =>
            prevFiles.map((file, index) =>
                index === i
                    ? { ...file, progress }
                    : file
            )
        );
      }

      setFiles(prevFiles =>
          prevFiles.map((file, index) =>
              index === i
                  ? { ...file, status: ProcessStatus.Completed }
                  : file
          )
      );

      setProcessedFiles(i + 1);
    }

    // In a real app, you would actually process files according to the selected actions
    // and then generate download links or trigger downloads

    setIsProcessing(false);

    // Simulate download of processed files - in a real app you'd create actual file downloads
    alert('Files processed successfully! Download would start now in a real application.');
  };

  const saveActionSet = () => {
    // In a real app, this would save the current actions to local storage or IndexedDB
    alert('Action set saved successfully!');
  };

  return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <h1 className="text-2xl font-semibold text-center mb-2">Secure File Manager</h1>
          <p className="text-center text-sm mb-6">
            Our tool runs entirely on your device, keeping all actions local and your files private.
            <br />
            With no uploads or external servers, <span className="font-semibold">your data stays fully secure.</span>
          </p>

          <FileDropZone onFileDrop={handleFileDrop} />

          {files.length > 0 && (
              <div className="mt-4">
                <FileList
                    files={files}
                    onDeleteFile={handleDeleteFile}
                    onConvertTo={handleConvertTo}
                    showLess={showLess}
                />

                <div className="flex justify-between items-center text-xs text-gray-400 mt-2 mb-6">
                  <div>Total {files.length} files • Approximately {(totalSize / (1024 * 1024)).toFixed(2)} MB</div>
                  <button
                      className="flex items-center text-gray-400 hover:text-gray-300"
                      onClick={toggleShowLess}
                  >
                    {showLess ? 'SHOW ALL' : 'SHOW LESS'}
                    <svg className={`ml-1 w-4 h-4 transform ${showLess ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                </div>

                <ActionPanel
                    actions={actions}
                    onAddAction={addAction}
                    onDeleteAction={deleteAction}
                />

                <div className="flex items-center justify-between mt-8">
                  <button
                      className="flex items-center text-indigo-400 text-sm"
                      onClick={saveActionSet}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save this action set
                  </button>

                  <button
                      className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded"
                      onClick={processAndDownload}
                      disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Process & Download'}
                  </button>
                </div>

                {processedFiles > 0 && (
                    <div className="text-xs text-gray-400 mt-2 text-right">
                      Total {processedFiles} files • Approximately {(totalSize / (1024 * 1024)).toFixed(2)} MB
                    </div>
                )}
              </div>
          )}
        </div>
      </div>
  );
};

export default App;
