'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { processChatCommand } from '@/ai/flows/process-chat-command';
import { getAllRuleBasedSuggestions } from '@/lib/rules-engine';
import type { GroceryItem, PurchaseHistoryItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  groceryList: GroceryItem[];
  purchaseHistory: PurchaseHistoryItem[];
  onAddItem: (itemName: string, quantity?: number, unit?: string, category?: string, expiryDate?: string) => void;
  onRemoveItem: (itemId: string) => void;
}

export function ChatInterface({ groceryList, purchaseHistory, onAddItem, onRemoveItem }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your grocery shopping assistant. I can help you manage your grocery list, suggest items, and remind you about expiring products. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // First, check rule-based suggestions
      const ruleBasedSuggestions = getAllRuleBasedSuggestions(purchaseHistory, groceryList);
      
      // Process the command with AI
      const groceryListNames = groceryList.map(item => item.name);
      const historyForAI = purchaseHistory.map(item => ({
        itemName: item.itemName,
        purchaseDate: item.purchaseDate,
        expiryTimeInDays: item.expiryTimeInDays,
      }));

      const result = await processChatCommand({
        userMessage: input.trim(),
        groceryList: groceryListNames,
        purchaseHistory: historyForAI,
      });

      // Execute actions based on intent
      if (result.intent === 'add' && result.items.length > 0) {
        result.items.forEach((itemName: string) => {
          const quantity = result.quantities?.find((q: { item: string; quantity?: number; unit?: string }) => q.item.toLowerCase() === itemName.toLowerCase());
          onAddItem(
            itemName,
            quantity?.quantity,
            quantity?.unit,
            undefined,
            undefined
          );
        });
        toast({
          title: 'Items added',
          description: `Added ${result.items.join(', ')} to your grocery list.`,
        });
      } else if (result.intent === 'remove' && result.items.length > 0) {
        const itemToRemove = groceryList.find((item: GroceryItem) => 
          result.items.some((rm: string) => item.name.toLowerCase().includes(rm.toLowerCase()))
        );
        if (itemToRemove) {
          onRemoveItem(itemToRemove.id);
          toast({
            title: 'Item removed',
            description: `Removed ${itemToRemove.name} from your grocery list.`,
          });
        }
      } else if (result.intent === 'suggest') {
        // Enhance response with rule-based suggestions
        const suggestions: string[] = [];
        if (ruleBasedSuggestions.rePurchase.length > 0) {
          suggestions.push(...ruleBasedSuggestions.rePurchase.map(s => `${s.item}: ${s.reason}`));
        }
        if (ruleBasedSuggestions.category.length > 0) {
          suggestions.push(...ruleBasedSuggestions.category.map(s => `${s.item}: ${s.reason}`));
        }
        if (suggestions.length > 0) {
          result.response += '\n\nRule-based suggestions:\n' + suggestions.join('\n');
        }
      } else if (result.intent === 'healthier') {
        const healthierSuggestions = ruleBasedSuggestions.healthier.map(s => `${s.item}: ${s.reason}`);
        if (healthierSuggestions.length > 0) {
          result.response += '\n\n' + healthierSuggestions.join('\n');
        }
      } else if (result.intent === 'expiry') {
        const expiryReminders = ruleBasedSuggestions.expiry.map(e => e.message);
        if (expiryReminders.length > 0) {
          result.response += '\n\n' + expiryReminders.join('\n');
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        reasoning: result.reasoning,
        timestamp: new Date(),
      };

      setMessages((prev: Message[]) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing chat command:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev: Message[]) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col shadow-xl border-2 border-primary/20 rounded-2xl card-hover bg-gradient-to-br from-card to-card/95">
      <CardHeader className="pb-5 border-b-2 border-primary/10 px-8 pt-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg green-glow">
            <Bot className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="font-headline flex items-center gap-2 text-2xl font-bold">
              AI Assistant
            </CardTitle>
            <CardDescription className="mt-1 text-base font-medium">Chat with your grocery shopping assistant</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 min-h-0 px-8 pb-8">
        <ScrollArea className="flex-1 pr-4 mb-6" ref={scrollRef}>
          <div className="space-y-5 py-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/20 flex items-center justify-center shadow-lg">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-5 shadow-lg transition-all ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-2 border-primary/30'
                      : 'bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20'
                  }`}
                >
                  <p className="text-base leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
                  {message.reasoning && (
                    <p className="text-sm mt-4 pt-4 border-t border-border/50 opacity-75 italic">
                      Reasoning: {message.reasoning}
                    </p>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/20 flex items-center justify-center shadow-lg">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/20 flex items-center justify-center shadow-lg">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 border-2 border-primary/20">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex gap-4 pt-6 border-t-2 border-primary/10">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (e.g., 'Add 2kg rice', 'What should I buy?')"
            disabled={isLoading}
            className="flex-1 h-14 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all text-base"
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()} 
            size="default"
            className="h-14 px-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

