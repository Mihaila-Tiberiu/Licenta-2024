
const disableConsole = () => {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
    console.debug = () => {};
  };
  
  export default disableConsole;