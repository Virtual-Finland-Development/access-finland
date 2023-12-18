import { rest } from 'msw';
import { ConsentDataSource, ConsentStatus } from '@shared/types';
import { AUTH_GW_BASE_URL } from '@shared/lib/api/endpoints';
import server from '@shared/lib/testing/mocks/server';

/**
 *
 * @param consentStatus
 * @param dataSource
 *
 *  Intercept consent check request.
 */
export function interceptConsentCheck(
  consentStatus: ConsentStatus,
  dataSource: ConsentDataSource
) {
  server.use(
    rest.post(
      `${AUTH_GW_BASE_URL}/consents/testbed/consent-check`,
      async (_, res, ctx) =>
        res(
          ctx.json([
            {
              consentStatus,
              dataSource,
              redirectUrl: '',
            },
          ])
        )
    )
  );
}
