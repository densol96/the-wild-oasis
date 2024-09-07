import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import Spinner from "../../ui/Spinner";
import useBookings from "./useBookings";
import Pagination from "../../ui/Pagination";
import { useEffect } from "react";

function BookingTable() {
  const { isLoading, bookings, errorMessage, count, isError } = useBookings();
  /*
   * If case of an error due to invalid pageNum, "redirection to page 1" logic is encapsulated inside the custom hook.
   * Here - simply prop-drill errorMessage to the Table for proper display before 3s timeout before re-fetching data for page 1.
   */

  if (isLoading) return <Spinner />;

  console.log(errorMessage, bookings);

  return (
    <Menus>
      <Table error={errorMessage} columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={bookings}
          render={(booking) => (
            <BookingRow count={count} key={booking.id} booking={booking} />
          )}
        />
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default BookingTable;
