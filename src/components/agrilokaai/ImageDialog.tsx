import { useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

interface ImageDialogProps {
  imageUrl: string;
  onClose: () => void;
  onSubmit: (question: string) => void;
}

export function ImageDialog({ imageUrl, onClose, onSubmit }: ImageDialogProps) {
  const [question, setQuestion] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-xl max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Analisis Gambar</h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full h-64 mb-4">
          <Image
            src={imageUrl}
            alt="Preview"
            fill
            className="rounded-lg object-cover"
          />
        </div>

        <div className="space-y-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Tanyakan sesuatu tentang gambar ini..."
            className="w-full p-3 rounded-lg border min-h-[100px]"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg hover:bg-muted"
            >
              Batal
            </button>
            <button
              onClick={() => onSubmit(question)}
              disabled={!question.trim()}
              className="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50"
            >
              Kirim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}