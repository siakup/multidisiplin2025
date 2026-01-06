'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useMemo } from 'react';

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Memuat dokumentasi API...</p>
      </div>
    </div>
  )
});
import 'swagger-ui-react/swagger-ui.css';

export default function DocsPage() {
  const [spec, setSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Suppress React strict mode warnings for third-party libraries
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('UNSAFE_componentWillReceiveProps') ||
         args[0].includes('componentWillReceiveProps'))
      ) {
        // Suppress this specific warning from swagger-ui-react
        return;
      }
      originalError.apply(console, args);
    };

    const fetchSpec = async () => {
      try {
        const response = await fetch('/api/docs/swagger.json');
        if (!response.ok) {
          throw new Error('Failed to fetch Swagger spec');
        }
        const data = await response.json();
        setSpec(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSpec();

    // Cleanup: restore original console.error
    return () => {
      console.error = originalError;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dokumentasi API...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <p className="mt-2 text-gray-600">Gagal memuat dokumentasi API</p>
        </div>
      </div>
    );
  }

  if (!spec) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <SwaggerUI spec={spec} />
    </div>
  );
}