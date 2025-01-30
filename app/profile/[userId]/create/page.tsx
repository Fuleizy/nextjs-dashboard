import Form from "@/app/ui/create-user-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchSkills } from "@/app/lib/data";
import { getUser } from '@/app/lib/actions';

export default async function Page(props: { params: Promise<{ userId: string }> }) {
  const skills = await fetchSkills();
  const params = await props.params;
  const id = params.userId;
  const decodedUserId = decodeURIComponent(id);
  const user = await getUser(decodedUserId);
  // const username = user?.name ? user.name : "unknown";

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Profile", href: `/profile/${id}` },
          {
            label: "Create or Edit Profile",
            href: `/profile/${id}/create`,
            active: true,
          },
        ]}
      />
      <Form skills={skills} user={user} />
    </main>
  );
}
