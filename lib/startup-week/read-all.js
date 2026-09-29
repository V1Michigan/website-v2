// Page through every row, including projects with a server-side cap below 500.
// Each caller supplies a fresh query; the primary-key order makes paging stable.
export async function readAll(query) {
  const rows = [];
  for (;;) {
    const { data, error } = await query().order("id").range(rows.length, rows.length + 499);
    if (error) return { data: null, error };
    if (!data?.length) return { data: rows, error: null };
    rows.push(...data);
  }
}
