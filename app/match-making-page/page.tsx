'use client';

import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Header from './index';
import Footer from './footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  style: z.string(),
  budgetInput: z.string(),
  sizeInput: z.string(),
});

export default function DesignerMatch() {
  const [budget, setBudget] = useState('High');
  const [size, setSize] = useState('Large');
  const [result, setResult] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      style: 'Modern',
      budgetInput: '',
      sizeInput: '',
    },
  });

  const handleBudgetChange = (value: string) => {
    const num = Number(value);
    if (!isNaN(num)) {
      if (num < 20000) setBudget('Low');
      else if (num >= 20000 && num < 50000) setBudget('Medium');
      else if (num >= 50000) setBudget('High');
      else setBudget('');
    } else {
      setBudget('');
    }
  };

  const handleSizeChange = (value: string) => {
    const num = Number(value);
    if (!isNaN(num)) {
      if (num < 100) setSize('Small');
      else if (num >= 100 && num < 200) setSize('Medium');
      else if (num >= 200) setSize('Large');
      else setSize('');
    } else {
      setSize('');
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const params = new URLSearchParams({ 
      style: values.style, 
      budget, 
      size 
    });
    const res = await fetch(`http://localhost:8001/recommend-designer?${params}`);
    const data = await res.json();
    setResult(data.recommended_designer || data.error || 'No result');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="space-y-8 pt-6">
              <h1 className="text-2xl font-bold">Designer Match</h1>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Design Style</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {['Modern', 'Classic', 'Bohemian', 'Minimalist'].map((s) => (
                            <Button
                              key={s}
                              onClick={() => field.onChange(s)}
                              variant={field.value === s ? "default" : "outline"}
                              className="min-w-[100px]"
                              type="button"
                            >
                              {s}
                            </Button>
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budgetInput"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Budget </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter your budget"
                            min="0"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleBudgetChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                          Category: <span className="font-medium">{budget}</span>
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sizeInput"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Space Size (m²)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter project size"
                            min="0"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleSizeChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                          Category: <span className="font-medium">{size}</span>
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={!form.getValues("budgetInput") || !form.getValues("sizeInput")}
                  >
                    Find My Designer Match
                  </Button>
                </form>
              </Form>

              {result && (
                <Card className="mt-6">
                  <CardContent className="pt-6">
                    <p className="text-lg">
                      Recommended Designer:{' '}
                      <a
                        href={`/product/${encodeURIComponent(result.toLowerCase().replace(/\s+/g, '-'))}-portfolio`}
                        className="font-medium text-primary hover:underline"
                      >
                        {result}
                      </a>
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
