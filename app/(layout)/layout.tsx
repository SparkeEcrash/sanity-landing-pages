import Navigation from "../components/navigation";
import Footer from "../components/footer";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col justify-between min-h-screen">
        <Navigation />
        {children}
        <Footer />
      </div>
    </>
  );
}
