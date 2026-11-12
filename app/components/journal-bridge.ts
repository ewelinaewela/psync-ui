export type JournalEntry = {
  id?: string;
  label: string;
  value: string;
};

export type JournalSessionInput = {
  id?: string;
  kind: "imagery" | "inner-voice" | "anxiety-balance" | "anxiety-pressure";
  title: string;
  completedAt: string;
  entries: JournalEntry[];
};

export type JournalBridge = {
  status(): Promise<"subscription-required" | "expired" | "verification-unavailable" | "legacy" | "new" | "unlocked">;
  create(): Promise<void>;
  saveSession(input: JournalSessionInput): Promise<void>;
  loadSession(id: string): Promise<JournalSessionInput | null>;
  mountJournal(element: HTMLElement): () => void;
};

declare global {
  interface Window {
    psyncJournal?: JournalBridge;
  }
}
