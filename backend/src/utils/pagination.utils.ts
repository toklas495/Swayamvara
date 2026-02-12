// src/utils/pagination.utils.ts
export function paginate(page: number, pageSize: number) {
  const offset = (page - 1) * pageSize;
  return { offset, limit: pageSize };
}
