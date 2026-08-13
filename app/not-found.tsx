import './globals.css';

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main className="not-found-content">
          <p className="not-found-code">404</p>
          <h1 className="not-found-title">Page Not Found</h1>
          <p className="not-found-desc">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <a href="/" className="primary-btn">Return to homepage</a>
        </main>
      </body>
    </html>
  );
}
