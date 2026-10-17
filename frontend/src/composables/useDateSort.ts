// Vue
import { ref } from "vue";

export type DateSortField = "start_date" | "end_date";
export type SortDir = "ASC" | "DESC";

export function useDateSort() {
  const sortBy = ref<DateSortField | "">("");
  const sortDir = ref<SortDir>("ASC");

  function onSort(field: DateSortField) {
    if (sortBy.value !== field) {
      sortBy.value = field;
      sortDir.value = "ASC";
      return;
    }
    if (sortDir.value === "ASC") {
      sortDir.value = "DESC";
      return;
    }
    sortBy.value = "";
    sortDir.value = "ASC";
  }

  function sorted<T extends { start_date: string; end_date: string }>(rows: T[]): T[] {
    if (!sortBy.value) {
      return rows;
    }
    const field = sortBy.value;
    const direction = sortDir.value === "ASC" ? 1 : -1;
    return [...rows].sort((a, b) => a[field].localeCompare(b[field]) * direction);
  }

  return { sortBy, sortDir, onSort, sorted };
}
