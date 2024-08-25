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
  const { error: fetchError, data: fetchedData } = await supabase
    .from("cabins")
    .select()
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error(fetchError);
    throw new Error("Cabins could not be deleted");
  }

  const { error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be deleted");
  }

  if (!fetchedData.image) return;

  const { error: errorOnDeletingImageFromStorage, data: deletedImage } =
    await supabase.storage
      .from("cabin-images")
      .remove([fetchedData.image.split("/").at(-1)]);

  if (error) {
    console.error("Error deleting file:", errorOnDeletingImageFromStorage);
    throw new Error("Could not delete file");
  }

  console.log("File deleted successfully:", deletedImage);
}

export async function createCabin(newCabin) {
  const imageName = `${Math.random()}-${newCabin.image?.name}`.replaceAll(
    "/",
    ""
  );

  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  const { error, data } = await supabase
    .from("cabins")
    .insert([{ ...newCabin, image: newCabin.image ? imagePath : null }]);
  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  if (!newCabin.image) return;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  if (storageError) {
    console.log("Cabin-image could not be uploaded: ", storageError);
    deleteCabin(data.id);
  }
}

export async function updateCabin(oldCabin, newCabin) {
  let imageName = null;
  let imageNameToBeDeletedFromStorage = null;

  if (
    oldCabin.image == newCabin.image || // in case remains null
    oldCabin.image?.endsWith(newCabin.image?.name)
  ) {
    // Keep it the same if the image was not re-uploaded / deleted
    imageName = newCabin.image?.name || null;
  } else {
    imageName = `${Math.random()}-${newCabin.image?.name}`.replaceAll("/", "");
    imageNameToBeDeletedFromStorage = oldCabin.image?.split("/")?.at(-1);
  }

  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  const { error, data } = await supabase
    .from("cabins")
    .update({ ...newCabin, image: newCabin.image ? imagePath : null })
    .eq("id", oldCabin.id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be updated");
  }

  // With supabase, apparently, file overwriting in a bucker doesn't work, so I need to delete the old one

  let errorOnDeletingOldImage = false;
  if (imageNameToBeDeletedFromStorage) {
    const { error: errorOnDeletingImageFromStorage, data: deletedImage } =
      await supabase.storage
        .from("cabin-images")
        .remove([imageNameToBeDeletedFromStorage]);

    if (error) {
      /*
       * If for some reson, unable to delete the old image, at this point just log the error out to get fixed later, but since the db has already been
       * updated with a new path to a new image, we need to make sure we actually contiue executing the code and get to uplaod new image
       */
      errorOnDeletingOldImage = true;
      console.log(
        "Error deleting old image file:",
        errorOnDeletingImageFromStorage
      );
    }
  }

  if (newCabin.image) {
    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, newCabin.image);

    if (storageError) {
      /*
       * In case there was an error uploading the new image, but the db was already updated, need to reset to null and display the message to the user
       */
      await supabase
        .from("cabins")
        .update({ image: null })
        .eq("id", oldCabin.id);
      throw new Error("Picture service unavailable, try again later!");
    }
  }
}
