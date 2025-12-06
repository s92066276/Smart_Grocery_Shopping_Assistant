'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, RotateCcw, Settings } from 'lucide-react';
import { HealthierAlternativesTab } from './HealthierAlternativesTab';
import { CategoryAssociationsTab } from './CategoryAssociationsTab';
import { ExpiryRulesTab } from './ExpiryRulesTab';
import { CustomRulesTab } from './CustomRulesTab';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  exportRules,
  importRules,
  resetToDefaults,
  loadRules,
} from '@/lib/rules-storage';

export default function RulesManager() {
  const [activeTab, setActiveTab] = useState('healthier');
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  const handleExport = () => {
    try {
      const rulesJson = exportRules();
      const blob = new Blob([rulesJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `grocery-rules-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: 'Rules exported',
        description: 'Your rules have been exported successfully.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export rules.',
        variant: 'destructive',
      });
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const content = event.target?.result as string;
            importRules(content);
            setRefreshKey(prev => prev + 1);
            toast({
              title: 'Rules imported',
              description: 'Your rules have been imported successfully.',
            });
          } catch (error) {
            toast({
              title: 'Import failed',
              description: error instanceof Error ? error.message : 'Invalid file format.',
              variant: 'destructive',
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleReset = () => {
    try {
      resetToDefaults();
      setRefreshKey(prev => prev + 1);
      toast({
        title: 'Rules reset',
        description: 'All rules have been reset to defaults.',
      });
    } catch (error) {
      toast({
        title: 'Reset failed',
        description: 'Failed to reset rules.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold gradient-text">Rules Management</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-11">
            Manage your grocery shopping assistant rules. Add, edit, or delete rules to customize suggestions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            className="rounded-lg border-border hover:bg-accent/50"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleImport}
            className="rounded-lg border-border hover:bg-accent/50"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-lg border-destructive/50 hover:bg-destructive/10 hover:border-destructive text-destructive"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg font-semibold">Reset to Default Rules?</AlertDialogTitle>
                <AlertDialogDescription className="text-sm">
                  This will replace all your custom rules with the default rules. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel className="rounded-lg h-10 px-4">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleReset}
                  className="rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground h-10 px-4"
                >
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-full sm:w-auto mb-6">
          <TabsTrigger 
            value="healthier" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Healthier Alternatives
          </TabsTrigger>
          <TabsTrigger 
            value="category" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Category Associations
          </TabsTrigger>
          <TabsTrigger 
            value="expiry" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Expiry Rules
          </TabsTrigger>
          <TabsTrigger 
            value="custom" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Custom Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="healthier" className="mt-0">
          <HealthierAlternativesTab key={refreshKey} onRefresh={() => setRefreshKey(prev => prev + 1)} />
        </TabsContent>

        <TabsContent value="category" className="mt-0">
          <CategoryAssociationsTab key={refreshKey} onRefresh={() => setRefreshKey(prev => prev + 1)} />
        </TabsContent>

        <TabsContent value="expiry" className="mt-0">
          <ExpiryRulesTab key={refreshKey} onRefresh={() => setRefreshKey(prev => prev + 1)} />
        </TabsContent>

        <TabsContent value="custom" className="mt-0">
          <CustomRulesTab key={refreshKey} onRefresh={() => setRefreshKey(prev => prev + 1)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

