import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

import useUser from "./useUser";
import useLogout from "./useLogout";
import useUpdateUser from "./useUpdateUser";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

function UpdatePasswordForm() {
  const { register, handleSubmit, formState, getValues, reset } = useForm();
  const { errors } = formState;
  const { updateUser, isUpdating } = useUpdateUser();
  const { logout, isLoggingOut } = useLogout();

  function onSubmit({ password }) {
    updateUser(
      { password },
      {
        onSuccess: () => {
          toast.success(
            "Password has been successfully changed! You wil be redirected to login page now!"
          );
          setTimeout(() => {
            logout();
          }, 1500);
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          disabled={isUpdating}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Confirm password"
        error={errors?.passwordConfirm?.message}
      >
        <Input
          type="password"
          autoComplete="new-password"
          id="passwordConfirm"
          disabled={isUpdating}
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value) =>
              getValues().password === value || "Passwords need to match",
          })}
        />
      </FormRow>
      <FormRow>
        <Button
          onClick={reset}
          type="reset"
          variation="secondary"
          disabled={isUpdating}
        >
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update password</Button>
      </FormRow>
    </Form>
  );
}

export default UpdatePasswordForm;
