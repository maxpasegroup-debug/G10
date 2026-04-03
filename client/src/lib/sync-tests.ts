/**
 * Master list for UI / shared types. Database rows are upserted on the server
 * (`server/lib/syncTests.js`) at startup and before `/api/submit-test`.
 */
export { TESTS, type TestDefinition } from './tests-config'
