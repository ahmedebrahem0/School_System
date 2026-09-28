# Notifications frontend

The REST inbox is the source of truth. SignalR only accelerates delivery and the UI refetches active notification data after reconnecting.

## Configuration

- `NEXT_PUBLIC_BACKEND_URL`: backend origin, without a trailing slash.
- The Next route handler proxies REST calls and forwards the HttpOnly authentication cookie plus the allowlisted `Idempotency-Key` header.
- SignalR connects directly to `${NEXT_PUBLIC_BACKEND_URL}/hubs/notifications`. The login flow stores the JWT in `localStorage` for `accessTokenFactory`; logout and REST `401` remove it.

## Main routes

- `/notifications`: inbox for every authenticated role.
- `/notifications/send`: Admin and Teacher only.

Admin can target User, Role, Class, SchoolGrade, Subject, or All. Teacher can target User, Class, or Subject. Scheduling uses browser-local `datetime-local` values converted to UTC ISO strings before submission.

The backend currently has no endpoint to list notifications created by a sender. Therefore scheduled cancellation is available from the successful send receipt only; a persistent scheduled-management screen requires a backend listing endpoint.

## Verification

```bash
npx --yes pnpm@10 test
npx --yes pnpm@10 lint
npx --yes pnpm@10 build
```
