import "../styles/globals.css";

export const metadata = {
  title: "Daily Brief",
  description: "News without trying"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
