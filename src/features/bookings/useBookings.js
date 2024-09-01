import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

function useBookings(field = "status") {
  const [searchParams] = useSearchParams();

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
  const {
    isLoading,
    data: bookings,
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy],
    queryFn: () => getBookings({ filter, sortBy }),
  });
  return { isLoading, bookings, error };
}

export default useBookings;
