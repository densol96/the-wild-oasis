import { useSearchParams } from "react-router-dom";
import { getBookingsAfterDate } from "../../services/apiBookings";
import { subDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";

function useRecentBookings() {
  const [searchParams] = useSearchParams();
  const numDays = searchParams.get("last") ? +searchParams.get("last") : 7;
  const queryDate = subDays(new Date(), numDays).toISOString();
  const { isLoading, data: bookings } = useQuery({
    queryFn: () => getBookingsAfterDate(queryDate),
    queryKey: ["bookings", `last-${numDays}`],
  });

  return { isLoading, bookings, numDays };
}

export default useRecentBookings;
