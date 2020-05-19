const { ipcRenderer } = require('electron');

const accessRow = document.querySelector('#access-token');
const idRow = document.querySelector('#id-token');
const refreshRow = document.querySelector('#refresh-token');

// DOM Load
ipcRenderer.send('load config');


// Electron Listeners
ipcRenderer.on('load config', function (event, args) {
  const poolInput = document.querySelector('#pool');

  if (poolInput) {
    poolInput.value = args.lastPool;
  }

  const clientInput = document.querySelector('#client');

  if (clientInput) {
    clientInput.value = args.lastClient;
  }
})

ipcRenderer.on('login result', function (event, args) {
  console.info('Login Successful!');
  console.dir(args);
  accessRow.textContent = args.access;
  idRow.textContent = args.id;
  refreshRow.textContent = args.refresh;

})

ipcRenderer.on('login error', function (event, args) {
  console.info('Login Failed!');
  console.dir(args);
  accessRow.textContent = '';
  idRow.textContent = '';
  refreshRow.textContent = '';
})


// Form Helper
const getFormValues = (formElement) => {
  const elements = form.elements;

  const result = {};
  Array.from(elements)
       .filter( element => !!element.name )
       .forEach( element => { result[element.name] = element.value; })

  return result;
}


// Event Listeners
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = getFormValues(event.target);
  console.dir(formData);

  ipcRenderer.send('login', formData);
})

const copyButtons = document.querySelectorAll('.copy-icon');
copyButtons.forEach( element => {
  element.addEventListener('click', event => {
    const field = event.currentTarget.dataset.field;
    if (field) {
      const fieldElement = document.querySelector(`#${field}`);

      console.log(field);
      console.dir(fieldElement);


      const copyElem = document.createElement('textarea');
      copyElem.value = fieldElement.textContent;
      copyElem.setAttribute('readonly', '');
      copyElem.style.opacity = '0';
      copyElem.style.transform = 'scale(0)';
      copyElem.style.pointerEvents = 'none';

      document.body.appendChild(copyElem);
      copyElem.select();
      document.execCommand('copy');
      document.body.removeChild(copyElem);
    }

  });
}); 
