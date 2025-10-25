import { Vertex } from "./vertex";

export interface RoutePoint {
  longitude: number;
  latitude: number;
  address: string;
  typeOfClient: string;
}

export interface MapProps {
  vertices?: Vertex[];
  onRouteCalculated?: (distance: number, time: number) => void;
}