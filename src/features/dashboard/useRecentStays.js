import { useSearchParams } from "react-router-dom";
import { getStaysAfterDate } from "../../services/apiBookings";
import { subDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";

function useRecentStays() {
  const [searchParams] = useSearchParams();
  const numDays = searchParams.get("last") ? +searchParams.get("last") : 7;
  const queryDate = subDays(new Date(), numDays).toISOString();
  const { isLoading, data: stays } = useQuery({
    queryFn: () => getStaysAfterDate(queryDate),
    queryKey: ["stays", `last-${numDays}`],
  });

  const confirmedStays = stays?.filter(
    (stay) => stay.status === "checked-in" || stay.status === "checked-out"
  );

  return { isLoading, stays, confirmedStays };
}

export default useRecentStays;
