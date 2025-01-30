"use server";

import bcrypt from 'bcrypt';
import { z } from "zod";
import { createClient } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { db } from '@vercel/postgres';
import { users } from '../lib/placeholder-data';
import { v4 as uuidv4 } from 'uuid';
// import { usePathname } from 'next/navigation'

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

const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  username: z.string().nonempty({ message: "Username cannot be empty" }),
  // birthday: z.string().refine(date => date !== '', { message: "Please select a valid date" })
});

export async function signUp(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const parsedData = signUpSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      username: formData.get("username"),
      // birthday: formData.get("birthday")
    });

    if (!parsedData.success) {
      console.log("Validation errors:", parsedData.error.errors);
      return;
    }

    // const { email, password, username, birthday } = parsedData.data;
    // console.log("Validated data:", { email, password, username, birthday });
    const { email, password, username } = parsedData.data;
    console.log("Validated data:", { email, password, username });

    // Proceed with the sign-up logic
    const client = await db.connect();

    async function createUser(email: string, password: string, username: string) {
      console.log("Starting createUser...");
      try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
        await client.sql`
          CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
          );
      `;

        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertedUser = await client.sql`
          INSERT INTO users (id, name, email, password)
          VALUES (${userId}, ${username}, ${email}, ${hashedPassword})
          ON CONFLICT (id) DO NOTHING;
        `;

        // const insertedUsers = await Promise.all(
        //   users.map(async (user) => {
        //     const hashedPassword = await bcrypt.hash(user.password, 10);
        //     return client.sql`
        //       INSERT INTO users (id, name, email, password)
        //       VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        //       ON CONFLICT (id) DO NOTHING;
        //   `;
        //   }),
        // );

        console.log("insertedUser", insertedUser);
        console.log("users created successfully!");

        return insertedUser;
      } catch (error) {
        await client.sql`ROLLBACK`;
        console.error("Failed to create user:", error);
        return Response.json({ error }, { status: 500 });
      }
    }

    console.log("createUser", email, password, username);
    createUser(email, password, username);








  } catch (error) {
    console.error("Error during sign-up:", error);
    return "Something went wrong.";
  }
  revalidatePath("/login");
  redirect("/login");
}

// export async function signUp(
//   prevState: string | undefined,
//   formData: FormData
// ) {
//   try {
//     // await signIn("credentials", formData);
//     console.log("formData", formData);
//     console.log("formData.get('email')", formData.get("email"));



//     // TODO: see if we can use the zod library to validate the form data
//     // const parsedCredentials = z
//     //   .object({ email: z.string().email(), password: z.string().min(6) })
//     //   .safeParse(formData);
//     // console.log("parsedCredentials", parsedCredentials);
//     // if (parsedCredentials.success) {
//     //   const { email, password } = parsedCredentials.data;
//     //   console.log("email", email);
//     //   console.log("password", password);
//     //   // const user = await getUser(email);
//     //   // if (!user) return null;
//     //   // const passwordsMatch = await bcrypt.compare(password, user.password);

//     //   // if (passwordsMatch) return user;
//     // }
//   } catch (error) {
//     // await client.sql`ROLLBACK`;
//     // return Response.json({ error }, { status: 500 });
//     console.log("error", error);
//     return "Something went wrong.";
//   }
// }

export async function signUpButton() {
  console.log("Test button clicked");
  redirect('/signup');
}


export async function cancelSignUpButton() {
  console.log("Test button clicked");
  redirect('/login');
}

export async function updateUsers() {
  const client = await db.connect();

  async function seedUsers() {
    try {
      await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
      await client.sql`
          CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
          );
      `;

      const insertedUsers = await Promise.all(
        users.map(async (user) => {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          return client.sql`
              INSERT INTO users (id, name, email, password)
              VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
              ON CONFLICT (id) DO NOTHING;
          `;
        }),
      );

      console.log("insertedUsers", insertedUsers);
      console.log("users created successfully!");

      return insertedUsers;
    } catch (error) {
      await client.sql`ROLLBACK`;
      return Response.json({ error }, { status: 500 });
    }
  }

  seedUsers();

  // try {
  //   await client.sql`BEGIN`;
  //   await seedUsers();
  //   await client.sql`COMMIT`;

  //   return Response.json({ message: 'Database seeded successfully' });
  // } catch (error) {
  //   await client.sql`ROLLBACK`;
  //   return Response.json({ error }, { status: 500 });
  // }
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
