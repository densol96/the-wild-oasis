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
  const errorMessage =
    error?.message === "Invalid page number."
      ? error?.message + " You are being redirected to the 1st page."
      : error?.message;
  useEffect(() => {
    let timeourId;
    if (error?.message === "Invalid page number.") {
      timeourId = setTimeout(() => {
        searchParams.set("page", 1);
        setSearchParams(searchParams);
      }, 3000);
    }
    return () => clearTimeout(timeourId);
  }, [error]);

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
