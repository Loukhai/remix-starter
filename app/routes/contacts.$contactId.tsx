import { Form } from "@remix-run/react";
import { FunctionComponent } from "react";
import { ContactRecord } from "~/data";

export default function Contact() {
  const contact = {
    first: "Your",
    last: "Name",
    avatar: "https://placecats.com/200/200",
    twitter: "your_handle",
    notes: "Some notes",
    favorite: true,
  };
  return (
    <div id='contact'>
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
          <Form action='edit'>
            <button type='submit'>Edit</button>
          </Form>

          <Form
            action='destroy'
            method='post'
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type='submit'>Delete</button>
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
    <Form method='post'>
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name='favorite'
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
};
