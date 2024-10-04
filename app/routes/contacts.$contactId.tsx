import { LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { FunctionComponent } from "react";
import invariant from "tiny-invariant";
import { ContactRecord, getContact } from "~/data";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { contactId } = params;

  //check the params name if exist
  invariant(contactId, "Missing contactId param");

  const contact = await getContact(contactId);
  //if the contact not founded in data
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }

  //make loader happy 😁
  return { contact };
};

export default function Contact() {
  const { contact } = useLoaderData<typeof loader>();
  // console.log("🚀 ~ Contact ~ contact:", contact);

  return (
    <div id="contact">
      {/* image */}
      <div>
        <img
          src={contact.avatar}
          alt={`${contact.first} ${contact.last}`}
          key={contact.avatar}
        />
      </div>
      {/* full name & fav */}
      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>
        {/* has twitter */}
        {contact.twitter ? (
          <p>
            <a href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        ) : null}
        {/* notes */}
        {contact.notes ? <p>{contact.notes}</p> : null}
        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
  const favorite = contact.favorite;

  return (
    <Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
};
