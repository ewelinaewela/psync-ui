"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "../components/journal-bridge";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function JournalPage() {
  const host = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let unmount: (() => void) | undefined;
    const mount = () => {
      if (!host.current || !window.psyncJournal || unmount) return;
      unmount = window.psyncJournal.mountJournal(host.current);
      setAvailable(true);
    };

    window.addEventListener("psync:journal-ready", mount);
    mount();
    return () => {
      window.removeEventListener("psync:journal-ready", mount);
      unmount?.();
    };
  }, []);

  return (
    <main className="info-page">
      <header className="info-header"><Link className="back-link" href={`${basePath}/`}>← Home</Link><strong>Psync</strong></header>
      <div ref={host} />
      {!available && <article className="info-article"><p className="exercise-eyebrow">Private Journal</p><h1>Journal preview is not available here.</h1><p className="info-intro">The public Psync preview does not save exercise answers. Private Journal is being tested locally and is not for sale yet.</p></article>}
    </main>
  );
}
