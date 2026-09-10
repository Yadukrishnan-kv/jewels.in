import { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";

export default function StaticPage({ slug }) {
  const [page, setPage] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setPage(null);
    setError(false);
    api
      .get(`/pages/${slug}`)
      .then(setPage)
      .catch(() => setError(true));
  }, [slug]);

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: page?.title || slug }]} />
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pb-16">
        <div className="text-center mb-10">
          <h1 className="relative inline-block font-serif text-2xl md:text-[1.8rem] font-normal tracking-[3px] pb-4 mb-[10px]">
            {page?.title || "..."}
            <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[60px] h-[2px] bg-accent" />
          </h1>
        </div>

        <div className="bg-white border border-border rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] p-5 md:p-7 lg:p-12">
          {error && <p className="text-primary/60">This page hasn&apos;t been set up yet.</p>}
          {page && (
            <div
              className="text-[0.95rem] leading-[1.7] text-[#555] [&_p]:mb-5 [&_h1]:font-serif [&_h1]:text-accent [&_h1]:text-[1.6rem] [&_h1]:my-6 [&_h2]:font-serif [&_h2]:text-accent [&_h2]:text-[1.3rem] [&_h2]:my-6 [&_h3]:font-serif [&_h3]:text-accent [&_h3]:text-[1.1rem] [&_h3]:my-6 [&_ul]:mb-5 [&_ul]:pl-6 [&_ol]:mb-5 [&_ol]:pl-6 [&_li]:mb-2.5 [&_strong]:text-accent [&_a]:text-accent [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: page.contentHtml }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
