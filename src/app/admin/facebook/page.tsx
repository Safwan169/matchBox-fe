"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type UIEvent } from "react";
import { AdminDialog } from "@/components/admin/AdminDialog";
import { tableInput } from "@/components/admin/AdminTable";
import { useAdminApi } from "@/components/admin/AdminShell";
import { ProductImage } from "@/components/product/ProductImage";
import { Alert, Button, Card, PageTitle, TextArea, errorMessage } from "@/components/ui";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { ApiItem, ApiList, Product } from "@/lib/types";

interface FacebookStatus {
  configured: boolean;
  pageId: string | null;
  storeUrl: string;
}

interface PublishedPost {
  postId: string;
  postUrl: string;
  productCount: number;
}

interface FacebookPostRecord extends PublishedPost {
  id: string;
  productIds: string[];
  productNames: string[];
  message: string;
  createdAt: string;
}

export default function FacebookPostsPage() {
  const [selected, setSelected] = useState<Product[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [message, setMessage] = useState("Check out our latest products!");
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [published, setPublished] = useState<PublishedPost | null>(null);
  const { data: facebookStatus, error: statusError, loading: statusLoading } = useAdminApi<ApiItem<FacebookStatus>>("/admin/facebook-posts/status");
  const { data: postHistory, error: historyError, loading: historyLoading, reload: reloadHistory } = useAdminApi<ApiItem<FacebookPostRecord[]>>("/admin/facebook-posts");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [publishingPostId, setPublishingPostId] = useState<string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FacebookPostRecord | null>(null);
  const [deleteError, setDeleteError] = useState("");

  async function publish(productIds = selected.map((product) => product.id), postMessage = message, repeatId: string | null = null) {
    setPublishing(true);
    setPublishError("");
    setPublished(null);
    setElapsedSeconds(0);
    setPublishingPostId(repeatId);
    try {
      const { data } = await api<ApiItem<PublishedPost>>("/admin/facebook-posts", {
        method: "POST",
        body: { productIds, message: postMessage },
      });
      setPublished(data);
      setSelected([]);
      setMessage("");
      reloadHistory();
    } catch (err) {
      setPublishError(errorMessage(err));
    } finally {
      setPublishing(false);
      setPublishingPostId(null);
    }
  }

  useEffect(() => {
    if (!publishing) return;
    const startedAt = Date.now();
    const timer = window.setInterval(() => setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [publishing]);

  async function deletePost(post: FacebookPostRecord) {
    setDeletingPostId(post.id);
    setDeleteError("");
    try {
      await api(`/admin/facebook-posts/${post.id}`, { method: "DELETE" });
      if (published?.postId === post.postId) setPublished(null);
      setDeleteTarget(null);
      reloadHistory();
    } catch (err) {
      setDeleteError(errorMessage(err));
    } finally {
      setDeletingPostId(null);
    }
  }

  function toggleProduct(product: Product, checked: boolean) {
    setPublishError("");
    setPublished(null);
    setSelected((current) => {
      if (!checked) return current.filter((item) => item.id !== product.id);
      if (current.length >= 10 || current.some((item) => item.id === product.id)) return current;
      return [...current, product];
    });
  }

  const selectedIds = useMemo(() => new Set(selected.map((product) => product.id)), [selected]);

  return (
    <div className="space-y-5">
      <PageTitle>Facebook posts</PageTitle>
      <p className="max-w-3xl text-sm leading-relaxed text-brand-brown">Choose up to 10 products for one Facebook post. Select one for a single-product post, or publish the same selection again whenever you like.</p>

      {!statusLoading && !facebookStatus?.data.configured && <Alert>
        Facebook publishing needs a Page ID and Page access token in the backend environment: <code>FACEBOOK_PAGE_ID</code> and <code>FACEBOOK_PAGE_ACCESS_TOKEN</code>. The token stays on the server and is never shown here.
      </Alert>}
      {statusError && <Alert>{statusError}</Alert>}

      <Card className="space-y-4">
        <TextArea label="Post message" name="message" rows={3} maxLength={2000} value={message} onChange={(event) => setMessage(event.target.value)} hint="This appears above the selected product cards on Facebook." />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold">Products selected <span className="font-normal text-brand-brown">({selected.length}/10)</span></p>
            <p className="text-xs text-brand-brown">Choose visible products that have a photo.</p>
          </div>
          <Button type="button" variant="outline" onClick={() => setPickerOpen(true)}>Choose products</Button>
        </div>

        {selected.length > 0 ? <ol className="grid gap-3 sm:grid-cols-2">
          {selected.map((product, index) => <li key={product.id} className="flex items-center gap-3 rounded border border-brand-brown/15 bg-white/60 p-3">
            <span className="w-5 text-sm font-semibold text-brand-brown">{index + 1}.</span>
            <div className="w-14 shrink-0 overflow-hidden rounded"><ProductImage src={product.images[0]} alt="" sizes="56px" /></div>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{product.name}</p><p className="text-xs text-brand-brown">{product.price === null ? "Price on request" : formatPrice(product.price)}</p></div>
            <button type="button" className="px-2 text-lg text-brand-brown hover:text-red-700" onClick={() => toggleProduct(product, false)} aria-label={`Remove ${product.name}`}>×</button>
          </li>)}
        </ol> : <button type="button" onClick={() => setPickerOpen(true)} className="flex min-h-32 w-full flex-col items-center justify-center rounded-md border-2 border-dashed border-brand-brown/25 bg-white/40 p-5 text-center transition hover:border-brand-red/50 hover:bg-white/70">
          <span className="text-2xl text-brand-red" aria-hidden="true">＋</span>
          <span className="mt-1 font-semibold">Select products for your post</span>
          <span className="mt-1 text-sm text-brand-brown">Pick one or add up to ten products</span>
        </button>}

        {selected.length > 0 && <button type="button" className="text-sm text-brand-red underline" onClick={() => { setSelected([]); setPublished(null); }}>Clear all selected products</button>}
      </Card>

      <div className="space-y-3">
        <Alert>{publishError}</Alert>
        {published && <Alert kind="success">Published {published.productCount} {published.productCount === 1 ? "product" : "products"} to Facebook. <a className="ml-1 font-semibold underline" href={published.postUrl} target="_blank" rel="noreferrer">View post</a>. The product selection and message were cleared for your next post.</Alert>}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-brand-brown">Product links in the post point to {facebookStatus?.data.storeUrl ?? "your store"}.</p>
          <Button type="button" disabled={publishing || selected.length === 0 || !facebookStatus?.data.configured} onClick={() => void publish()}>
            {publishing ? `Publishing… ${elapsedSeconds}s` : selected.length ? `Publish ${selected.length} ${selected.length === 1 ? "product" : "products"} to Facebook` : "Select products to publish"}
          </Button>
        </div>
        {publishing && <p role="status" className="text-right text-xs text-brand-brown">Facebook is preparing the product photos and link previews. This can take a little while; please keep this page open.</p>}
      </div>

      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Published posts</h2>
          <p className="text-sm text-brand-brown">Repeat a previous post or delete it from both Facebook and this dashboard.</p>
        </div>
        <Alert>{historyError}</Alert>
        {historyLoading && <p className="text-sm text-brand-brown">Loading post history…</p>}
        {!historyLoading && !postHistory?.data.length && <p className="rounded-md border border-dashed border-brand-brown/25 p-6 text-center text-sm text-brand-brown">Your published Facebook posts will appear here.</p>}
        <ul className="divide-y divide-brand-brown/10">
          {postHistory?.data.map((post) => <li key={post.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-semibold">{post.productNames.join(" · ")}</p>
              <p className="mt-1 line-clamp-2 text-sm text-brand-brown">{post.message || "No caption"}</p>
              <p className="mt-1 text-xs text-brand-brown">{new Date(post.createdAt).toLocaleString()} · {post.productCount} {post.productCount === 1 ? "product" : "products"}</p>
              <a href={post.postUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-semibold text-brand-red underline">View on Facebook</a>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button type="button" variant="outline" disabled={publishing || deletingPostId !== null || !facebookStatus?.data.configured} onClick={() => void publish(post.productIds, post.message, post.id)}>
                {publishingPostId === post.id ? `Publishing… ${elapsedSeconds}s` : "Publish again"}
              </Button>
              <Button type="button" variant="danger" disabled={publishing || deletingPostId !== null} onClick={() => { setDeleteError(""); setDeleteTarget(post); }}>
                {deletingPostId === post.id ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </li>)}
        </ul>
      </Card>

      {pickerOpen && <ProductPickerDialog
        selectedIds={selectedIds}
        onToggle={toggleProduct}
        onClose={() => setPickerOpen(false)}
      />}

      {deleteTarget && <AdminDialog title="Delete Facebook post?" onClose={() => deletingPostId ? undefined : setDeleteTarget(null)}>
        <p className="text-sm leading-relaxed text-lux-stone">This will permanently remove this post from your Facebook Page and delete its record from this dashboard.</p>
        <div className="mt-4 border border-lux-ink/10 bg-white/60 p-4">
          <p className="font-semibold">{deleteTarget.productNames.join(" · ")}</p>
          <p className="mt-2 text-sm text-lux-stone">{deleteTarget.message || "No caption"}</p>
          <p className="mt-2 text-xs text-lux-stone">Published {new Date(deleteTarget.createdAt).toLocaleString()}</p>
          <a href={deleteTarget.postUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-medium text-lux-ink underline">View this Facebook post</a>
        </div>
        <Alert>{deleteError}</Alert>
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <Button type="button" variant="outline" disabled={deletingPostId === deleteTarget.id} onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button type="button" variant="danger" disabled={deletingPostId === deleteTarget.id} onClick={() => void deletePost(deleteTarget)}>
            {deletingPostId === deleteTarget.id ? "Deleting…" : "Delete post from Facebook"}
          </Button>
        </div>
      </AdminDialog>}
    </div>
  );
}

function ProductPickerDialog({ selectedIds, onToggle, onClose }: {
  selectedIds: Set<string>;
  onToggle(product: Product, checked: boolean): void;
  onClose(): void;
}) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const loadingRef = useRef(false);
  const canLoadMore = page < totalPages;

  const loadProducts = useCallback(async (requestedPage: number, nextQuery: string, replace: boolean) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setLoadError("");
    try {
      const params = new URLSearchParams({ status: "all", sort: "name_asc", page: String(requestedPage), limit: "30" });
      if (nextQuery) params.set("search", nextQuery);
      const result = await api<ApiList<Product>>(`/admin/products?${params}`);
      setProducts((current) => {
        if (replace) return result.data;
        const known = new Set(current.map((product) => product.id));
        return [...current, ...result.data.filter((product) => !known.has(product.id))];
      });
      setQuery(nextQuery);
      setPage(requestedPage);
      setTotalPages(result.meta.totalPages);
    } catch (err) {
      setLoadError(errorMessage(err));
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadProducts(1, "", true); }, [loadProducts]);

  function onListScroll(event: UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    if (element.scrollHeight - element.scrollTop - element.clientHeight < 120 && !loadingRef.current && canLoadMore) {
      void loadProducts(page + 1, query, false);
    }
  }

  return <AdminDialog title="Choose products" onClose={onClose} className="max-w-4xl">
    <p className="mb-4 text-sm text-brand-brown">Select up to 10 products. Keep scrolling to load more.</p>
    <form className="mb-4 flex gap-2" onSubmit={(event) => { event.preventDefault(); const nextQuery = search.trim(); setProducts([]); setPage(0); setTotalPages(1); setQuery(nextQuery); void loadProducts(1, nextQuery, true); }}>
      <input className={`${tableInput} flex-1`} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by product name or brand" aria-label="Search products" />
      <Button type="submit" variant="outline" disabled={loading}>Search</Button>
    </form>
    <div className="mb-2 flex items-center justify-between text-xs text-brand-brown">
      <span>{products.length} products loaded</span>
      <span>{selectedIds.size}/10 selected</span>
    </div>
    <div className="max-h-[58vh] min-h-56 overflow-y-auto overscroll-contain rounded-md border border-brand-brown/15" onScroll={onListScroll}>
      {products.length === 0 && !loading && !loadError && <p className="p-8 text-center text-sm text-brand-brown">No products found. Try another search.</p>}
      <ul className="divide-y divide-brand-brown/10">
        {products.map((product) => {
          const selected = selectedIds.has(product.id);
          const hasImage = !!product.images[0];
          const isPostable = product.isActive && hasImage;
          const disabled = !selected && (selectedIds.size >= 10 || !isPostable);
          return <li key={product.id} className={`flex items-center gap-3 p-3 ${disabled ? "bg-brand-brown/[0.03]" : "hover:bg-brand-brown/[0.04]"}`}>
            <input type="checkbox" checked={selected} disabled={disabled} onChange={(event) => onToggle(product, event.target.checked)} aria-label={`Select ${product.name}`} className="h-4 w-4 shrink-0 accent-brand-red" />
            <div className="w-14 shrink-0 overflow-hidden rounded">{hasImage ? <ProductImage src={product.images[0]} alt="" sizes="56px" /> : <Link href={`/admin/products/${product.id}`} aria-label={`Open ${product.name} to add an image`}><ProductImage src={undefined} alt={`Open ${product.name} to add an image`} sizes="56px" /></Link>}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{hasImage ? product.name : <Link href={`/admin/products/${product.id}`} className="underline decoration-brand-red underline-offset-2">{product.name}</Link>}</p>
              <p className="text-xs text-brand-brown">{product.brand || "No brand"} · {product.price === null ? "Price on request" : formatPrice(product.price)}</p>
              {!hasImage && <p className="mt-1 text-xs font-medium text-red-700">No product photo. <Link href={`/admin/products/${product.id}`} className="underline">Open product and add a photo before posting</Link>.</p>}
              {hasImage && !product.isActive && <p className="mt-1 text-xs font-medium text-red-700">Hidden from the store. <Link href={`/admin/products/${product.id}`} className="underline">Open product to make it visible</Link>.</p>}
            </div>
            {selected && <span className="shrink-0 text-xs font-semibold text-green-800">Selected</span>}
          </li>;
        })}
      </ul>
      {loading && <p className="p-4 text-center text-sm text-brand-brown">Loading more products…</p>}
      {loadError && <div className="p-3"><Alert>{loadError}</Alert><button type="button" className="mt-2 text-sm font-semibold text-brand-red underline" onClick={() => void loadProducts(page === 0 ? 1 : page + 1, query, page === 0)}>Try again</button></div>}
      {!loading && products.length > 0 && !canLoadMore && <p className="p-4 text-center text-xs text-brand-brown">You’ve reached the end of the product list.</p>}
    </div>
    <div className="mt-5 flex items-center justify-between gap-3">
      <p className="text-xs text-brand-brown">Selected items stay in the same order you choose them.</p>
      <Button type="button" onClick={onClose}>Done</Button>
    </div>
  </AdminDialog>;
}
