import styled from "styled-components";

import Spinner from "../../ui/Spinner";
import Stats from "./Stats";

import useRecentBookings from "./useRecentBookings";
import useRecentStays from "./useRecentStays";
import useCabins from "../cabins/useCabins";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const {
    isLoading: isLoadingBookings,
    bookings,
    numDays,
  } = useRecentBookings();
  const { isLoading: isLoadingStays, stays, confirmedStays } = useRecentStays();
  const { cabins, isLoading: isLoadingCabins } = useCabins();
  const isLoading = isLoadingBookings || isLoadingStays || isLoadingCabins;

  if (isLoading) return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings}
        confirmedStays={confirmedStays}
        numDays={numDays}
        cabinCount={cabins.length}
      />
      <div>Today&apos;s activity</div>
      <div>Chart stay durations</div>
      <div>Chart sales</div>
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
