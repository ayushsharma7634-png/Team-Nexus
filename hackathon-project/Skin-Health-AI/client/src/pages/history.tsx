import { Layout } from "@/components/layout";
import { useScans } from "@/hooks/use-scans";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Clock, ChevronRight, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function History() {
  const { data: scans, isLoading } = useScans();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Scan History</h1>
          <p className="text-muted-foreground mt-2">View your past skin analyses and recommendations.</p>
        </div>
        <Link href="/" className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors">
          New Scan
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-4 border border-border/50 shadow-sm animate-pulse">
              <div className="w-full h-48 bg-muted rounded-2xl mb-4"></div>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : scans && scans.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {scans.map((scan) => (
            <motion.div key={scan.id} variants={item}>
              <Link href={`/scan/${scan.id}`}>
                <div className="group bg-white rounded-3xl p-4 border border-border/60 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer h-full flex flex-col">
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 bg-muted/50">
                    {scan.imageUrl ? (
                      <img 
                        src={scan.imageUrl} 
                        alt="Scan thumbnail" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-8 h-8 opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none" />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {scan.prediction || "Unknown Condition"}
                    </h3>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between text-sm text-muted-foreground border-t border-border/50">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{formatDistanceToNow(new Date(scan.createdAt), { addSuffix: true })}</span>
                      </div>
                      <div className="flex items-center text-primary font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        View <ChevronRight className="w-4 h-4 ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-24 bg-white/50 rounded-3xl border border-dashed border-border">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
            <HistoryIcon className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold mb-2">No scans yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            You haven't analyzed any skin conditions yet. Upload your first photo to get started.
          </p>
          <Link href="/">
            <a className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
              Start Your First Scan
            </a>
          </Link>
        </div>
      )}
    </Layout>
  );
}

function HistoryIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
