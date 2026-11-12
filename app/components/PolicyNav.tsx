import Link from "next/link";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function PolicyNav() {
  return <nav className="policy-nav" aria-label="Product and policy information">
    <Link href={`${basePath}/privacy`}>Privacy</Link>
    <Link href={`${basePath}/terms`}>Terms of use</Link>
    <Link href={`${basePath}/subscription`}>Subscription &amp; refunds</Link>
    <Link href={`${basePath}/contact`}>Contact</Link>
    <Link href={`${basePath}/safety`}>Safety</Link>
  </nav>;
}
