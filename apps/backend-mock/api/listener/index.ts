import { eventHandler, getQuery } from 'h3';
import { getListenerStore } from '~/utils/listener-data';
import { verifyAccessToken } from '~/utils/jwt-utils';
import {
  unAuthorizedResponse,
  useResultResponseSuccess,
} from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const currentPage = Math.max(1, Number(query.page || 1));
  const pageSize = Math.max(1, Number(query.pageSize || 100));
  const listenerId = Number(query.ListenerId || 0);
  const store = getListenerStore();
  const filteredItems =
    listenerId > 0
      ? store.filter((item) => item.Id === listenerId)
      : store;
  const start = (currentPage - 1) * pageSize;

  return useResultResponseSuccess({
    total: filteredItems.length,
    items: filteredItems.slice(start, start + pageSize),
  });
});
