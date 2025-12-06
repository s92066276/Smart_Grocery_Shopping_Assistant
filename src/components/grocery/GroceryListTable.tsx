'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit, ShoppingCart, Package } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { EditItemDialog } from './EditItemDialog';
import type { GroceryItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface GroceryListTableProps {
  groceryList: GroceryItem[];
  onRemoveItem: (itemId: string) => void;
  onEditItem: (item: GroceryItem) => void;
  isLoaded: boolean;
}

export function GroceryListTable({ groceryList, onRemoveItem, onEditItem, isLoaded }: GroceryListTableProps) {
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClick = (item: GroceryItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (item: GroceryItem) => {
    onEditItem(item);
    setIsEditDialogOpen(false);
    setEditingItem(null);
  };
    
  if (!isLoaded) {
    return (
        <Card className="modern-card">
            <CardHeader>
                <CardTitle>My Grocery List</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <>
      <Card className="modern-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl font-semibold">My Grocery List</CardTitle>
            </div>
            {groceryList.length > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">
                {groceryList.length} {groceryList.length === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {groceryList.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-medium">Your grocery list is empty</p>
                <p className="text-sm text-muted-foreground mt-1">Add items to get started</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {groceryList.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between p-4 rounded-lg border border-border bg-card/50 hover:bg-accent/5 hover:border-primary/20 smooth-transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                      {item.category && (
                        <Badge variant="outline" className="text-xs shrink-0">
                          {item.category}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity && item.unit 
                        ? `${item.quantity} ${item.unit}`
                        : item.quantity 
                        ? item.quantity.toString()
                        : 'No quantity specified'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditClick(item)}
                      className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary smooth-transition"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit {item.name}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onRemoveItem(item.id)}
                      className="h-9 w-9 rounded-lg hover:bg-destructive/10 hover:text-destructive smooth-transition"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove {item.name}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <EditItemDialog
        item={editingItem}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveEdit}
      />
    </>
  );
}
