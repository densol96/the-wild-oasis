import { useState } from "react";
import styled from "styled-components";
import { HiPencil, HiTrash } from "react-icons/hi";
import { HiSquare2Stack } from "react-icons/hi2";

import CreateCabinForm from "./CreateCabinForm";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Menus from "../../ui/Menus";

import useDeleteCabin from "./useDeleteCabin";
import useCreateCabin from "./useCreateCabin";
import { formatCurrency } from "../../utils/helpers";
import { supabaseUrl } from "../../services/supabase";
import Table from "../../ui/Table";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

function CabinRow({ cabin }) {
  const {
    id: cabinId,
    name,
    maxCapacity,
    regularPrice,
    discount,
    image,
    description,
  } = cabin;

  const { isDeleteting, deleteCabin } = useDeleteCabin();
  const { isCreating, createCabin } = useCreateCabin();
  const isWorking = isDeleteting || isCreating;

  function duplicateCabin() {
    createCabin({
      name: "Copy of " + name,
      maxCapacity,
      regularPrice,
      discount,
      image,
      description,
    });
  }

  return (
    <>
      <Table.Row>
        <Img
          src={
            image ||
            `${supabaseUrl}/storage/v1/object/public/cabin-images/no-image.svg`
          }
        />
        <Cabin>{name}</Cabin>
        <div>Fits up to {maxCapacity} guests</div>
        <Price>{formatCurrency(regularPrice)}</Price>
        <Discount>
          {discount ? formatCurrency(discount) : <>&mdash;</>}
        </Discount>
        <div>
          {/* <button disabled={isWorking} onClick={() => duplicateCabin()}>
            <HiSquare2Stack />
          </button>
          <Modal>
            <Modal.Open opensWhat="edit-form">
              <button disabled={isWorking}>
                <HiPencil />
              </button>
            </Modal.Open>
            <Modal.Window name="edit-form">
              <CreateCabinForm />
            </Modal.Window>
            <Modal.Open opensWhat="delete-form">
              <button disabled={isWorking}>
                <HiTrash />
              </button>
            </Modal.Open>
            <Modal.Window name="delete-form">
              <ConfirmDelete
                disabled={isWorking}
                resourceName="cabin"
                onConfirm={() => deleteCabin(cabinId)}
              />
            </Modal.Window>
          </Modal> */}

          <Menus.Menu>
            <Menus.Toggle id={cabinId} />

            <Menus.List id={cabinId}>
              <button disabled={isWorking} onClick={() => duplicateCabin()}>
                <Menus.Button>Duplicate</Menus.Button>
              </button>
              <Modal>
                <Modal.Open opensWhat="edit-form">
                  <button disabled={isWorking}>
                    <Menus.Button>Edit</Menus.Button>
                  </button>
                </Modal.Open>
                <Modal.Window name="edit-form">
                  <CreateCabinForm />
                </Modal.Window>
                <Modal.Open opensWhat="delete-form">
                  <button disabled={isWorking}>
                    <Menus.Button>Delete</Menus.Button>
                  </button>
                </Modal.Open>
                <Modal.Window name="delete-form">
                  <ConfirmDelete
                    disabled={isWorking}
                    resourceName="cabin"
                    onConfirm={() => deleteCabin(cabinId)}
                  />
                </Modal.Window>
              </Modal>
            </Menus.List>
          </Menus.Menu>
        </div>
      </Table.Row>
    </>
  );
}

export default CabinRow;
