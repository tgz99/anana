export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  const KEY = "anana_sid";
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(KEY, id);
  }
  return id;
}
