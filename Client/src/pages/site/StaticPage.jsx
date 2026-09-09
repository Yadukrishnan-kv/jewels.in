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
      <div className="max-w-3xl mx-auto px-4 md:px-8 pb-16">
        <h1 className="font-serif text-2xl md:text-3xl mb-6">{page?.title || "..."}</h1>
        {error && <p className="text-primary/60">This page hasn&apos;t been set up yet.</p>}
        {page && (
          <div
            className="prose prose-sm max-w-none text-primary/80 leading-relaxed [&_p]:mb-4"
            dangerouslySetInnerHTML={{ __html: page.contentHtml }}
          />
        )}
      </div>
    </div>
  );
}
