type ServiceRoute = {
  requiredAuth: boolean;
  url: string;
};

export const buildRoute = (route: ServiceRoute, params: Record<string, string | number>) => {
  let { url } = route;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      // Reemplazar las partes dinámicas de la URL
      url = url.replace(new RegExp(':' + key, 'g'), encodeURIComponent(params[key].toString()));
    }
  }

  // Retornamos un nuevo objeto con la url modificada
  return { ...route, url };
};