import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './tokens/foundation.css';
import './tokens/semantic.css';
import './tokens/component.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'RxFlow — Orders',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@100;400;500;600;700;800&family=DM+Sans:wght@400;500;700&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "wtnv4uq14w");`,
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
