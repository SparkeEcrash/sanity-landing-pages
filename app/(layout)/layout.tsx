import Navigation from "@components/navigation";
import Footer from "@components/footer";
import Messages from "@components/messages";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col justify-between min-h-screen">
        <Navigation />
        <Messages />
        {children}
        <Footer />
      </div>
    </>
  );
}
