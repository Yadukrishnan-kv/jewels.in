import { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import Reveal from "../../components/site/Reveal.jsx";
import { PageSpinner } from "../../components/site/Skeletons.jsx";

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

      <div className="border-y border-border/60 bg-white/50">
        <div className="max-w-container mx-auto px-5 md:px-8 py-10 md:py-14">
          <span className="eyebrow">Information</span>
          <h1 className="section-title mt-4">{page?.title || "…"}</h1>
        </div>
      </div>

      <div className="max-w-[860px] mx-auto px-5 md:px-8 py-12 md:py-20">
        {error && (
          <Reveal className="text-center border border-dashed border-border/80 bg-white/50 py-16 px-6">
            <i className="fa-regular fa-file-lines text-2xl mb-4 block text-primary/25" />
            <p className="micro text-primary/35 mb-2">Empty page</p>
            <p className="text-primary/55">This page hasn&apos;t been set up yet.</p>
          </Reveal>
        )}
        {!page && !error && <PageSpinner label="Loading page..." />}
        {page && (
          <Reveal>
            <div className="site-prose" dangerouslySetInnerHTML={{ __html: page.contentHtml }} />
          </Reveal>
        )}
      </div>
    </div>
  );
}
