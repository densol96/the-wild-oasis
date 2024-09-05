import { useEffect, useRef, useState } from "react";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

import useUser from "./useUser";
import { useForm } from "react-hook-form";
import useUpdateUser from "./useUpdateUser";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { supabaseUrl } from "../../services/supabase";
import useImageFilePreload from "../cabins/useImageFilePreload";

function UpdateUserDataForm() {
  // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
  const { user } = useUser();
  const {
    email,
    user_metadata: { fullName: currentFullName, avatar: currentAvatar },
  } = user;
  const { register, handleSubmit, reset, getValues, formState, setValue } =
    useForm({
      defaultValues: { fullName: currentFullName },
    });

  const { updateUser, isUpdating } = useUpdateUser();
  const queryClient = useQueryClient();

  function update({ fullName, avatar }) {
    /* Avatar here is the FileList.
     *  Email needed as a part of avatarName in a bucket (since email is unique, we can use it to overwrite the existing avatar
     * and not worry about the logic to handle deleting the existing/unused images as in cabins )
     */
    updateUser(
      { fullName, avatar: avatar[0], email },
      {
        onSuccess: () => {
          toast.success("Your account details have been updated!");
          queryClient.invalidateQueries("user");
        },
      }
    );
  }

  const { inputFieldUniqueId } = useImageFilePreload(
    {
      image: currentAvatar
        ? `${supabaseUrl}/storage/v1/object/public/avatars/${email}`
        : undefined,
      setValue,
    },
    setValue,
    "Current file present"
  );

  return (
    <Form onSubmit={handleSubmit(update)}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          id="fullName"
          disabled={isUpdating}
          {...register("fullName", {
            required: "Please enter your full name",
          })}
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          id={inputFieldUniqueId}
          accept="image/*"
          disabled={isUpdating}
          {...register("avatar")}
        />
      </FormRow>
      <FormRow>
        <Button type="reset" variation="secondary" disabled={isUpdating}>
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
