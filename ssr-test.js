import React from 'react';
import { renderToString } from 'react-dom/server';
import { InvoicesManagementPage } from './src/pages/admin/invoices/InvoicesManagementPage.tsx';

// Mock some things that might fail outside browser
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key })
}));
jest.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({ isRTL: false })
}));

try {
  const html = renderToString(React.createElement(InvoicesManagementPage));
  console.log("RENDER SUCCESS!");
} catch (e) {
  console.error("RENDER ERROR:", e);
}
