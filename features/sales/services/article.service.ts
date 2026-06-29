export async function getArticleByCode(code: string) {
  const response = await fetch(`/api/articles/code/${code}`);

  if (!response.ok) {
    return null;
  }

  return response.json();
}