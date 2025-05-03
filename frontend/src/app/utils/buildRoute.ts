type ServiceRoute = {
  requiredAuth: boolean;
  url: string;
};

export const buildRoute = (route: ServiceRoute, params: Record<string, string | number>) => {
  let { url } = route;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      url = url.replace(new RegExp(':' + key, 'g'), encodeURIComponent(params[key].toString()));
    }
  }

  return { ...route, url };
};
