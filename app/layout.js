import "./globals.css";

export const metadata = {
  title: "Chat Kiểu Gì – Conversational Style Studio",
  description:
    "Explore conversational tones, craft tailored responses, and learn how different chat styles feel."
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-night text-white antialiased">
        <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 pb-16 pt-10 sm:px-12">
          {children}
        </main>
      </body>
    </html>
  );
}
