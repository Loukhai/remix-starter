import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import invariant from "tiny-invariant";
import { deleteContact } from "~/data";

export const action = async ({ params }: ActionFunctionArgs) => {
  const { contactId } = params;
  invariant(contactId, "Missing ContactId param");

  await deleteContact(contactId);

  return redirect("/");
};
