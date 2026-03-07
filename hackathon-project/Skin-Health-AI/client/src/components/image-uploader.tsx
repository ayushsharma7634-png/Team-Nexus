import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  isLoading?: boolean;
}

export function ImageUploader({ onImageSelected, isLoading }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);
    
    if (fileRejections.length > 0) {
      setError("Please select a valid image file (JPEG, PNG, WEBP) under 5MB.");
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setPreview(base64);
        onImageSelected(base64);
      } catch (err) {
        setError("Failed to read image file. Please try again.");
      }
    }
  }, [onImageSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    maxSize: 5242880, // 5MB
    disabled: isLoading
  });

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelected("");
    setError(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        {...getRootProps()} 
        className={`
          relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed
          transition-all duration-300 ease-out min-h-[320px] flex flex-col items-center justify-center p-8
          ${isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-border/60 bg-white hover:border-primary/50 hover:bg-accent/20"}
          ${preview ? "border-transparent bg-transparent" : ""}
          ${isLoading ? "opacity-50 pointer-events-none" : ""}
          shadow-sm hover:shadow-md
        `}
      >
        <input {...getInputProps()} capture="environment" />
        
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 w-full h-full"
            >
              <img 
                src={preview} 
                alt="Selected skin condition" 
                className="w-full h-full object-cover rounded-3xl"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                  Click or drag to replace
                </p>
              </div>
              
              {!isLoading && (
                <button
                  onClick={clearImage}
                  className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-colors"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {isLoading && (
                <div className="absolute inset-0 overflow-hidden rounded-3xl z-10 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-1/4 scanner-line" />
                  <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="glass-card px-6 py-4 rounded-2xl flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="font-semibold text-primary">Analyzing scan...</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className={`
                w-20 h-20 rounded-2xl flex items-center justify-center transition-colors duration-300
                ${isDragActive ? "bg-primary text-white shadow-lg shadow-primary/25" : "bg-primary/10 text-primary group-hover:bg-primary/20"}
              `}>
                <UploadCloud className="w-10 h-10" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {isDragActive ? "Drop image here" : "Upload or capture image"}
                </p>
                <p className="text-sm text-muted-foreground mt-1 max-w-[250px] mx-auto">
                  Drag and drop a clear photo of your skin condition, or click to browse.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground/70 bg-accent/30 px-3 py-1.5 rounded-full">
                <ImageIcon className="w-3 h-3" />
                <span>Supports JPEG, PNG, WEBP (Max 5MB)</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-destructive text-sm font-medium mt-3 text-center"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
