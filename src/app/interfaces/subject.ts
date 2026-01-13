export interface Subject {
  subscribe(): void;
  unsubscribe(): void;
  notify(): void;
}
