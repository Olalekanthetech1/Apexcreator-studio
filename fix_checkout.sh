#!/bin/bash
# Modify CheckoutView to add theme
sed -i "s/contactSettings,/contactSettings,\n    theme/g" src/components/CheckoutView.tsx
sed -i "s/const \[selectedTab/const isLight = theme === 'light';\n\n  const [selectedTab/g" src/components/CheckoutView.tsx

# Wrapper element changes
sed -i "s/className=\"min-h-screen bg-slate-950 text-white relative flex flex-col pt-20\"/className={\`min-h-screen relative flex flex-col pt-20 \${isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-white'}\`}/g" src/components/CheckoutView.tsx
sed -i "s/className=\"p-4 sm:p-8 space-y-8\"/className=\"p-4 sm:p-8 space-y-8\"/g" src/components/CheckoutView.tsx
