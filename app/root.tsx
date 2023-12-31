import {
  type LinksFunction,
  json,
  type LoaderFunctionArgs,
} from '@remix-run/node';
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
  useNavigation,
  useSubmit,
} from '@remix-run/react';

import appStyles from './app.css';
import { createEmptyContact, getContacts } from './data';
import { useEffect, useState } from 'react';

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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const contacts = await getContacts(q);

  return json({ contacts, q });
};
export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  // the query now needs to be kept in state
  const [query, setQuery] = useState(q || '');

  // we still have a `useEffect` to synchronize the query
  // to the component state on back/forward button clicks
  useEffect(() => {
    setQuery(q || '');
  }, [q]);

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has('q');

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
            <Form
              id='search-form'
              role='search'
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                  replace: !isFirstSearch,
                });
              }}>
              <input
                id='q'
                defaultValue={q || ''}
                aria-label='Search contacts'
                placeholder='Search'
                type='search'
                name='q'
                // synchronize user's input to component state
                onChange={(event) => setQuery(event.currentTarget.value)}
                // switched to `value` from `defaultValue`
                value={query}
                className={searching ? 'loading' : ''}
              />
              <div id='search-spinner' aria-hidden hidden={!searching} />
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

        <main
          id='detail'
          className={
            navigation.state === 'loading' && !searching ? 'loading' : ''
          }>
          <Outlet />
        </main>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
