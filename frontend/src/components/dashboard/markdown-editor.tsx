'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, height = 300, placeholder }: MarkdownEditorProps) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-48"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>}>
      <div data-color-mode="light">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          height={height}
          preview="edit"
          textareaProps={{ placeholder }}
        />
      </div>
    </Suspense>
  );
}
