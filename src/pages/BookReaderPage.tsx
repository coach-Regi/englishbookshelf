// src/pages/BookReaderPage.tsx
// Заглушка — полная реализация в Sprint F-3.

import { useParams } from "react-router-dom";
import { FileText } from "lucide-react";

export default function BookReaderPage() {
  const { bookId } = useParams<{ bookId: string }>();

  return (
    <div className="flex h-full">
      {/* PDF Area placeholder */}
      <div className="flex-1 flex items-center justify-center bg-subtle">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-surface border border-border
                          flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-lg font-medium text-primary mb-1">
            Book Reader
          </h2>
          <p className="text-sm text-secondary">
            Book ID: <code className="font-mono bg-subtle px-1 rounded">{bookId}</code>
          </p>
          <p className="text-xs text-placeholder mt-2">
            PDF-ридер с Audio Pins — Sprint F-3
          </p>
        </div>
      </div>
    </div>
  );
}
