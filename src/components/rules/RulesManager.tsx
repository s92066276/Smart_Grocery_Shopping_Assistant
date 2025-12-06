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
    <div className="max-w-7xl mx-auto space-y-10 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-8 border-b-2 border-primary/20">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg green-glow">
              <Settings className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold font-headline bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Rules Management</h1>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg ml-14 font-medium">
            Manage your grocery shopping assistant rules. Add, edit, or delete rules to customize suggestions.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleExport}
            className="rounded-xl border-2 border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all font-semibold px-5"
          >
            <Download className="mr-2 h-5 w-5" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleImport}
            className="rounded-xl border-2 border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all font-semibold px-5"
          >
            <Upload className="mr-2 h-5 w-5" />
            Import
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-xl border-2 border-destructive/30 hover:bg-destructive/20 hover:border-destructive/50 transition-all font-semibold px-5"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-2 border-primary/20 rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-bold">Reset to Default Rules?</AlertDialogTitle>
                <AlertDialogDescription className="text-base font-medium">
                  This will replace all your custom rules with the default rules. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-3">
                <AlertDialogCancel className="rounded-xl border-2 h-12 px-6 font-semibold">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleReset}
                  className="rounded-xl shadow-lg shadow-destructive/20 hover:shadow-xl hover:shadow-destructive/30 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold h-12 px-6"
                >
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-3 mb-10 h-14 bg-muted/60 rounded-2xl p-1.5 border-2 border-primary/10">
          <TabsTrigger 
            value="healthier" 
            className="text-sm font-semibold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all"
          >
            Healthier Alternatives
          </TabsTrigger>
          <TabsTrigger 
            value="category" 
            className="text-sm font-semibold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all"
          >
            Category Associations
          </TabsTrigger>
          <TabsTrigger 
            value="expiry" 
            className="text-sm font-semibold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all"
          >
            Expiry Rules
          </TabsTrigger>
          <TabsTrigger 
            value="custom" 
            className="text-sm font-semibold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all"
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

