# Security Specification (`security_spec.md`)

## 1. Data Invariants
1. **Default Deny**: All paths are denied unless explicitly matched under `/users/{userId}/private/{docId}`.
2. **PII Isolation**: User private profile documents (`/users/{userId}/private/profile`) contain PII (`email`, `phone`, `organization`) and can ONLY be read (`get`) or written (`create`, `update`) by the authenticated owner (`request.auth.uid == userId`) whose email is verified (`request.auth.token.email_verified == true`).
3. **Strict Schema & Size Bounds**:
   - `uid`: string, matches `request.auth.uid` and `userId`, length `1..128`, regex `^[a-zA-Z0-9_\-]+$`.
   - `displayName`: string, length `1..100`.
   - `email`: string, length `3..120`.
   - `phone`: string, length `0..30`.
   - `organization`: string, length `0..120`.
   - `updatedAt`: timestamp, must equal `request.time`.
4. **No Shadow Fields**: `keys().hasAll` and `keys().hasOnly` strictly restrict keys to `['uid', 'displayName', 'email', 'phone', 'organization', 'updatedAt']`.

## 2. The "Dirty Dozen" Payloads
1. **Unauthenticated Write**: `auth = null` attempting to create `/users/u1/private/profile`.
2. **Unverified Email Spoof**: `auth = { uid: 'u1', token: { email_verified: false } }` attempting to create profile.
3. **Cross-User PII Read**: `auth = { uid: 'u2', token: { email_verified: true } }` attempting `get` on `/users/u1/private/profile`.
4. **Identity Spoofing in Payload**: `auth.uid = 'u1'` writing `uid: 'u2'` inside `/users/u1/private/profile`.
5. **Shadow Field Injection on Create**: Adding `isAdmin: true` or `role: 'admin'` to profile payload.
6. **Shadow Field Injection on Update**: Updating profile with an unauthorized field `vipTier: 'gold'`.
7. **Resource Poisoning (Oversized displayName)**: `displayName` with 500 characters (`> 100`).
8. **Resource Poisoning (Oversized organization)**: `organization` with 500 characters (`> 120`).
9. **Invalid Document ID**: Writing to `/users/u1/private/invalid_doc` instead of `profile`.
10. **Forged Client Timestamp**: Setting `updatedAt` to a past/future timestamp instead of `request.time`.
11. **Immutable UID Tampering on Update**: Updating `uid` from `'u1'` to `'u2'` during an `update` call.
12. **Unauthorized Collection Listing**: Calling `list` on `/users/u1/private`.
