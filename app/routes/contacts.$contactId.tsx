import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';

import Favorite from '~/components/Favorite';
import { getContact, updateContact } from '~/data';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param');

  const formData = await request.formData();

  return updateContact(params.contactId, {
    favorite: formData.get('favorite') === 'true',
  });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param');

  const contact = await getContact(params.contactId);

  if (!contact) {
    throw new Response('Not found', { status: 404, statusText: 'Not Found' });
  }

  return json({ contact });
};

export default function Contact() {
  const { contact } = useLoaderData<typeof loader>();

  return (
    <section id='contact'>
      <div>
        <img
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{' '}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter ? (
          <p>
            <a href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        ) : null}

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
                'Please confirm you want to delete this record.'
              );
              if (!response) {
                event.preventDefault();
              }
            }}>
            <button type='submit'>Delete</button>
          </Form>
        </div>
      </div>
    </section>
  );
}
