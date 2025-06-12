"use client";

import { useState, useRef } from 'react';
import Header from './index';
import Footer from './footer';
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Search, Upload } from "lucide-react";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append('file', image);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/search', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        description: "Failed to search image",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="upload-field flex flex-col gap-6">
            <div className="w-full">
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="w-36 h-36 relative bg-muted rounded-lg flex-shrink-0">
                      {preview ? (
                        <Image
                          src={preview}
                          alt="search image"
                          className="object-contain"
                          fill
                          sizes="144px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Upload className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-4">
                      <h2 className="h3-bold">Upload Image to Search</h2>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        ref={fileInputRef}
                      />
                      <div className="flex gap-4">
                        <Button 
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                          className="w-36"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Image
                        </Button>
                        <Button 
                          onClick={handleUpload}
                          disabled={!image || loading}
                          className="w-36"
                        >
                          <Search className="w-4 h-4 mr-2" />
                          {loading ? "Searching..." : "Search"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="my-10">
            <h2 className="h2-bold mb-6">Results</h2>
            {results.length === 0 && !loading && (
              <p className="text-center text-muted-foreground">No results yet.</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {results.map((path, idx) => (
                <div key={idx} className="aspect-square relative bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={`http://localhost:8000/${path}`}
                    alt={`Result ${idx + 1}`}
                    className="object-cover hover:object-contain transition-all duration-300"
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
