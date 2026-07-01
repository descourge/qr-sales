export function notifyPendingSalesChanged() {
  window.dispatchEvent(
    new Event("pending-sales-changed")
  );
}