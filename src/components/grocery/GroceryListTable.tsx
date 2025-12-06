'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Edit, ShoppingCart } from 'lucide-react';
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
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">My Grocery List</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <>
      <Card className="card-hover border-2 border-primary/20 rounded-2xl shadow-xl shadow-primary/5 bg-gradient-to-br from-card to-card/95">
        <CardHeader className="pb-5 border-b-2 border-primary/10 px-8 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full bg-primary shadow-lg shadow-primary/50"></div>
              <CardTitle className="font-headline text-2xl font-bold text-foreground">My Grocery List</CardTitle>
            </div>
            {groceryList.length > 0 && (
              <Badge variant="secondary" className="text-sm font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border-2 border-primary/20">
                {groceryList.length} {groceryList.length === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-8 px-8 pb-8">
          {groceryList.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg">
                <ShoppingCart className="h-10 w-10 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-semibold text-lg">Your grocery list is empty</p>
                <p className="text-sm text-muted-foreground mt-2">Add items to get started</p>
              </div>
            </div>
          ) : (
            <div className="border-2 border-primary/20 rounded-2xl overflow-hidden shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-primary/10 to-primary/5 border-b-2 border-primary/20">
                    <TableHead className="font-bold text-base text-foreground">Item</TableHead>
                    <TableHead className="font-bold text-base text-foreground">Quantity</TableHead>
                    <TableHead className="font-bold text-base text-foreground">Category</TableHead>
                    <TableHead className="text-right w-[140px] font-bold text-base text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groceryList.map((item) => (
                    <TableRow 
                      key={item.id} 
                      className="hover:bg-primary/5 transition-all border-b border-primary/10 last:border-b-0"
                    >
                      <TableCell className="font-semibold text-base">{item.name}</TableCell>
                      <TableCell className="text-base">
                        {item.quantity && item.unit 
                          ? `${item.quantity} ${item.unit}`
                          : item.quantity 
                          ? item.quantity.toString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {item.category ? (
                          <Badge variant="secondary" className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/20 text-accent-foreground border border-accent/30">{item.category}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditClick(item)}
                            className="h-10 w-10 rounded-xl hover:bg-primary/20 hover:text-primary transition-all border-2 border-transparent hover:border-primary/30"
                          >
                            <Edit className="h-5 w-5" />
                            <span className="sr-only">Edit {item.name}</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => onRemoveItem(item.id)}
                            className="h-10 w-10 rounded-xl hover:bg-destructive/20 hover:text-destructive transition-all border-2 border-transparent hover:border-destructive/30"
                          >
                            <Trash2 className="h-5 w-5" />
                            <span className="sr-only">Remove {item.name}</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
