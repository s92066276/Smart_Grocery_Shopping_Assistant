'use client';

import { useState } from 'react';
import { useGroceryData } from '@/hooks/use-grocery-data';
import AppHeader from './AppHeader';
import { AddItemForm } from './AddItemForm';
import { GroceryListTable } from './GroceryListTable';
import { ActionPanel } from './ActionPanel';
import { ChatInterface } from './ChatInterface';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, List } from 'lucide-react';

export default function GroceryApp() {
  const { groceryList, purchaseHistory, isLoaded, addItem, removeItem, editItem } = useGroceryData();
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="inline-flex h-11 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-fit">
              <TabsTrigger 
                value="list" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2"
              >
                <List className="h-4 w-4" />
                Grocery List
              </TabsTrigger>
              <TabsTrigger 
                value="chat" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                AI Assistant
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="list" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                <section>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-foreground mb-1">Add New Item</h2>
                    <p className="text-sm text-muted-foreground">Add items to your grocery list</p>
                  </div>
                  <AddItemForm onAddItem={addItem} disabled={!isLoaded} />
                </section>
                <section>
                  <GroceryListTable
                    groceryList={groceryList}
                    onRemoveItem={removeItem}
                    onEditItem={editItem}
                    isLoaded={isLoaded}
                  />
                </section>
              </div>
              <div className="lg:col-span-4">
                <ActionPanel
                  groceryList={groceryList.map(item => item.name)}
                  purchaseHistory={purchaseHistory}
                  isLoaded={isLoaded}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="chat" className="mt-0">
            <div className="max-w-4xl mx-auto">
              <ChatInterface
                groceryList={groceryList}
                purchaseHistory={purchaseHistory}
                onAddItem={addItem}
                onRemoveItem={removeItem}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
