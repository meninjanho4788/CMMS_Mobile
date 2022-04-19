import { app_vi, app_en } from './index';

function GetLanguage(server:string) {
  switch (server) {
    case 'VN':
      return app_vi;
    case 'EN':
      return app_en;
    default:
      return app_en;
  }
}
export default function MyLanguage(lang:string) {
  return GetLanguage(lang);
}
