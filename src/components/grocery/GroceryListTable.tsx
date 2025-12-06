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
      <Card className="card-hover border-2">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
              <CardTitle className="font-headline text-lg">My Grocery List</CardTitle>
            </div>
            {groceryList.length > 0 && (
              <Badge variant="secondary" className="text-xs font-medium">
                {groceryList.length} {groceryList.length === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {groceryList.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <div>
                <p className="text-muted-foreground font-medium">Your grocery list is empty</p>
                <p className="text-sm text-muted-foreground/80 mt-1">Add items to get started</p>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold">Item</TableHead>
                    <TableHead className="font-semibold">Quantity</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="text-right w-[140px] font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groceryList.map((item) => (
                    <TableRow 
                      key={item.id} 
                      className="hover:bg-muted/50 transition-colors border-b last:border-b-0"
                    >
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        {item.quantity && item.unit 
                          ? `${item.quantity} ${item.unit}`
                          : item.quantity 
                          ? item.quantity.toString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {item.category ? (
                          <Badge variant="secondary" className="text-xs font-medium">{item.category}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditClick(item)}
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit {item.name}</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => onRemoveItem(item.id)}
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
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
