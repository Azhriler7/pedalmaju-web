const placeholderThread = {
  title: "Cara Kalibrasi Sensor pH Tanah",
  author: "Dwi AgroTech",
  body:
    "Bagikan langkah-langkah kalibrasi sensor pH yang kamu gunakan. Apakah ada tips menjaga kestabilan pembacaan di lahan basah?",
  replies: [
    {
      id: 1,
      author: "Maya Hydro",
      body:
        "Saya biasa merendam sensor dalam larutan buffer 4 dan 7 setiap minggu. Pastikan juga sensor bersih dari endapan lumpur sebelum kalibrasi.",
    },
    {
      id: 2,
      author: "Surya FieldLab",
      body:
        "Kami menambahkan pengecekan tegangan suplai ke sensor karena fluktuasi listrik bikin data melenceng.",
    },
  ],
};

export default function ForumThreadPage({
  params,
}: {
  params: { threadId: string };
}) {
  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/60">
          Diskusi #{params.threadId}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {placeholderThread.title}
        </h1>
        <span className="text-sm text-foreground/70">
          Dibuka oleh {placeholderThread.author}
        </span>
      </header>

      <article className="rounded-2xl border border-border bg-background/90 p-6 text-sm leading-relaxed text-foreground/80 shadow-sm dark:border-white/10">
        {placeholderThread.body}
      </article>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Balasan</h2>
        {placeholderThread.replies.map((reply) => (
          <div
            key={reply.id}
            className="rounded-2xl border border-border bg-background/90 p-5 text-sm leading-relaxed text-foreground/80 shadow-sm dark:border-white/10"
          >
            <p className="font-semibold text-foreground">{reply.author}</p>
            <p className="mt-2 text-foreground/80">{reply.body}</p>
          </div>
        ))}
      </section>
    </section>
  );
}
