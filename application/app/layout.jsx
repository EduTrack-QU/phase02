export const metadata = {
  title: "Admin Dashboard Application",
  description: "Admin Dashboard Application for education platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={"antialiased"}
      >
        {children}
      </body>
    </html>
  );
}
