/**
 * @fileoverview Composant React pour afficher Swagger UI
 * @module components/SwaggerUI
 * @epic Epic 5.3 - Documentation API
 * @task EF-059 - Générer documentation API avec Swagger UI
 */

import React, { useEffect, useRef } from 'react';
import SwaggerUIReact from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface SwaggerUIProps {
  spec: string;
}

/**
 * Composant Swagger UI pour documentation API interactive
 *
 * @param spec - Spécification OpenAPI au format YAML string
 * @returns Composant Swagger UI avec thème personnalisé
 *
 * @example
 * ```tsx
 * <SwaggerUI spec={openApiYamlContent} client:only="react" />
 * ```
 */
export default function SwaggerUI({ spec }: SwaggerUIProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Appliquer le thème sombre si actif
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark && containerRef.current) {
      containerRef.current.classList.add('swagger-dark-theme');
    }

    // Écouter les changements de thème
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkNow = document.documentElement.classList.contains('dark');
          if (containerRef.current) {
            containerRef.current.classList.toggle('swagger-dark-theme', isDarkNow);
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="swagger-ui-wrapper">
      <SwaggerUIReact
        spec={spec}
        docExpansion="list"
        defaultModelsExpandDepth={1}
        defaultModelExpandDepth={3}
        displayRequestDuration={true}
        filter={true}
        showExtensions={true}
        showCommonExtensions={true}
        tryItOutEnabled={true}
      />
    </div>
  );
}
