// Shared with the existing adapter; cloud failures never enter the separate browser store.
export async function cloudHouseFetch(service,path,options={}){
  if(options.credentials!==undefined&&options.credentials!=='same-origin'){const error=new Error('Unsupported House credential mode.');error.status=400;throw error;}
  if(!service?.connected||typeof service.fetch!=='function'){const error=new Error('Original service connection closed. Your draft is kept; reconnect or explicitly switch storage mode.');error.status=428;throw error;}
  const forwarded={...options};delete forwarded.credentials;
  return service.fetch(path,forwarded);
}
export async function readHouseResponse(response,ErrorType=Error){
  const data=await response.json();
  if(!response.ok){const error=new ErrorType(data?.error||'The selected House service could not complete this operation.',response.status);error.status=response.status;error.outcomeUnknown=Boolean(data?.outcomeUnknown);throw error;}
  return data;
}
