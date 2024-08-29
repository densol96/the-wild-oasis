import { useState } from "react";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateCabinForm from "./CreateCabinForm";

function AddCabin() {
  return (
    <Modal>
      <Modal.Open opensWhat="cabin-form">
        <Button>Add new cabin</Button>
      </Modal.Open>
      <Modal.Window name="cabin-form">
        <CreateCabinForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddCabin;

// function AddCabin() {
//   const [showModal, setShowModal] = useState(false);
//   return (
//     <>
//       <Button onClick={() => setShowModal(!showModal)}>Add new cabin</Button>
//       {showModal && (
//         <Modal onClose={() => setShowModal(false)}>
//           <CreateCabinForm closeForm={() => setShowModal(false)} />
//         </Modal>
//       )}
//     </>
//   );
// }
