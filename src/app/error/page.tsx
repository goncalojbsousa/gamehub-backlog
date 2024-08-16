// app/some-route/page.tsx

import React from 'react';

export default function SomePage() {
  // Forçar um erro
  throw new Error('This is a deliberate error for testing purposes.');

  return (
    <div>
      <h1>This is some page</h1>
    </div>
  );
}
