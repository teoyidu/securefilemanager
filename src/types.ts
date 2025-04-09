// src/types.ts
export enum FileFormat {
  DOCX = 'docx',
  PDF = 'pdf',
  XLSX = 'xlsx',
  IMAGE = 'image',
  OTHER = 'other'
}

export enum ConversionOption {
  PDF = 'PDF',
  JPEG = 'JPEG',
  PNG = 'PNG',
  DOCX = 'DOCX',
  XLSX = 'XLSX',
  NONE = 'None'
}

export enum ProcessStatus {
  NotStarted = 'not-started',
  InProgress = 'in-progress',
  Completed = 'completed'
}

export enum ActionOptionType {
  ConvertFormat = 'convert-format',
  CombineFiles = 'combine-files',
  ReduceSize = 'reduce-size',
  FileRenaming = 'file-renaming',
  CompressFiles = 'compress-files',
  ResizeImages = 'resize-images',
  MergeExcel = 'merge-excel'
}

export interface FileType {
  id: string;
  name: string;
  size: number;
  format: string;
  file: File;
  convertTo: ConversionOption | null;
  status: ProcessStatus;
  progress: number;
}

export interface ActionType {
  id: string;
  type: ActionOptionType;
  options?: {
    format?: string;
    to?: string;
    quality?: string;
    prefix?: string;
    suffix?: string;
    outputName?: string;
  };
}

export interface ActionOption {
  id: string;
  title: string;
  type: ActionOptionType;
  icon: JSX.Element;
}
