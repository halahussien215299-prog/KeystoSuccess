"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SiteContent, getInitialContent } from "@/lib/content-types";

interface ContentContextType {
  content: SiteContent;
  loading: boolean;
  refreshContent: () => Promise<void>;
  updateContent: (newContent: Partial<SiteContent>) => Promise<{ success: boolean; error?: string }>;
}

const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider({
  children,
  initialContent
}: {
  children: React.ReactNode;
  initialContent?: SiteContent;
}) {
  const [content, setContent] = useState<SiteContent>(initialContent || getInitialContent());
  const [loading, setLoading] = useState(false);

  const fetchLiveContent = async () => {
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.content) {
          setContent(data.content);
        }
      }
    } catch (e) {
      console.error("Failed to fetch live content:", e);
    }
  };

  useEffect(() => {
    fetchLiveContent();
    const handleUpdate = () => {
      fetchLiveContent();
    };
    window.addEventListener("site-content-updated", handleUpdate);
    return () => window.removeEventListener("site-content-updated", handleUpdate);
  }, []);

  const updateContent = async (newContent: Partial<SiteContent>) => {
    setLoading(true);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContent)
      });
      const data = await res.json();
      if (data.success && data.content) {
        setContent(data.content);
        window.dispatchEvent(new CustomEvent("site-content-updated"));
        return { success: true };
      }
      return { success: false, error: data.error || "فشل التحديث" };
    } catch (err: unknown) {
      return { success: false, error: "تعذر الاتصال بالخادم" };
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        loading,
        refreshContent: fetchLiveContent,
        updateContent
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    return {
      content: getInitialContent(),
      loading: false,
      refreshContent: async () => {},
      updateContent: async () => ({ success: false, error: "فشل التحديث" })
    };
  }
  return ctx;
}
