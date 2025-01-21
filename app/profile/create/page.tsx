import Form from "@/app/ui/create-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data";

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Profile", href: "/profile" },
          {
            label: "Create or Edit Profile",
            href: "/profile/create",
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
