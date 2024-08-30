import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateSetting as updateSettingApi } from "../../services/apiSettings";
import toast from "react-hot-toast";

function useUpdateSetting() {
  const queryClient = useQueryClient();

  const { mutate: updateSetting, isLoading: isUpdating } = useMutation({
    mutationFn: updateSettingApi,
    onSuccess: () => {
      toast.success(`Setting has been updated!`);
      queryClient.invalidateQueries({
        queryKey: ["settings"],
      });
    },
    onError: (e) => toast.error(e.message),
  });

  return { isUpdating, updateSetting };
}

export default useUpdateSetting;
