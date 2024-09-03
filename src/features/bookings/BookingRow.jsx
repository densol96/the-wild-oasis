import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { HiEye, HiTrash } from "react-icons/hi";
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiSquare2Stack,
} from "react-icons/hi2";
import toast from "react-hot-toast";

import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";

import useDeleteBooking from "./useDeleteBooking";
import useCheckout from "../../features/check-in-out/useCheckout";
import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";
import { format, isToday } from "date-fns";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { RESULTS_PER_PAGE } from "../../utils/constants";

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

function BookingRow({
  booking: {
    id: bookingId,
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    totalPrice,
    status,
    guests: { fullName: guestName, email },
    cabins: { name: cabinName },
  },
  count,
}) {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page") || 1;
  const goToPreviousPageAfterDelete =
    count - (currentPage - 1) * RESULTS_PER_PAGE === 1 && currentPage > 1;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  const { checkout, isCheckingOut } = useCheckout();
  const { isDeleting, deleteBooking } = useDeleteBooking();
  const isProcessing = isCheckingOut || isDeleting;

  return (
    <Table.Row>
      <Cabin>{cabinName}</Cabin>

      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      <Stacked>
        <span>
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}{" "}
          &rarr; {numNights} night stay
        </span>
        <span>
          {format(new Date(startDate), "MMM dd yyyy")} &mdash;{" "}
          {format(new Date(endDate), "MMM dd yyyy")}
        </span>
      </Stacked>

      <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>

      <Amount>{formatCurrency(totalPrice)}</Amount>

      <Menus.Menu>
        <Modal>
          <Menus.Toggle id={bookingId} />
          <Menus.List id={bookingId}>
            <Menus.Button
              onClick={() => navigate(`/bookings/${bookingId}`)}
              icon={<HiEye />}
            >
              See details
            </Menus.Button>
            {status === "unconfirmed" && (
              <Menus.Button
                onClick={() => navigate(`/checkin/${bookingId}`)}
                icon={<HiArrowDownOnSquare />}
              >
                Check in
              </Menus.Button>
            )}
            {status === "checked-in" && (
              <Menus.Button
                onClick={() => checkout(bookingId)}
                icon={<HiArrowUpOnSquare />}
                disabled={isProcessing}
              >
                Check out
              </Menus.Button>
            )}
            <Modal.Open opensWhat="delete">
              <Menus.Button icon={<HiTrash />} disabled={isProcessing}>
                Delete booking
              </Menus.Button>
            </Modal.Open>
          </Menus.List>
          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="booking"
              disabled={isDeleting}
              onConfirm={() =>
                deleteBooking(bookingId, {
                  onSuccess: () => {
                    if (goToPreviousPageAfterDelete) {
                      // navigate(`/bookings?page=${currentPage - 1}`);
                      searchParams.set("page", currentPage - 1);
                      setSearchParams(searchParams);
                    }
                  },
                })
              }
            />
          </Modal.Window>
        </Modal>
      </Menus.Menu>
    </Table.Row>
  );
}

export default BookingRow;
