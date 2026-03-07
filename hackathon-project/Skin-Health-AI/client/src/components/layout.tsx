import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Stethoscope, History, ScanFace } from "lucide-react";
import { motion } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "New Scan", icon: ScanFace },
    { href: "/history", label: "History", icon: History },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-primary/5 via-accent/10 to-transparent pointer-events-none -z-10" />
      <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl pointer-events-none -z-10" />

      <header className="sticky top-0 z-50 w-full glass-card border-b-0 border-white/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:shadow-primary/30 group-hover:-translate-y-0.5 transition-all duration-300">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-foreground">
                Derm<span className="text-primary">AI</span>
              </span>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-2">
              {navItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-medium text-sm transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary
                      ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}
                    `}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="hidden sm:inline-block">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-xl bg-primary/10 -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      <footer className="mt-auto py-8 text-center text-sm text-muted-foreground/60 border-t border-border/50">
        <p>This application provides AI-generated insights and is not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
}
