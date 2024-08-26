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

import useImageFilePreload from "./useImageFilePreload";
import useCreateCabin from "./useCreateCabin";
import useEditCabin from "./useEditCabin";

const FormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;

  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

function CreateCabinForm({ cabin, closeForm }) {
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
      <FormRow>
        <Label htmlFor="name">Cabin name</Label>
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

      <FormRow>
        <Label htmlFor="maxCapacity">Maximum capacity</Label>
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

      <FormRow>
        <Label htmlFor="regularPrice">Regular price</Label>
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

      <FormRow>
        <Label htmlFor="discount">Discount</Label>
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

      <FormRow>
        <Label htmlFor="description">Description for website</Label>
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

      <FormRow>
        <Label htmlFor="image">Cabin photo</Label>
        <FileInput
          id={inputFieldUniqueId}
          accept="image/*"
          {...register("image")}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          onClick={closeForm}
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
