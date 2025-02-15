export async function paginate<T>(
  dbQuery: Promise<T[]>,
  countQuery: Promise<{ count: number }>,
  page: number,
  limit: number
) {
  const [data, totalResult] = await Promise.all([dbQuery, countQuery]);

  const totalItems = totalResult?.count ?? 0;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    meta: {
      page,
      limit,
      totalItems,
      totalPages,
    },
  };
}
