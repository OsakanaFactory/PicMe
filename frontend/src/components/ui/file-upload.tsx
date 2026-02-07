'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
  accept?: string;
  maxSizeMb?: number;
  previewUrl?: string;
  uploading?: boolean;
  progress?: number;
  className?: string;
  compact?: boolean;
  label?: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export function FileUpload({
  onFileSelect,
  onRemove,
  accept = 'image/jpeg,image/png,image/gif,image/webp',
  maxSizeMb = 10,
  previewUrl,
  uploading = false,
  progress = 0,
  className = '',
  compact = false,
  label = '画像をアップロード',
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'JPG, PNG, GIF, WebP形式のみ対応しています';
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      return `ファイルサイズは${maxSizeMb}MB以下にしてください`;
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // ローカルプレビュー生成
    const reader = new FileReader();
    reader.onload = (e) => {
      setLocalPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    onFileSelect(file);
  }, [onFileSelect, maxSizeMb]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // inputのvalueをリセットして同じファイルを再選択可能に
    e.target.value = '';
  };

  const handleRemove = () => {
    setLocalPreview(null);
    setError(null);
    onRemove?.();
  };

  const displayPreview = localPreview || previewUrl;

  if (compact) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-3">
          {displayPreview ? (
            <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
              <img src={displayPreview} alt="Preview" className="h-full w-full object-cover" />
              {!uploading && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ) : (
            <div className="h-16 w-16 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <ImageIcon className="h-6 w-6 text-slate-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Upload className="h-4 w-4 mr-1" />
              )}
              {label}
            </Button>
            {uploading && progress > 0 && (
              <div className="mt-1 h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg transition-colors cursor-pointer
          ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'}
          ${uploading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        {displayPreview ? (
          <div className="relative">
            <img
              src={displayPreview}
              alt="Preview"
              className="w-full max-h-64 object-contain rounded-lg"
            />
            {!uploading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center mb-3">
              <Upload className="h-6 w-6 text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              クリックまたはドラッグ&ドロップで画像を選択
            </p>
            <p className="text-xs text-slate-500 mt-1">
              JPG, PNG, GIF, WebP（最大{maxSizeMb}MB）
            </p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
            <p className="text-sm text-slate-600">アップロード中... {progress}%</p>
            <div className="mt-2 h-2 w-48 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
