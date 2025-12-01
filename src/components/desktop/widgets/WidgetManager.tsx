import React from 'react';
import SearchSpotlight from './SearchSpotlight';

export default function WidgetManager() {
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <SearchSpotlight />
    </div>
  );
}