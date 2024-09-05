import supabase, { supabaseUrl } from "./supabase";

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function signup({ email, password, fullName }) {
  let { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({ password, fullName, avatar, email }) {
  let updateData;
  if (password) updateData = { password };
  else {
    // Hanle AVATAR and fullName
    // Emails are unqiue => usefull to use them to identify an avatar
    if (avatar) {
      const { data, error: storageError } = await supabase.storage
        .from("avatars")
        .upload(email, avatar, {
          upsert: true,
        });
      if (!storageError)
        // await supabase.auth.updateUser({ data: { avatar: true } });
        updateData = { data: { avatar: true } };
      else throw storageError;
    } else {
      const { data, error } = await supabase.storage
        .from("avatars")
        .remove(email, avatar);
      updateData = { data: { avatar: false } };
    }
    updateData.data.fullName = fullName;
  }
  const { error, data: updatedUser } = await supabase.auth.updateUser(
    updateData
  );
  if (error) throw new Error(error.message);
  return updatedUser;
}
