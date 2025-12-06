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
    <div className="space-y-6">
      <Card className="card-hover border-2">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="font-headline text-lg">AI Assistant</CardTitle>
          </div>
          <CardDescription className="text-sm mt-2">
            Get smart suggestions for your groceries based on your purchase history and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button 
              onClick={() => handleAction('re-purchase')} 
              disabled={!isLoaded || isLoading}
              variant="default"
              className="w-full h-auto py-3.5 px-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center text-center sm:text-left shadow-sm hover:shadow-md transition-all"
            >
              <Recycle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium whitespace-normal break-words">Suggest Re-Purchase</span>
            </Button>
            <Button 
              onClick={() => handleAction('healthier')} 
              disabled={!isLoaded || isLoading}
              variant="outline"
              className="w-full h-auto py-3.5 px-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center text-center sm:text-left border-2 hover:bg-accent/10 hover:border-accent transition-all"
            >
              <Wheat className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium whitespace-normal break-words">Healthier Options</span>
            </Button>
            <Button 
              onClick={() => handleAction('expiry')} 
              disabled={!isLoaded || isLoading}
              variant="destructive"
              className="w-full h-auto py-3.5 px-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center text-center sm:text-left shadow-sm hover:shadow-md transition-all"
            >
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium whitespace-normal break-words">Check Expiry</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="min-h-[280px] card-hover border-2">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm">
              {icon}
            </div>
            <div className="flex-1">
              <CardTitle className="font-headline text-lg">{title}</CardTitle>
              {suggestions.length > 0 && !isLoading && (
                <Badge variant="secondary" className="mt-1.5 text-xs font-medium">
                  {suggestions.length} {suggestions.length === 1 ? 'suggestion' : 'suggestions'}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-16 space-y-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground font-medium">Analyzing your data...</p>
            </div>
          ) : (
            suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border-2 bg-card hover:bg-muted/50 hover:border-primary/20 transition-all card-hover"
                  >
                    <p className="text-sm text-foreground leading-relaxed">{suggestion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center py-16 space-y-3">
                <div className="p-4 rounded-full bg-muted">
                  <Lightbulb className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-foreground">No suggestions yet</p>
                  <p className="text-xs text-muted-foreground">
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
