'use client';

import { ShoppingCart, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export default function AppHeader() {
  const pathname = usePathname();
  const isRulesPage = pathname === '/rules';

  return (
    <header className="border-b-2 border-primary/20 glass-effect sticky top-0 z-50 shadow-lg shadow-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg green-glow">
              <ShoppingCart className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-headline text-foreground bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Smart Shopper
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block font-medium">Your AI-powered grocery assistant</p>
            </div>
          </div>
          <nav className="flex gap-3">
            <Link href="/">
              <Button 
                variant={!isRulesPage ? 'default' : 'outline'} 
                size="lg"
                className={!isRulesPage ? 'shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-6' : 'rounded-xl px-6 border-2 hover:bg-primary/10 hover:border-primary/50'}
              >
                Grocery List
              </Button>
            </Link>
            <Link href="/rules">
              <Button 
                variant={isRulesPage ? 'default' : 'outline'} 
                size="lg"
                className={isRulesPage ? 'shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-6' : 'rounded-xl px-6 border-2 hover:bg-primary/10 hover:border-primary/50'}
              >
                <Settings className="mr-2 h-5 w-5" />
                Rules
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
