import ArticleManager from "@/features/articles/components/ArticleManager";

export default function ArticlesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Artículos
      </h1>

      <ArticleManager />
    </div>
  );
}