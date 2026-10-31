const fs = require('fs');

const html = fs.readFileSync('yaprak-test.html', 'utf8');
const currJs = fs.readFileSync('js/curriculum-data.js', 'utf8');
const yaprakJs = fs.readFileSync('js/yaprak-test.js', 'utf8');

// Build a mock DOM
const mockElements = {};
const idRegex = /id=["']([^"']+)["']/g;
let m;
while ((m = idRegex.exec(html)) !== null) {
  const id = m[1];
  mockElements[id] = {
    id,
    classList: {
      add: () => {},
      remove: () => {},
      toggle: () => false,
      contains: () => false
    },
    style: {},
    setAttribute: () => {},
    getAttribute: () => '',
    removeAttribute: () => {},
    addEventListener: () => {},
    appendChild: () => {},
    querySelectorAll: () => [],
    querySelector: () => null,
    innerHTML: '',
    textContent: '',
    value: '5',
    disabled: false
  };
}

const window = {
  pdfjsLib: null,
  addEventListener: () => {},
  document: {
    addEventListener: (evt, cb) => {
      if (evt === 'DOMContentLoaded') {
        console.log('Invoking DOMContentLoaded handler...');
        try {
          cb();
          console.log('DOMContentLoaded executed successfully without throwing!');
        } catch (err) {
          console.error('ERROR in DOMContentLoaded:', err);
        }
      }
    },
    getElementById: (id) => {
      if (mockElements[id]) return mockElements[id];
      console.warn('getElementById NOT FOUND:', id);
      return null;
    },
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: (tag) => ({
      tagName: tag,
      classList: { add: () => {}, remove: () => {}, toggle: () => false },
      style: {},
      setAttribute: () => {},
      getAttribute: () => '',
      addEventListener: () => {},
      appendChild: () => {},
      innerHTML: '',
      textContent: ''
    }),
    documentElement: { style: { setProperty: () => {} } }
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  },
  sessionStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  },
  fetch: async () => ({ ok: false })
};
const document = window.document;
const localStorage = window.localStorage;
const sessionStorage = window.sessionStorage;

// Run curriculum-data.js
eval(currJs);

// Run yaprak-test.js
eval(yaprakJs);
