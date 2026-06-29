import ArticleQRCode from "@/features/articles/components/ArticleQRCode";

export default function QRTestPage() {
  return (
    <div className="p-8">

      <ArticleQRCode
        code="1001"
      />

    </div>
  );
}