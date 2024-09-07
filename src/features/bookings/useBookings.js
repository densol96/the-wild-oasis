import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { RESULTS_PER_PAGE } from "../../utils/constants";

function useBookings(field = "status") {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  // FILTER
  const filterValue = searchParams.get(field);
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field, value: filterValue, method: "eq" };

  // SORT BY
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [sortField, sortDirection] = sortByRaw.split("-");
  const sortBy = { sortField, sortDirection };

  // PAGINATION
  const page = +searchParams.get("page") || 1;

  // GET THE DATA
  let {
    isLoading,
    data: { bookings, count } = {},
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page],
    queryFn: () => getBookings({ filter, sortBy, page }),
    retry: 1,
  });

  /*
   * Supabase only triggers an error if we are tring to get >= +2 pages over the existing totalPages.
   * Need to trigger an error when we are 1 page over the limit (in a sorted category).
   * In all => simply keep "No data" (when length === 0 in the table)
   */
  const errorMessage =
    error?.message === "Invalid page number." ||
    (!(!filterValue || filterValue === "all") && bookings?.length === 0)
      ? "Invalid page number. You are being redirected to the 1st page."
      : error?.message;

  useEffect(() => {
    let timeourId;
    if (
      errorMessage ===
      "Invalid page number. You are being redirected to the 1st page."
    ) {
      timeourId = setTimeout(() => {
        searchParams.set("page", 1);
        setSearchParams(searchParams);
      }, 3000);
    }
    return () => clearTimeout(timeourId);
  }, [errorMessage]);

  // PRE-FETCH DATA
  if (page < count / RESULTS_PER_PAGE) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page + 1],
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
    });
  }
  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page - 1],
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
    });
  }

  return { isLoading, bookings, errorMessage, count };
}

export default useBookings;
