const fs = require('fs');

const files = [
  'src/components/CheckoutView.tsx',
  'src/components/PolicyModals.tsx',
  'src/components/ServiceDetailModal.tsx',
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // ensure isLight exists
  if (!content.includes('const isLight = theme === \'light\';')) {
      if (content.includes('const {')) {
         if (!content.includes('theme')) {
             content = content.replace('const {', 'const { theme,');
         }
         content = content.replace(/(const {.*?} = useApp\(\);)/s, "$1\n  const isLight = theme === 'light';");
      }
  }

  // replace standard card backgrounds
  content = content.replace(/bg-slate-900 border border-slate-800/g, "${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}");
  content = content.replace(/bg-slate-900 border-slate-800/g, "${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}");
  content = content.replace(/bg-slate-950 border border-slate-800/g, "${isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'}");
  content = content.replace(/bg-slate-950 border-slate-800/g, "${isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'}");
  content = content.replace(/bg-slate-950\/80/g, "${isLight ? 'bg-white/80' : 'bg-slate-950/80'}");
  content = content.replace(/bg-slate-900\/90/g, "${isLight ? 'bg-white/90' : 'bg-slate-900/90'}");
  
  // text colors
  content = content.replace(/text-slate-400/g, "${isLight ? 'text-slate-500' : 'text-slate-400'}");
  content = content.replace(/text-slate-300/g, "${isLight ? 'text-slate-600' : 'text-slate-300'}");
  
  // Ensure className="... ${isLight..." instead of className="... ${isLight..." if it's currently a string literal
  // A simple regex to convert className="foo" to className={`foo`} before applying changes might be too complex,
  // Let's just fix the string literals that got broken:
  content = content.replace(/className="([^"]*\$\{isLight[^"]*)"/g, "className={`$1`}");
  content = content.replace(/className='([^']*\$\{isLight[^']*)'/g, "className={`$1`}");

  fs.writeFileSync(file, content);
}
console.log("Done");
