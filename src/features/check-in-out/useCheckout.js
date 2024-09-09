import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function useCheckout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: checkout, isLoading: isCheckingOut } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked out`);
      queryClient.invalidateQueries({
        active: true,
      });
    },
    onError: (e) => {
      console.log(e);
      toast.error("There was a problem while checkin out");
    },
  });

  return { checkout, isCheckingOut };
}

export default useCheckout;
