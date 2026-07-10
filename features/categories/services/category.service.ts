export async function getCategories(
  companyId: number
) {

  const response =
    await fetch(

      `/api/categories?companyId=${companyId}`

    );

  if (!response.ok) {

    throw new Error();

  }

  return response.json();

}