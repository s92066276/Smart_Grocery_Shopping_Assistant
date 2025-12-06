'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PurchaseHistoryItem } from '@/lib/types';
import { getRepurchaseSuggestions, getHealthierAlternatives, getExpiryReminders } from '@/lib/actions';
import { Lightbulb, Recycle, Wheat, AlertTriangle, Loader2, Sparkles } from 'lucide-react';

interface ActionPanelProps {
  groceryList: string[];
  purchaseHistory: PurchaseHistoryItem[];
  isLoaded: boolean;
}

type ActionType = 're-purchase' | 'healthier' | 'expiry' | null;

export function ActionPanel({ groceryList, purchaseHistory, isLoaded }: ActionPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [title, setTitle] = useState('AI Suggestions');
  const [icon, setIcon] = useState<React.ReactNode>(<Lightbulb className="h-5 w-5 text-primary" />);

  const handleAction = async (actionType: ActionType) => {
    if (!actionType) return;
    
    setIsLoading(true);
    setSuggestions([]);
    setActiveAction(actionType);
    let results: string[] = [];
    
    try {
      if (actionType === 're-purchase') {
        setTitle('Re-Purchase Suggestions');
        setIcon(<Recycle className="h-5 w-5 text-primary" />);
        results = await getRepurchaseSuggestions(purchaseHistory, groceryList);
      } else if (actionType === 'healthier') {
        setTitle('Healthier Alternatives');
        setIcon(<Wheat className="h-5 w-5 text-accent-foreground" />);
        results = await getHealthierAlternatives(groceryList);
      } else if (actionType === 'expiry') {
        setTitle('Expiry Reminders');
        setIcon(<AlertTriangle className="h-5 w-5 text-destructive" />);
        results = await getExpiryReminders(purchaseHistory);
      }
      
      setSuggestions(results);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions(['An error occurred while fetching suggestions. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="card-hover border-2 border-primary/20 rounded-2xl shadow-xl shadow-primary/5 bg-gradient-to-br from-card to-card/95">
        <CardHeader className="pb-5 border-b-2 border-primary/10 px-8 pt-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg green-glow">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="font-headline text-2xl font-bold">AI Assistant</CardTitle>
          </div>
          <CardDescription className="text-base mt-2 font-medium">
            Get smart suggestions for your groceries based on your purchase history and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 px-8 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button 
              onClick={() => handleAction('re-purchase')} 
              disabled={!isLoaded || isLoading}
              variant="default"
              className="w-full h-auto py-4 px-5 flex flex-col items-center gap-2 sm:flex-row sm:justify-center text-center sm:text-left rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all"
            >
              <Recycle className="h-6 w-6 flex-shrink-0" />
              <span className="text-sm font-semibold whitespace-normal break-words">Suggest Re-Purchase</span>
            </Button>
            <Button 
              onClick={() => handleAction('healthier')} 
              disabled={!isLoaded || isLoading}
              variant="outline"
              className="w-full h-auto py-4 px-5 flex flex-col items-center gap-2 sm:flex-row sm:justify-center text-center sm:text-left rounded-xl border-2 border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all font-semibold"
            >
              <Wheat className="h-6 w-6 flex-shrink-0" />
              <span className="text-sm font-semibold whitespace-normal break-words">Healthier Options</span>
            </Button>
            <Button 
              onClick={() => handleAction('expiry')} 
              disabled={!isLoaded || isLoading}
              variant="destructive"
              className="w-full h-auto py-4 px-5 flex flex-col items-center gap-2 sm:flex-row sm:justify-center text-center sm:text-left rounded-xl shadow-lg shadow-destructive/20 hover:shadow-xl hover:shadow-destructive/30 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold transition-all"
            >
              <AlertTriangle className="h-6 w-6 flex-shrink-0" />
              <span className="text-sm font-semibold whitespace-normal break-words">Check Expiry</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="min-h-[280px] card-hover border-2 border-primary/20 rounded-2xl shadow-xl shadow-primary/5 bg-gradient-to-br from-card to-card/95">
        <CardHeader className="pb-5 border-b-2 border-primary/10 px-8 pt-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/30 to-primary/20 shadow-lg">
              {icon}
            </div>
            <div className="flex-1">
              <CardTitle className="font-headline text-2xl font-bold">{title}</CardTitle>
              {suggestions.length > 0 && !isLoading && (
                <Badge variant="secondary" className="mt-2 text-sm font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border-2 border-primary/20">
                  {suggestions.length} {suggestions.length === 1 ? 'suggestion' : 'suggestions'}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8 px-8 pb-8">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-20 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-base text-muted-foreground font-semibold">Analyzing your data...</p>
            </div>
          ) : (
            suggestions.length > 0 ? (
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:bg-primary/10 hover:border-primary/40 transition-all card-hover"
                  >
                    <p className="text-base text-foreground leading-relaxed font-medium">{suggestion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center py-20 space-y-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
                  <Lightbulb className="h-10 w-10 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-base font-semibold text-foreground">No suggestions yet</p>
                  <p className="text-sm text-muted-foreground">
                    Click a button above to get personalized suggestions
                  </p>
                </div>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
