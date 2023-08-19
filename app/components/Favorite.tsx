import { Form } from '@remix-run/react';
import type { FunctionComponent } from 'react';
import type { ContactRecord } from '~/data';

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, 'favorite'>;
}> = ({ contact }) => {
  const favorite = contact.favorite;

  return (
    <Form method='post'>
      <button
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        name='favorite'
        value={favorite ? 'false' : 'true'}>
        {favorite ? '★' : '☆'}
      </button>
    </Form>
  );
};

export default Favorite;
