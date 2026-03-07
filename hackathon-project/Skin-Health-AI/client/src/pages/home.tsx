import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { ImageUploader } from "@/components/image-uploader";
import { useAnalyzeScan } from "@/hooks/use-scans";
import { ShieldAlert, Sparkles, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const { mutate: analyzeScan, isPending } = useAnalyzeScan();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleAnalyze = () => {
    if (!selectedImage) return;
    
    analyzeScan(selectedImage, {
      onSuccess: (data) => {
        toast({
          title: "Analysis Complete",
          description: "Your skin scan has been successfully processed.",
        });
        setLocation(`/scan/${data.id}`);
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: error.message || "We encountered an issue analyzing your image. Please try again with a clearer photo.",
        });
      }
    });
  };

  return (
    <Layout>
      <div className="flex flex-col items-center max-w-3xl mx-auto space-y-12">
        
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Dermatology Assistant</span>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
            Understand your skin <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">in seconds</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take a clear photo of any skin concern. Our advanced AI model will analyze it instantly to provide predictions and preliminary health guidance.
          </p>
        </div>

        <div className="w-full">
          <ImageUploader 
            onImageSelected={setSelectedImage} 
            isLoading={isPending} 
          />
        </div>

        <motion.div 
          className="w-full flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: selectedImage ? 1 : 0.5, y: 0 }}
        >
          <button
            onClick={handleAnalyze}
            disabled={!selectedImage || isPending}
            className={`
              relative overflow-hidden group
              px-8 py-4 rounded-2xl font-bold text-lg text-white
              transition-all duration-300 ease-out
              ${!selectedImage || isPending 
                ? "bg-muted-foreground/30 cursor-not-allowed" 
                : "bg-gradient-to-r from-primary to-teal-500 shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 hover:scale-[1.02] active:scale-95 active:translate-y-0"
              }
            `}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing Image...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ScanFaceIcon className="w-5 h-5" />
                Analyze Skin Condition
              </span>
            )}
            
            {/* Button shine effect */}
            {selectedImage && !isPending && (
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            )}
          </button>
        </motion.div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full pt-8 border-t border-border/50">
          <div className="flex gap-4 p-4 rounded-2xl bg-white shadow-sm border border-border/40">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Instant Preliminary Results</h3>
              <p className="text-sm text-muted-foreground mt-1">Get immediate feedback on possible conditions based on visual patterns.</p>
            </div>
          </div>
          <div className="flex gap-4 p-4 rounded-2xl bg-white shadow-sm border border-border/40">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Guidance & Next Steps</h3>
              <p className="text-sm text-muted-foreground mt-1">Receive actionable advice on whether you should seek professional medical care.</p>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}

// Inline icon component since it's not imported at top
function ScanFaceIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
    </svg>
  );
}
