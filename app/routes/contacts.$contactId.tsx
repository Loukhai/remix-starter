import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  isRouteErrorResponse,
  useRouteError,
  Outlet,
  useFetcher,
} from "@remix-run/react";
import { FunctionComponent } from "react";
import invariant from "tiny-invariant";
import { ContactRecord, getContact, updateContact } from "~/data";

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

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { contactId } = params;
  invariant(contactId, "Missing contactId param");

  const formData = await request.formData();
  const favoriteUpdate = Object.fromEntries(formData);

  return updateContact(contactId, {
    favorite: favoriteUpdate?.favorite === "true",
  });
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
      <Outlet />
    </div>
  );
}

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
  // const favorite = contact.favorite;
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
};

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>hey rabia loukhai</h1>
        <p>no contact found</p>
        <h1>message</h1>
        <pre>data:{error.data}</pre>
        <pre>status:{error.status}</pre>
        <pre>statusText:{error.statusText}</pre>
      </div>
    );
  }
}
