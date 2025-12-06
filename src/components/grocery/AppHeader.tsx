'use client';

import { ShoppingCart, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export default function AppHeader() {
  const pathname = usePathname();
  const isRulesPage = pathname === '/rules';

  return (
    <header className="border-b bg-card/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl shadow-sm">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-headline text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Smart Shopper
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Your AI-powered grocery assistant</p>
            </div>
          </div>
          <nav className="flex gap-2">
            <Link href="/">
              <Button 
                variant={!isRulesPage ? 'default' : 'ghost'} 
                size="sm"
                className={!isRulesPage ? 'shadow-sm' : ''}
              >
                Grocery List
              </Button>
            </Link>
            <Link href="/rules">
              <Button 
                variant={isRulesPage ? 'default' : 'ghost'} 
                size="sm"
                className={isRulesPage ? 'shadow-sm' : ''}
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
