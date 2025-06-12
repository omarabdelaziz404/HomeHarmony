'use client';

import { useState } from 'react';
import Header from './index';
import Footer from './footer';
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DesignerMatch() {
  const [style, setStyle] = useState('Modern');
  const [budget, setBudget] = useState('High');
  const [size, setSize] = useState('Large');
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    const params = new URLSearchParams({ style, budget, size });
    const res = await fetch(`http://localhost:8001/recommend-designer?${params}`);
    const data = await res.json();
    setResult(data.recommended_designer || data.error || 'No result');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-8"></h1>
          
          <Card>
            <CardContent className="space-y-6 pt-6">
              <div className="grid gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Design Style</label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Modern', 'Classic', 'Bohemian', 'Industrial', 'Minimalist'].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Budget Range</label>
                  <Select value={budget} onValueChange={setBudget}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Low', 'Medium', 'High'].map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Space Size</label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Small', 'Medium', 'Large'].map((sz) => (
                        <SelectItem key={sz} value={sz}>{sz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <button 
                  onClick={handleSubmit} 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md transition-colors font-medium"
                >
                  Find My Designer Match
                </button>

                {result && (
                  <div className="p-4 bg-muted rounded-md">
                    <p className="text-lg">
                      Recommended Designer: <strong>{result}</strong>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
