'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { GroceryItem } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Item name must be at least 2 characters.',
  }),
  quantity: z.coerce.number().positive().optional().or(z.literal('')),
  unit: z.string().optional(),
  category: z.string().optional(),
  expiryDate: z.string().optional(),
});

interface EditItemDialogProps {
  item: GroceryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: GroceryItem) => void;
}

export function EditItemDialog({ item, open, onOpenChange, onSave }: EditItemDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      quantity: '',
      unit: '',
      category: '',
      expiryDate: '',
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        quantity: item.quantity ? item.quantity : ('' as const),
        unit: item.unit || '',
        category: item.category || '',
        expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
      });
    }
  }, [item, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!item) return;

    const updatedItem: GroceryItem = {
      ...item,
      name: values.name,
      quantity: values.quantity ? Number(values.quantity) : undefined,
      unit: values.unit || undefined,
      category: values.category || undefined,
      expiryDate: values.expiryDate ? new Date(values.expiryDate).toISOString() : undefined,
    };

    onSave(updatedItem);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit Item</DialogTitle>
          <DialogDescription className="text-sm">Update the item details below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Item Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Organic Milk" 
                      {...field} 
                      className="h-10 rounded-lg border-border bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g., 2" 
                        {...field} 
                        className="h-10 rounded-lg border-border bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Unit</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-lg border-border bg-background">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="mL">mL</SelectItem>
                        <SelectItem value="pieces">pieces</SelectItem>
                        <SelectItem value="pack">pack</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger className="h-10 rounded-lg border-border bg-background">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Dairy">Dairy</SelectItem>
                      <SelectItem value="Fruits">Fruits</SelectItem>
                      <SelectItem value="Vegetables">Vegetables</SelectItem>
                      <SelectItem value="Meat">Meat</SelectItem>
                      <SelectItem value="Beverages">Beverages</SelectItem>
                      <SelectItem value="Bakery">Bakery</SelectItem>
                      <SelectItem value="Pantry">Pantry</SelectItem>
                      <SelectItem value="Snacks">Snacks</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Expiry Date (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      className="h-10 rounded-lg border-border bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4 gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="h-10 px-4 rounded-lg border-border hover:bg-accent/50"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="h-10 px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

