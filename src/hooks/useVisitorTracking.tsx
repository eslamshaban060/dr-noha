import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const getVisitorId = (): string => {
  const key = "visitor_id";
  let visitorId = localStorage.getItem(key);
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(key, visitorId);
  }
  return visitorId;
};

export const useVisitorTracking = (pagePath: string) => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const visitorId = getVisitorId();
        const userAgent = navigator.userAgent;

        await supabase.from("site_visits").insert({
          page_path: pagePath,
          visitor_id: visitorId,
          user_agent: userAgent,
        });
      } catch (error) {
        console.error("Error tracking visit:", error);
      }
    };

    trackVisit();
  }, [pagePath]);
};
