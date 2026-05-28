import type { RoutingProviderConfig } from "../types";

export const ROUTING_PROVIDER_OPTIONS: RoutingProviderConfig[] = [
  {
    provider: "google-maps",
    navigationProvider: "google-maps-app",
    displayName: "Google Maps Platform",
    planningUseCase: "Planning ETA, distance matrix, traffic-aware route calculations, and handoff links to driver navigation.",
    driverNavigationUseCase: "Open selected stop sequence in Google Maps links from the driver workflow.",
    supportsTrafficAwareEta: true,
    supportsRouteMatrix: true,
    supportsMultiStopOptimization: false,
    requiresServerSideKeyProtection: true,
    status: "Selected",
  },
  {
    provider: "mapbox",
    navigationProvider: "google-maps-app",
    displayName: "Mapbox",
    planningUseCase: "Fallback for customizable maps, navigation SDKs, and optimization API evaluation.",
    driverNavigationUseCase: "Can be used later for in-app navigation SDK if RouteIQ builds a dedicated driver app.",
    supportsTrafficAwareEta: true,
    supportsRouteMatrix: true,
    supportsMultiStopOptimization: true,
    requiresServerSideKeyProtection: true,
    status: "Fallback",
  },
  {
    provider: "openrouteservice",
    navigationProvider: "google-maps-app",
    displayName: "OpenRouteService",
    planningUseCase: "Fallback for open-source-friendly optimization experiments and non-production route planning tests.",
    driverNavigationUseCase: "Not selected for driver navigation; keep Google/Apple deep links for driver familiarity.",
    supportsTrafficAwareEta: false,
    supportsRouteMatrix: true,
    supportsMultiStopOptimization: true,
    requiresServerSideKeyProtection: true,
    status: "Fallback",
  },
];

export function getSelectedRoutingProvider(): RoutingProviderConfig {
  return ROUTING_PROVIDER_OPTIONS.find((provider) => provider.status === "Selected") || ROUTING_PROVIDER_OPTIONS[0];
}
