import "./globals.css";


export const metadata = {
  title: "Student tracking app",
  description: "project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
