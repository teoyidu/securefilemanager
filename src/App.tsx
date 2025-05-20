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

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`[App] Processing file ${i + 1}/${files.length}: ${file.name}`);
        
        let processedBlob = file.file;

        try {
          // Example: process images
          if (file.format === 'image') {
            console.log(`[App] Compressing image: ${file.name}`);
            processedBlob = await imageCompression(file.file, { maxWidthOrHeight: 800, maxSizeMB: 1 });
            console.log(`[App] Image compressed successfully: ${file.name}`);
            zip.file(`processed_${file.name}`, processedBlob);
          }
          // Example: process PDFs (merge all PDFs into one if more than one)
          else if (file.format === 'pdf') {
            const pdfFiles = files.filter(f => f.format === 'pdf');
            console.log(`[App] Processing PDF file: ${file.name} (${pdfFiles.length} total PDF files)`);
            
            if (pdfFiles.length > 1 && i === 0) {
              console.log('[App] Merging multiple PDF files');
              const pdfDocs = await Promise.all(pdfFiles.map(async f => PDFDocument.load(await f.file.arrayBuffer())));
              const mergedPdf = await PDFDocument.create();
              for (const doc of pdfDocs) {
                const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
                copiedPages.forEach((page: any) => mergedPdf.addPage(page));
              }
              const mergedPdfBytes = await mergedPdf.save();
              zip.file('merged.pdf', mergedPdfBytes);
              console.log('[App] PDF files merged successfully');
            } else if (pdfFiles.length === 1) {
              zip.file(file.name, file.file);
              console.log('[App] Single PDF file added to ZIP');
            }
          }
          // Example: process Excel files (convert to CSV)
          else if (file.format === 'xlsx') {
            console.log(`[App] Converting Excel file to CSV: ${file.name}`);
            const data = await file.file.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
            zip.file(file.name.replace(/\.xlsx?$/, '.csv'), csv);
            console.log(`[App] Excel file converted to CSV: ${file.name}`);
          }
          // Default: just add the file as-is
          else {
            console.log(`[App] Adding file as-is: ${file.name}`);
            zip.file(file.name, file.file);
          }

          // Update progress
          const progress = ((i + 1) / files.length) * 100;
          updateFileStatus(file.id, ProcessStatus.InProgress, progress);
          console.log(`[App] Updated progress for ${file.name}: ${progress.toFixed(2)}%`);

        } catch (error) {
          console.error(`[App] Error processing file ${file.name}:`, error);
          updateFileStatus(file.id, ProcessStatus.NotStarted, 0);
          throw error;
        }
      }

      console.log('[App] All files processed, generating ZIP archive');
      const content = await zip.generateAsync({ type: 'blob' });
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
      <div className="flex flex-col min-h-screen items-start gap-6 px-app-x py-app-y bg-main-dark text-white">
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
                        className="flex items-center text-brand-500 text-sm"
                        onClick={saveActionSet}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Save this action set
                    </button>

                    <button
                        className="flex items-center text-brand-500 text-sm"
                        onClick={loadActionSets}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Load saved actions
                    </button>
                  </div>

                  <button
                      className="bg-brand-500 hover:bg-opacity-90 text-white py-2 px-6 rounded"
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