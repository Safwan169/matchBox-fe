import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False on the server and while React hydrates, true afterwards. Parts that hydrate late (inside
 * Suspense) can otherwise see the signed-in user or the cart before hydrating and mismatch the HTML.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
