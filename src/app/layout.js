import { Hind, Inter } from "next/font/google";
import "@/assets/css/icofont.min.css";
import "@/assets/css/popup.css";
import "@/assets/css/video-modal.css";
import "aos/dist/aos.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cards";
import "./globals.css";
import FixedShadow from "@/components/shared/others/FixedShadow";
import dynamic from "next/dynamic";
import { SocketProvider } from "@/contexts/SocketContext";
import { UnreadMessagesProvider } from "@/contexts/UnreadMessagesContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LanguageDebugger from "@/components/shared/LanguageDebugger";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import Script from "next/script";

const PreloaderPrimary = dynamic(
  () => import("@/components/shared/others/PreloaderPrimary"),
  { 
    ssr: false,
    loading: () => <div className="preloader-fallback" />
  }
);

export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});
export const hind = Hind({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hind",
});

export const metadata = {
  title: "Tanga Academie | Online Learning Platform",
  description: "Tanga Academie is a global online learning platform where students learn new skills, instructors create and sell courses, and admins manage the education ecosystem efficiently.",
  other: {
    "google": "notranslate"
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${hind.variable}`}>
<head>
  {/* DOM Protection Script */}
  <script
    dangerouslySetInnerHTML={{
      __html: `
        if (typeof Node === 'function' && Node.prototype) {
          const originalRemoveChild = Node.prototype.removeChild;
          Node.prototype.removeChild = function(child) {
            if (child.parentNode !== this) {
              console.warn('Prevented removeChild error - node not a child of parent');
              return child;
            }
            return originalRemoveChild.apply(this, arguments);
          };
          
          const originalInsertBefore = Node.prototype.insertBefore;
          Node.prototype.insertBefore = function(newNode, referenceNode) {
            if (referenceNode && referenceNode.parentNode !== this) {
              console.warn('Prevented insertBefore error - reference node not a child');
              return this.appendChild(newNode);
            }
            return originalInsertBefore.apply(this, arguments);
          };
        }
      `
    }}
  />
  {/* Vimeo Player Script */}
  <Script 
    src="https://player.vimeo.com/api/player.js" 
    strategy="afterInteractive"
  />
  
  {/* Preconnect for better performance */}
  <link rel="preconnect" href="https://player.vimeo.com" />
  <link rel="preconnect" href="https://i.vimeocdn.com" />
</head>
      <body
        className={`relative leading-[1.8] bg-bodyBg dark:bg-bodyBg-dark z-0  ${inter.className}`}
      >

        <ErrorBoundary fallback={<div>Loading language context...</div>}>
          <LanguageProvider>
            <ErrorBoundary fallback={<div>Loading socket connection...</div>}>
              <SocketProvider>
                <ErrorBoundary fallback={<div>Loading messages...</div>}>
                  <UnreadMessagesProvider>
                    <PreloaderPrimary />
                    {children}

                    {/* Language Debugger (temporary for testing) */}
                    <LanguageDebugger />

                    {/* theme fixed shadow */}
                    <div>
                      <FixedShadow />
                      <FixedShadow align={"right"} />
                    </div>
                  </UnreadMessagesProvider>
                </ErrorBoundary>
              </SocketProvider>
            </ErrorBoundary>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
