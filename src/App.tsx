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

// In App.tsx, update the processAndDownload function
  const processAndDownload = async () => {
    setIsProcessing(true);
    setProcessedFiles(0);

    // Process files one by one
    for (let i = 0; i < files.length; i++) {
      // Mark current file as processing
      setFiles(prevFiles =>
          prevFiles.map((file, index) =>
              index === i
                  ? { ...file, status: ProcessStatus.InProgress, progress: 0 }
                  : file
          )
      );

      // Simulate different processing times based on file type
      const processingSteps = files[i].format === 'image' ? 5 :
          files[i].format === 'pdf' ? 10 : 8;

      // Process in steps with realistic timing
      for (let step = 1; step <= processingSteps; step++) {
        const progress = Math.floor((step / processingSteps) * 100);

        // Add random delay to simulate processing time (200-800ms per step)
        await new Promise(resolve =>
            setTimeout(resolve, Math.floor(Math.random() * 600) + 200)
        );

        // Update progress
        setFiles(prevFiles =>
            prevFiles.map((file, index) =>
                index === i
                    ? { ...file, progress }
                    : file
            )
        );
      }

      // Mark as complete
      setFiles(prevFiles =>
          prevFiles.map((file, index) =>
              index === i
                  ? { ...file, status: ProcessStatus.Completed, progress: 100 }
                  : file
          )
      );

      setProcessedFiles(i + 1);
    }

    setIsProcessing(false);

    // Show completion message
    setTimeout(() => {
      alert('All files processed successfully! Download would start now in a real application.');
    }, 500);
  };

  const
      saveActionSet = () => {
    // In a real app, this would save the current actions to local storage or IndexedDB
    alert('Action set saved successfully!');
  };

  return (
      <div className="flex flex-col min-h-screen items-start gap-6 px-4 sm:px-8 md:px-12 lg:px-16 py-6 md:py-app-y bg-main-dark text-white max-w-7xl mx-auto w-full">
        <div className="w-full">
          <h1 className="text-2xl font-semibold text-center mb-2">Secure File Manager</h1>
          <p className="text-center text-sm mb-6">
            Our tool runs entirely on your device, keeping all actions local and your files private.
            <br />
            With no uploads or external servers, <span className="font-semibold">your data stays fully secure.</span>
          </p>

          <FileDropZone onFileDrop={handleFileDrop} />

          {files.length > 0 && (
              <div className="mt-6">
                <FileList
                    files={files}
                    onDeleteFile={handleDeleteFile}
                    onConvertTo={handleConvertTo}
                    showLess={showLess}
                />

                <div className="flex justify-between items-center text-xs text-gray-300 mt-2 mb-6">
                  <div>Total {files.length} files • Approximately {(totalSize / (1024 * 1024)).toFixed(2)} MB</div>
                  <button
                      className="flex items-center text-gray-300 hover:text-white"
                      onClick={toggleShowLess}
                  >
                    {showLess ? 'SHOW ALL' : 'SHOW LESS'}
                    <svg className={`ml-1 w-4 h-4 transform ${showLess ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                </div>

                <div className="divider"></div>

                <ActionPanel
                    actions={actions}
                    onAddAction={addAction}
                    onDeleteAction={deleteAction}
                />

                <div className="divider"></div>

                <div className="flex items-center justify-between mt-6">
                  // In App.tsx, update the save action set button
                  <button
                      className="group flex items-center text-brand-500 hover:text-white transition-colors text-sm"
                      onClick={saveActionSet}
                  >
                    <div className="w-6 h-6 flex items-center justify-center rounded mr-2 bg-brand-500/10 group-hover:bg-brand-500 transition-colors">
                      <svg
                          className="w-4 h-4 text-brand-500 group-hover:text-white transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                    </div>
                    Save this action set
                  </button>

                  <button
                      className="bg-brand-500 hover:bg-brand-600 text-white py-2 px-6 rounded-md transition-colors"
                      onClick={processAndDownload}
                      disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Process & Download'}
                  </button>
                </div>

                {processedFiles > 0 && (
                    <div className="text-xs text-gray-300 mt-2 text-right">
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