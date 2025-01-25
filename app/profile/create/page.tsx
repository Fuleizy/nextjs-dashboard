import Form from "@/app/ui/create-user-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchSkills } from "@/app/lib/data";

export default async function Page() {
  const skills = await fetchSkills();

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
      <Form skills={skills} />
    </main>
  );
}
