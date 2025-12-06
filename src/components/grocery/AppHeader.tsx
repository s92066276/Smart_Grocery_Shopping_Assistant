'use client';

import { ShoppingCart, Settings, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export default function AppHeader() {
  const pathname = usePathname();
  const isRulesPage = pathname === '/rules';
  const isHomePage = pathname === '/';

  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-4">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-500 to-pink-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative p-3 bg-gradient-to-br from-primary to-purple-600 rounded-xl shadow-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                Smart Shopper
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">AI-powered grocery assistant</p>
            </div>
          </Link>
          <nav className="flex gap-2">
            <Link href="/">
              <Button 
                variant={isHomePage ? 'default' : 'ghost'} 
                size="sm"
                className={`smooth-transition ${
                  isHomePage 
                    ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30' 
                    : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                } rounded-lg px-4`}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                List
              </Button>
            </Link>
            <Link href="/rules">
              <Button 
                variant={isRulesPage ? 'default' : 'ghost'} 
                size="sm"
                className={`smooth-transition ${
                  isRulesPage 
                    ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30' 
                    : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                } rounded-lg px-4`}
              >
                <Settings className="mr-2 h-4 w-4" />
                Rules
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
