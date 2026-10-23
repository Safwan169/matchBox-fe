import { StoreFrame } from "@/components/layout/StoreFrame";

// My account and orders: on phones these pages use their own top bar (AccountTopBar)
// instead of the shop header and footer.
export default function AccountLayout({ children }: LayoutProps<"/">) {
  return <StoreFrame mobileChrome={false}>{children}</StoreFrame>;
}
