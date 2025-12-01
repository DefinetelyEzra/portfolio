import SearchSpotlight from './SearchSpotlight';

export { default as SearchSpotlight } from './SearchSpotlight';

export const WIDGET_REGISTRY = {
  'search-spotlight': SearchSpotlight,
} as const;