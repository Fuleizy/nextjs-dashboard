"use server";

import { z } from "zod";
import { createClient } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          console.error(error);
          return "Invalid credentials.";
        default:
          console.error(error);
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

const UserFormSchema = z.object({
  id: z.string(),
  username: z
    .string({ required_error: "Please enter a username" })
    .min(1, { message: "Please enter a username" }),
  birthday: z.date({ invalid_type_error: "Please enter your birthday" }),
  skillId: z.string({
    invalid_type_error: "Please select a skill.",
  }),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  level: z.enum(["Beginner", "Intermediate", "Expert"], {
    invalid_type_error: "Please select your skill level.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

const CreateUser = UserFormSchema.omit({ id: true, date: true });
const UpdateUser = UserFormSchema.omit({ id: true, date: true });

export type UserState = {
  errors?: {
    username?: string[];
    birthday?: string[];
    skillId?: string[];
    level?: string[];
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createUser(prevState: UserState, formData: FormData) {
  const validatedFields = CreateUser.safeParse({
    username: formData.get("username"),
    birthday: formData.get("birthday"),
    skillId: formData.get("skillId"),
    level: formData.get("level"),
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  const client = await createClient();
  await client.connect();
  try {
    await client.sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  } finally {
    client.end();
  }

  revalidatePath("/profile/invoices");
  redirect("/profile/invoices");
}

export async function updateUser(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateUser.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  const client = await createClient();
  await client.connect();

  try {
    await client.sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to Update Invoice.",
    };
  } finally {
    client.end();
  }

  revalidatePath("/profile/invoices");
  redirect("/profile/invoices");
}

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  const client = await createClient();
  await client.connect();
  try {
    await client.sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  } finally {
    client.end();
  }

  revalidatePath("/profile/invoices");
  redirect("/profile/invoices");
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  const client = await createClient();
  await client.connect();

  try {
    await client.sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to Update Invoice.",
    };
  } finally {
    client.end();
  }

  revalidatePath("/profile/invoices");
  redirect("/profile/invoices");
}

export async function deleteInvoice(id: string) {
  const client = await createClient();
  await client.connect();

  try {
    await client.sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to Delete Invoice.",
    };
  } finally {
    client.end();
  }

  revalidatePath("/profile/invoices");
}
