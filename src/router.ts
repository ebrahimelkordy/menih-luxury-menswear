import { useState, useEffect, useCallback } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'shop'; category?: string }
  | { name: 'product'; handle: string }
  | { name: 'mix-match' }
  | { name: 'contact' }
  | { name: 'track'; order?: string }
  | { name: 'admin'; tab?: string };

function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '');
  const [pathPart] = clean.split('?');
  const parts = pathPart.split('/').filter(Boolean);

  if (parts.length === 0) return { name: 'home' };
  if (parts[0] === 'shop') {
    return { name: 'shop', category: parts[1] };
  }
  if (parts[0] === 'product' && parts[1]) {
    return { name: 'product', handle: parts[1] };
  }
  if (parts[0] === 'mix-match') {
    return { name: 'mix-match' };
  }
  if (parts[0] === 'contact') {
    return { name: 'contact' };
  }
  if (parts[0] === 'track') {
    return { name: 'track', order: parts[1] };
  }
  if (parts[0] === 'admin') {
    return { name: 'admin', tab: parts[1] };
  }
  return { name: 'home' };
}

export function routeToHash(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/';
    case 'shop':
      return route.category ? `#/shop/${route.category}` : '#/shop';
    case 'product':
      return `#/product/${route.handle}`;
    case 'mix-match':
      return '#/mix-match';
    case 'contact':
      return '#/contact';
    case 'track':
      return route.order ? `#/track?order=${route.order}` : '#/track';
    case 'admin':
      return route.tab ? `#/admin/${route.tab}` : '#/admin';
  }
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(() => parseHash(typeof window !== 'undefined' ? window.location.hash : ''));

  useEffect(() => {
    const handler = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = useCallback((r: Route) => {
    window.location.hash = routeToHash(r);
  }, []);

  return { route, navigate };
}
