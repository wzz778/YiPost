import hyRequest from '..'

export function getTopBanner() {
  return hyRequest.get({
    url: '/banner'
  })
}

export function getUser(data:any) {
  return hyRequest.get({
    url: '/users/search',
    params: data
  }) 
}

export function getAllDept() {
  return hyRequest.get({
    url: '/depts/search',
  }) 
}

export function userAdd(data:any) {
  return hyRequest.post({
    url: '/users/add',
    data:data,
    headers: {'Content-Type': 'application/json'}
  }) 
}

export function userUpload(data:any) {
  return hyRequest.put({
    url: '/users/upload',
    data:data,
    headers: {'Content-Type': 'application/json'}
  }) 
}

export function deleteUserById(data:any) {
  return hyRequest.delete({
    url: '/users/deleteUserById',
    params: data
  }) 
}