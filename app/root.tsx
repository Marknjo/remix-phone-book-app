import { type LinksFunction, json } from '@remix-run/node';
import {
  Form,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';

import appStyles from './app.css';
import { createEmptyContact, getContacts } from './data';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: appStyles,
    },
  ];
};

export const action = async () => {
  const contact = await createEmptyContact();
  return json({ contact });
};

export const loader = async () => {
  const contacts = await getContacts();

  return json({ contacts });
};
export default function App() {
  const { contacts } = useLoaderData<typeof loader>();

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <div id='sidebar'>
          <h1>Remix Contacts</h1>
          <div>
            <Form id='search-form' role='search'>
              <input
                id='q'
                aria-label='Search contacts'
                placeholder='Search'
                type='search'
                name='q'
              />
              <div id='search-spinner' aria-hidden hidden={true} />
            </Form>
            <Form method='post'>
              <button type='submit'>New</button>
            </Form>
          </div>
          <nav>
            {contacts?.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <NavLink
                      to={`contacts/${contact.id}`}
                      className={({ isActive, isPending }) =>
                        isActive ? 'active' : isPending ? 'pending' : ''
                      }>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{' '}
                      {contact.favorite ? <span>★</span> : null}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>

        <main id='detail'>
          <Outlet />
        </main>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
