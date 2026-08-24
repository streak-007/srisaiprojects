import type { ProjectAddon, ProjectComponent } from "./types";

export function componentSubtotal(c: Pick<ProjectComponent, "quantity" | "unit_cost">) {
  return c.quantity * c.unit_cost;
}

export function hardwareTotal(components: Pick<ProjectComponent, "quantity" | "unit_cost">[]) {
  return components.reduce((sum, c) => sum + componentSubtotal(c), 0);
}

export function addonAmount(
  addon: Pick<ProjectAddon, "type" | "value">,
  hardware: number,
) {
  if (addon.type === "flat") return addon.value;
  return Math.round((hardware * addon.value) / 100);
}

export function computeEstimate(
  components: Pick<ProjectComponent, "quantity" | "unit_cost">[],
  addons: Pick<ProjectAddon, "type" | "value" | "name">[],
) {
  const hardware = hardwareTotal(components);
  const addonLines = addons.map((a) => ({
    name: a.name,
    type: a.type,
    value: a.value,
    amount: addonAmount(a, hardware),
  }));
  const addonsTotal = addonLines.reduce((sum, a) => sum + a.amount, 0);
  return {
    hardware,
    addonLines,
    total: hardware + addonsTotal,
  };
}
