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
      <Card className="modern-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold">AI Suggestions</CardTitle>
          </div>
          <CardDescription className="text-sm">
            Get smart suggestions for your groceries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            <Button 
              onClick={() => handleAction('re-purchase')} 
              disabled={!isLoaded || isLoading}
              variant="default"
              className="w-full h-auto py-3 px-4 flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium smooth-transition"
            >
              <Recycle className="h-4 w-4" />
              <span className="text-sm">Suggest Re-Purchase</span>
            </Button>
            <Button 
              onClick={() => handleAction('healthier')} 
              disabled={!isLoaded || isLoading}
              variant="outline"
              className="w-full h-auto py-3 px-4 flex items-center gap-2 rounded-lg border-border hover:bg-accent/50 font-medium smooth-transition"
            >
              <Wheat className="h-4 w-4" />
              <span className="text-sm">Healthier Options</span>
            </Button>
            <Button 
              onClick={() => handleAction('expiry')} 
              disabled={!isLoaded || isLoading}
              variant="destructive"
              className="w-full h-auto py-3 px-4 flex items-center gap-2 rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium smooth-transition"
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Check Expiry</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="modern-card min-h-[300px]">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {icon}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              {suggestions.length > 0 && !isLoading && (
                <Badge variant="secondary" className="mt-2 text-xs bg-primary/10 text-primary border border-primary/20">
                  {suggestions.length} {suggestions.length === 1 ? 'suggestion' : 'suggestions'}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-16 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Analyzing your data...</p>
            </div>
          ) : (
            suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 smooth-transition"
                  >
                    <p className="text-sm text-foreground leading-relaxed">{suggestion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center py-16 space-y-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-foreground">No suggestions yet</p>
                  <p className="text-xs text-muted-foreground">
                    Click a button above to get suggestions
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
