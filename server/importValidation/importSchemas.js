const REQUIRED_FIELDS = {
  customers: ["customerCode", "customerName", "latitude", "longitude"],
  orders: ["orderNo", "customerCode", "cases", "weightKg", "cbm"],
  routes: ["routeId", "depot", "vehicleCode", "driverName"],
  vehicles: ["vehicleCode", "vehicleName", "maxWeightKg", "maxCbm"],
};

const NUMERIC_FIELDS = {
  customers: ["latitude", "longitude"],
  orders: ["cases", "weightKg", "cbm"],
  routes: ["plannedKm", "plannedMinutes"],
  vehicles: ["maxWeightKg", "maxCbm", "maxEf"],
};

export function getImportSchema(entityName) {
  return {
    entityName,
    requiredFields: REQUIRED_FIELDS[entityName] ?? [],
    numericFields: NUMERIC_FIELDS[entityName] ?? [],
  };
}

export function listImportSchemas() {
  return Object.keys(REQUIRED_FIELDS).map(getImportSchema);
}
