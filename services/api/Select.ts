export default {
  GetBasicData: async (strApi: string|undefined,datatype:string, param1:string, param2:string, param3: string) => {
    return fetch(strApi+'api/select/get_basic_data/'+datatype+'/'+param1+'/'+param2+'/'+param3)
    .then(response => response.json())
    .then(responseJson => {
        return responseJson;
     })
        .catch(() => {
        return 0;
        });
  },
//   LoadListImport: async (keySession, userid, companyCode) => {
//     const data = {
//       keySession,
//       userid,
//       companyCode,
//     };
//     return fetch(Url.CWRefreshListScanImportEmbroidery(), {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     })
//       .then(response => response.json())
//       .then(responseJson => {
//         return responseJson;
//       })
//       .catch(() => {
//         return [];
//       });
//   },
};
