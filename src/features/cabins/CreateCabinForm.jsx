import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

import useImageFilePreload from "./useImageFilePreload";
import useCreateCabin from "./useCreateCabin";
import useEditCabin from "./useEditCabin";

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

function CreateCabinForm({ cabin, onCloseModal }) {
  const { register, handleSubmit, reset, getValues, formState, setValue } =
    useForm({
      defaultValues: cabin || {},
    });
  const { errors } = formState;

  const { inputFieldUniqueId } = useImageFilePreload(cabin, setValue);
  const { isCreating, createCabin } = useCreateCabin(reset);
  const { isUpdating, updateCabin } = useEditCabin(reset);

  const isSubmitting = isCreating || isUpdating;

  function submit(data) {
    if (!cabin) createCabin({ ...data, image: data.image[0] });
    else
      updateCabin({
        oldCabin: cabin,
        newCabin: { ...data, image: data.image[0] },
      });
  }

  // function ifNotPassedValidation(errors) {} // optional
  return (
    <Form onSubmit={handleSubmit(submit)}>
      <FormRow label="Cabin name">
        <Input
          type="text"
          id="name"
          {...register("name", {
            required: "Please enter a cabin name",
            minLength: {
              value: 3,
              message: "Name must be at least 3 characters long",
            },
          })}
        />
        {errors?.name?.message && <Error>{errors?.name?.message}</Error>}
      </FormRow>

      <FormRow label="Maximum capacity">
        <Input
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "Please enter a cabin capacity",
            min: { value: 1, message: "Capacity must be a positive number" },
          })}
        />
        {errors?.maxCapacity?.message && (
          <Error>{errors?.maxCapacity?.message}</Error>
        )}
      </FormRow>

      <FormRow label="Regular price">
        <Input
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "Please enter a cabin price",
            min: { value: 1, message: "Price must be a positive number" },
          })}
        />
        {errors?.regularPrice?.message && (
          <Error>{errors?.regularPrice?.message}</Error>
        )}
      </FormRow>

      <FormRow label="Discount">
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "Please enter a cabin discount",
            validate: (value) =>
              +value <= +getValues().regularPrice ||
              "Discount should be less than regular price",
          })}
        />
        {errors?.discount?.message && (
          <Error>{errors?.discount?.message}</Error>
        )}
      </FormRow>

      <FormRow label="Description for website">
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          {...register("description", {
            required: "Please enter a description for website",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters long",
            },
          })}
        />
        {errors?.description?.message && (
          <Error>{errors?.description?.message}</Error>
        )}
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput
          id={inputFieldUniqueId}
          accept="image/*"
          {...register("image")}
        />
      </FormRow>

      <FormRow>
        <Button
          onClick={() => onCloseModal?.()}
          disabled={isSubmitting}
          variation="secondary"
          type="button"
        >
          Cancel
        </Button>
        <Button>{!cabin ? `Create cabin` : `Edit cabin`}</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
