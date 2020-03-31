export const addQueryParam = (name, value) => {
    const nextSearch = document.location.search ? `${document.location.search}&${name}=${value}` : `?${name}=${value}`
    window.history.pushState({}, 'Belote en ligne', `${document.location.protocol}//${document.location.host}${nextSearch}`)
 
}