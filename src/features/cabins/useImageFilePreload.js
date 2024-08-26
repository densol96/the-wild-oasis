import { useEffect } from "react";

function useImageFilePreload(cabin, setValue) {
  const inputFieldUniqueId = "image" + (cabin ? cabin.id : "");
  useEffect(() => {
    if (cabin) {
      const fileInput = document.querySelector(`#${inputFieldUniqueId}`);
      (async () => {
        const imgUrl = cabin.image;
        const dataTransfer = new DataTransfer();
        if (imgUrl) {
          const response = await fetch(imgUrl);
          const blob = await response.blob();
          const file = new File([blob], imgUrl.split("/").at(-1), {
            type: blob.type,
          });
          dataTransfer.items.add(file);
        }
        setValue("image", dataTransfer.files);
        // this line in requied so "No file chosen" subtitle display the actuall uploaded file
        fileInput.files = dataTransfer.files;
      })();
    }
  }, []);
  return { inputFieldUniqueId };
}

export default useImageFilePreload;
