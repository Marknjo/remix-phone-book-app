import { useFetcher } from '@remix-run/react';
import type { FunctionComponent } from 'react';
import type { ContactRecord } from '~/data';

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, 'favorite'>;
}> = ({ contact }) => {
  const favorite = contact.favorite;
  const fetcher = useFetcher();

  return (
    <fetcher.Form method='post'>
      <button
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        name='favorite'
        value={favorite ? 'false' : 'true'}>
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  );
};

export default Favorite;
