import type { Metadata } from "next";
import PrivatePreviewLoader from "./components/PrivatePreviewLoader";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Psync — Train your mind",
  description: "Guided mental skills practices inspired by sport psychology.",
  icons: { icon: `${basePath}/favicon.svg`, shortcut: `${basePath}/favicon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const privatePreview = process.env.PSYNC_PRIVATE_PREVIEW === "1";
  const demo = process.env.PSYNC_EXERCISE_MODE !== "private";
  const privateBuildId = process.env.PSYNC_PRIVATE_BUILD_ID ?? "local";
  return <html lang="en"><head>{privatePreview && <link rel="stylesheet" href={`${basePath}/premium-journal.css?v=${privateBuildId}`} />}</head><body>{demo && <div className="contributor-banner" role="note">Contributor demo · Sample content only · <a href="https://github.com/ewelinaewela/psync-ui/issues">Report a UX issue</a></div>}{children}{privatePreview && <PrivatePreviewLoader src={`${basePath}/premium-journal.js?v=${privateBuildId}`} />}</body></html>;
}
