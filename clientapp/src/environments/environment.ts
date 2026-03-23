import { version } from 'src/version';
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: true,
    apiUrl: 'https://localhost:8080',
    reportUrl: 'http://localhost:8082/report/',
    timeStamp: version.timeStamp
};
