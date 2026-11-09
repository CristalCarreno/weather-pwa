import "./globals.css";

export const metadata = {
  title: "Weather PWA",
  description: "Aplicación del clima PWA profesional",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0b1329",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-[#0b1329] text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
