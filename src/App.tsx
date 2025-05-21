// src/App.tsx
import React, { useState, useEffect } from 'react';
import FileDropZone from './components/FileDropZone';
import FileList from './components/FileList';
import ActionPanel from './components/ActionPanel';
import Footer from './components/Footer';
import FilePreview from './components/FilePreview';
import ProcessingStatus from './components/ProcessingStatus';
import ProcessingSummary from './components/ProcessingSummary';
import SavedActionSets from './components/SavedActionSets';
import ResponsiveLayout from './components/ResponsiveLayout';
import Header from './components/Header';
import { useApp, useFiles, useActions } from './context';
import { storageService } from './services/localStorage';
import { ActionOptionType, ProcessStatus } from './types';

// Add imports for client-side processing
import imageCompression from 'browser-image-compression';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph } from 'docx';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const App: React.FC = () => {
  // Use our context hooks
  const {
    appState,
    startProcessing,
    setProcessingState,
    setProcessingProgress,
    finishProcessing,
    setPreviewFile,
    toggleShowLess
  } = useApp();

  const { files, totalSize, processedFiles, addFiles, deleteFile, setFileConversion, updateFileStatus, updateAllFileStatuses } = useFiles();

  const { actions, addAction, deleteAction } = useActions();

  // Local state
  const [processingTime, setProcessingTime] = useState<number>(0);
  const [processingStartTime, setProcessingStartTime] = useState<number | null>(null);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [processingSuccess, setProcessingSuccess] = useState<boolean>(true);
  const [processingError, setProcessingError] = useState<string | undefined>(undefined);
  const [showActionSets, setShowActionSets] = useState<boolean>(false);

  // Timer for processing time
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (appState.isProcessing && processingStartTime) {
      timer = setInterval(() => {
        const elapsed = (Date.now() - processingStartTime) / 1000;
        setProcessingTime(elapsed);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [appState.isProcessing, processingStartTime]);

  // Save recent actions to localStorage when they change
  useEffect(() => {
    if (actions.length > 0) {
      storageService.saveRecentActions(actions);
    }
  }, [actions]);

  // Handle file drop
  const handleFileDrop = (acceptedFiles: File[]) => {
    console.log(`[App] File drop event received with ${acceptedFiles.length} files`);
    
    try {
      // Validate files
      acceptedFiles.forEach(file => {
        console.log(`[App] Validating file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
        
        // Check file size (e.g., max 100MB)
        if (file.size > 100 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Maximum size is 100MB.`);
        }
        
        // Check file type
        const extension = file.name.split('.').pop()?.toLowerCase();
        const allowedExtensions = ['docx', 'doc', 'pdf', 'xls', 'xlsx', 'png', 'jpg', 'jpeg', 'gif'];
        
        if (!extension || !allowedExtensions.includes(extension)) {
          throw new Error(`File ${file.name} has an unsupported format. Allowed formats: ${allowedExtensions.join(', ')}`);
        }
      });

      console.log('[App] All files validated successfully');
      addFiles(acceptedFiles);
      console.log('[App] Files added to context successfully');
    } catch (error) {
      console.error('[App] Error handling file drop:', error);
      alert(error instanceof Error ? error.message : 'An error occurred while processing the files');
    }
  };

  // Handle file preview
  const handlePreviewFile = (file: any) => {
    setPreviewFile(file);
  };

  // Close file preview
  const closePreview = () => {
    setPreviewFile(null);
  };

  // Process and download files (client-side only)
  const processAndDownload = async () => {
    console.log('[App] Starting file processing and download');
    
    if (files.length === 0) {
      console.warn('[App] No files to process');
      alert('Please add files to process');
      return;
    }

    try {
      startProcessing('Processing files...');
      setProcessingStartTime(Date.now());
      updateAllFileStatuses(ProcessStatus.InProgress, 0);
      console.log(`[App] Processing ${files.length} files`);

      const zip = new JSZip();
      console.log('[App] Created new ZIP archive');

      let totalProgress = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`[App] Processing file ${i + 1}/${files.length}: ${file.name}`);
        
        try {
          let processedBlob: Blob = file.file;
          let outputFileName = file.name;

          // Process the file based on conversion settings
          if (file.convertTo) {
            // Update progress to show conversion is happening
            updateFileStatus(file.id, ProcessStatus.InProgress, 50);
            setProcessingProgress((totalProgress + 50) / files.length);

            // Simulate file conversion (replace with actual conversion logic)
            await new Promise(resolve => setTimeout(resolve, 1000));
            processedBlob = file.file; // Replace with actual converted file
            outputFileName = `${file.name.split('.')[0]}.${file.convertTo}`;
          }

          // Add file to ZIP
          zip.file(outputFileName, processedBlob);
          console.log(`[App] Added processed file to ZIP: ${outputFileName}`);

          // Update progress
          totalProgress += 100;
          const overallProgress = (totalProgress / (files.length * 100)) * 100;
          updateFileStatus(file.id, ProcessStatus.Completed, 100);
          setProcessingProgress(overallProgress);
          console.log(`[App] Updated progress for ${file.name}: ${overallProgress.toFixed(2)}%`);

        } catch (error) {
          console.error(`[App] Error processing file ${file.name}:`, error);
          updateFileStatus(file.id, ProcessStatus.NotStarted, 0);
          throw error;
        }
      }

      console.log('[App] All files processed, generating ZIP archive');
      setProcessingState('processing', 'Generating ZIP archive...');
      const content = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9
        }
      });
      console.log('[App] ZIP archive generated, initiating download');
      
      saveAs(content, 'processed_files.zip');
      console.log('[App] Download initiated');

      finishProcessing(true);
      console.log('[App] Processing completed successfully');

    } catch (error) {
      console.error('[App] Error during file processing:', error);
      setProcessingError(error instanceof Error ? error.message : 'An error occurred during processing');
      finishProcessing(false);
    }
  };

  // Handle download after processing (not needed, handled above)
  const handleDownload = async () => {
    setShowSummary(false);
  };

  // Save action set
  const saveActionSet = async () => {
    if (actions.length === 0) {
      alert('Please add actions to save');
      return;
    }

    try {
      // Prompt user for a name for this action set
      const name = prompt('Enter a name for this action set:');
      if (!name) return; // User cancelled

      // Save the action set to localStorage
      storageService.saveActionSet(name, actions);
      alert('Action set saved successfully!');
    } catch (error) {
      console.error('Error saving action set:', error);
      alert('Failed to save action set. Please try again.');
    }
  };

  // Load saved action sets
  const loadActionSets = () => {
    setShowActionSets(true);
  };

  return (
      <div className="min-h-screen bg-main-dark text-white flex flex-col items-center justify-center py-10">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
          <Header onLoadActionSets={loadActionSets} />

          <FileDropZone onFileDrop={handleFileDrop} />

          {files.length > 0 && (
              <div className="mt-8 w-full">
                <FileList
                    files={files}
                    onDeleteFile={deleteFile}
                    onConvertTo={setFileConversion}
                    onPreviewFile={handlePreviewFile}
                    showLess={appState.showLess}
                />

                <div className="flex justify-between items-center text-xs text-gray-300 mt-2 mb-6">
                  <div>Total {files.length} files • Approximately {(totalSize / (1024 * 1024)).toFixed(2)} MB</div>
                  <button
                      className="flex items-center text-gray-300 hover:text-white"
                      onClick={toggleShowLess}
                  >
                    {appState.showLess ? 'SHOW ALL' : 'SHOW LESS'}
                    <svg className={`ml-1 w-4 h-4 transform ${appState.showLess ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                </div>

                <div className="divider"></div>

                <ActionPanel
                    actions={actions}
                    onAddAction={(type) => addAction(type as ActionOptionType)}
                    onDeleteAction={deleteAction}
                />

                <div className="divider"></div>

                <div className="flex items-center justify-between mt-6">
                  <div className="flex space-x-4">
                    <button
                        className="flex items-center text-brand-500 text-sm bg-[#232324] border border-brand-500/30 px-4 py-2 rounded-lg hover:bg-brand-500/10 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer transition font-medium shadow-sm"
                        onClick={saveActionSet}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Save this action set
                    </button>

                    <button
                        className="flex items-center text-brand-500 text-sm bg-[#232324] border border-brand-500/30 px-4 py-2 rounded-lg hover:bg-brand-500/10 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer transition font-medium shadow-sm"
                        onClick={loadActionSets}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Load saved actions
                    </button>
                  </div>

                  <button
                      className="bg-brand-500 hover:bg-brand-600 text-white py-2 px-6 rounded-lg text-lg font-semibold shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                      onClick={processAndDownload}
                      disabled={appState.isProcessing}
                  >
                    {appState.isProcessing ? 'Processing...' : 'Process & Download'}
                  </button>
                </div>

                {processedFiles > 0 && !appState.isProcessing && (
                    <div className="text-xs text-gray-300 mt-2 text-right">
                      {processedFiles} of {files.length} files processed • Approximately {(totalSize / (1024 * 1024)).toFixed(2)} MB
                    </div>
                )}
              </div>
          )}

          {/* File Preview Modal */}
          {appState.previewFile && (
              <FilePreview file={appState.previewFile} onClose={closePreview} />
          )}

          {/* Processing Status */}
          <ProcessingStatus />

          {/* Processing Summary Modal */}
          {showSummary && (
              <ProcessingSummary
                  isOpen={showSummary}
                  onClose={() => setShowSummary(false)}
                  onDownload={handleDownload}
                  processingTime={processingTime}
                  success={processingSuccess}
                  error={processingError}
              />
          )}

          {/* Saved Action Sets Modal */}
          <SavedActionSets
              isOpen={showActionSets}
              onClose={() => setShowActionSets(false)}
          />
        </div>
      </div>
  );
};

export default App;