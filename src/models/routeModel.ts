export type RoutesModel = {
  routes: RouteFilterModel
};

export type RouteFilterItem = {
  _id: string;
  active: boolean;
};
  
export type RouteFilterModel = RouteFilterItem[];