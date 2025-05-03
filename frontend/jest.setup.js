// // import '@testing-library/jest-dom';

// // globalThis.importMeta = {
// //   env: {
// //     VITE_URL_REST: 'http://localhost:3000',
// //     VITE_SECRET_KEY: 'mySecretKey'
// //   },
// // };

// import '@testing-library/jest-dom';
// import { TextEncoder, TextDecoder } from 'util';

// global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;

// globalThis.importMeta = {
//   env: {
//     VITE_URL_REST: 'http://localhost:3000',
//     VITE_SECRET_KEY: 'mySecretKey'
//   },
// };

require('@testing-library/jest-dom'); 

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;