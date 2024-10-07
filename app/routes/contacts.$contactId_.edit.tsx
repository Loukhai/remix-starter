import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getContact, updateContact } from "~/data";

// load the data of contact
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { contactId } = params;
  invariant(contactId, "Missing contactId param");

  const contact = await getContact(contactId);
  if (!contact) throw new Response("contact not found", { status: 404 });

  return { contact };
};

// post the new updated contact info
export const action = async ({ params, request }: ActionFunctionArgs) => {
  // should target new update data user
  const { contactId } = params;
  // throw an error if params not exist
  invariant(contactId, "Missing contactId params");
  // get all fields data posted
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  // pass the data to the target contact
  await updateContact(contactId, updates);
  // redirect the page to specific route
  return redirect(`/contacts/${contactId}/edit`);
};

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form key={contact.id} id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          aria-label="First name"
          defaultValue={contact.first}
          name="first"
          placeholder="First"
          type="text"
        />
        <input
          aria-label="Last name"
          defaultValue={contact.last}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea defaultValue={contact.notes} name="notes" rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </p>
    </Form>
  );
}
