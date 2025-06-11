"use client";

import { useState, ChangeEvent } from 'react';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files?.[0] || null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🔍 Image Search</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={!image || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Results</h2>
        {results.length === 0 && !loading && <p>No results yet.</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {results.map((path, idx) => (
  <img
    key={idx}
    src={`http://localhost:8000/${path}`}
    alt={`Result ${idx}`}
    className="rounded shadow-md"
    width={200}
  />
))}
        </div>
      </div>
    </div>
  );
}
