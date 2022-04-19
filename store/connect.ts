const ServerPrimary = 'http://172.16.27.87:8080/';
const ServerTest = 'https://localhost:44337/';
const ServerLocal = 'http://172.16.27.87:8080/';
function GetBaseURL(server:string) {
  switch (server) {
    case 'primary':
      return ServerPrimary;
    case 'test':
      return ServerTest;
    case 'local':
      return ServerLocal;
    default:
      return ServerPrimary;
  }
}
export default function Config() {
  return GetBaseURL('primary');
}