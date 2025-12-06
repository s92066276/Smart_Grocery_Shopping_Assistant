'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';

const formSchema = z.object({
  itemName: z.string().min(2, {
    message: 'Item name must be at least 2 characters.',
  }),
  quantity: z.coerce.number().positive().optional().or(z.literal('')),
  unit: z.string().optional(),
  category: z.string().optional(),
  expiryDate: z.string().optional(),
});

interface AddItemFormProps {
  onAddItem: (itemName: string, quantity?: number, unit?: string, category?: string, expiryDate?: string) => void;
  disabled?: boolean;
}

export function AddItemForm({ onAddItem, disabled }: AddItemFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: '',
      quantity: '',
      unit: '',
      category: '',
      expiryDate: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddItem(
      values.itemName,
      values.quantity ? Number(values.quantity) : undefined,
      values.unit || undefined,
      values.category || undefined,
      values.expiryDate || undefined
    );
    form.reset();
  }

  return (
    <Card className="card-hover border-2">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="itemName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-sm font-medium">Item Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Organic Milk" 
                        {...field} 
                        disabled={disabled}
                        className="h-10 transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        disabled={disabled}
                        className="h-10 transition-all focus:ring-2 focus:ring-primary/20"
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
                    <Select onValueChange={field.onChange} value={field.value || undefined} disabled={disabled}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select unit (optional)" />
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
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined} disabled={disabled}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select category (optional)" />
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
                        disabled={disabled}
                        className="h-10 transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button 
              type="submit" 
              disabled={disabled}
              className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
