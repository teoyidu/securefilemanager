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
import { useApp, useFiles, useActions } from './context';
import { fileService } from './services/api';
import { storageService } from './services/localStorage';
import { ActionOptionType } from './types';

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
    addFiles(acceptedFiles);
  };

  // Handle file preview
  const handlePreviewFile = (file: any) => {
    setPreviewFile(file);
  };

  // Close file preview
  const closePreview = () => {
    setPreviewFile(null);
  };

  // Process and download files
  const processAndDownload = async () => {
    if (files.length === 0) {
      alert('Please add files to process');
      return;
    }

    try {
      // Start processing
      startProcessing('Uploading files...');
      setProcessingStartTime(Date.now());
      updateAllFileStatuses(ProcessStatus.InProgress, 0);

      // Upload files
      const { uploadId } = await fileService.uploadFiles(files);

      // Update status
      setProcessingState('processing', 'Processing files...');
      setProcessingProgress(10);

      // Start processing with actions
      const { processId } = await fileService.processFiles(uploadId, actions);

      // Poll for status updates
      const statusCheckInterval = setInterval(async () => {
        try {
          const statusResponse = await fileService.checkStatus(processId);

          // Update overall progress
          setProcessingProgress(statusResponse.progress);

          // Update each file's progress
          statusResponse.fileStatuses.forEach(fileStatus => {
            updateFileStatus(fileStatus.fileId, fileStatus.status, fileStatus.progress);
          });

          // If all processing is done, stop polling
          if (statusResponse.status === 'completed' || statusResponse.status === 'failed') {
            clearInterval(statusCheckInterval);

            setProcessingSuccess(statusResponse.status === 'completed');
            if (statusResponse.status === 'failed') {
              setProcessingError('One or more files failed to process.');
            }

            // Calculate final processing time
            const finalTime = (Date.now() - (processingStartTime || Date.now())) / 1000;
            setProcessingTime(finalTime);

            // Complete processing and show summary
            finishProcessing(statusResponse.status === 'completed');
            setShowSummary(true);
          }
        } catch (error) {
          console.error('Error checking status:', error);
          clearInterval(statusCheckInterval);

          finishProcessing(false);
          setProcessingSuccess(false);
          setProcessingError('An error occurred while checking processing status.');
          setShowSummary(true);
        }
      }, 1000); // Check every second

    } catch (error) {
      console.error('Processing error:', error);

      finishProcessing(false);
      setProcessingSuccess(false);
      setProcessingError('An error occurred during file processing. Please try again.');
      setShowSummary(true);
    }
  };

  // Handle download after processing
  const handleDownload = async () => {
    try {
      // This would need to be implemented with your actual backend integration
      alert('Download would start here in a real application.');
      setShowSummary(false);
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading files. Please try again.');
    }
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