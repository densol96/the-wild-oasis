import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function deleteCabin(id) {
  const throwable = new Error(
    "Sorry, cabin could not be deleted! Try again later!"
  );

  const { error: fetchError, data: fetchedData } = await supabase
    .from("cabins")
    .select()
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error(
      "deleteCabin --> unable to retrieve the cabin -> ",
      fetchError
    );
    throw throwable;
  }

  const { error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) {
    console.error("deleteCabin --> unable to delete the cabin -> ", error);
    throw throwable;
  }

  if (!fetchedData.image) return;

  const { error: errorOnDeletingImageFromStorage, data: deletedImage } =
    await supabase.storage
      .from("cabin-images")
      .remove([fetchedData.image.split("/").at(-1)]);

  if (error) {
    console.error(
      "Error deleting the image file in the bucket:",
      errorOnDeletingImageFromStorage
    );
  }
}

export async function createCabin(newCabin) {
  const throwable = new Error("Cabin could not be created");

  // Could be not probided as image is not required => newCabin.image could be undefined
  const imageName = `${Math.random()}-${newCabin.image?.name}`.replaceAll(
    "/",
    ""
  );
  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  const { error, data } = await supabase
    .from("cabins")
    .insert([{ ...newCabin, image: newCabin.image ? imagePath : null }]);

  if (error) {
    console.error("Unable to save a cabin to DB -> ", error);
    throw throwable;
  }

  if (!newCabin.image) return;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  if (storageError) {
    console.log("Cabin-image could not be uploaded: ", storageError);
    deleteCabin(data.id);
    throw throwable;
  }
}

export async function updateCabin(oldCabin, newCabin) {
  let imageName = null;
  let imageNameToBeDeletedFromStorage = null;

  /* COMMENT 1.1
   * oldCabin.image format is https://supabaseUrl/pathToBucket/cabin-images/IMAGE_NAME
   * newCabin.image is a File with meta-data (name === IMAGE_NAME) if not re-uploaded / deleted
   */

  if (
    oldCabin.image == newCabin.image || // in case remains NULL (== undefined)
    oldCabin.image?.endsWith(newCabin.image?.name) // see COMMENT 1.1 also possible that either new or old was changed to NULL => safer to use ?.
  ) {
    // Keep it the same if the image was not re-uploaded / deleted / changed from null
    imageName = newCabin.image?.name || null;
  } else {
    // Else we need to upload a new image and delete IF the old one was a picture and NOT NULL
    imageName = `${Math.random()}-${newCabin.image?.name}`.replaceAll("/", "");
    imageNameToBeDeletedFromStorage = oldCabin.image?.split("/")?.at(-1); // if null => ?. will result in undefined, if not need to extract IMAGE_NAME from full URL
  }

  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  const { error, data } = await supabase
    .from("cabins")
    .update({ ...newCabin, image: newCabin.image ? imagePath : null })
    .eq("id", oldCabin.id);

  if (error) {
    console.error("Unable to write changes to DB -> ", error);
    throw new Error("Cabin could not be updated");
  }

  if (newCabin.image) {
    const { error: duplicateImage } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, newCabin.image);

    if (duplicateImage) {
      // In case the image is the same as the last one (Math.random() + imageName remained the same => exactly the same picture) => no need to deleted it
      imageNameToBeDeletedFromStorage = undefined;
    }
  }

  if (imageNameToBeDeletedFromStorage) {
    const { error: errorOnDeletingImageFromStorage, data: deletedImage } =
      await supabase.storage
        .from("cabin-images")
        .remove([imageNameToBeDeletedFromStorage]);

    if (error) {
      // If there is a technical problem with cleaning up a bucker, just log the error
      console.log(
        "Error deleting old image file:",
        errorOnDeletingImageFromStorage
      );
    }
  }
}
