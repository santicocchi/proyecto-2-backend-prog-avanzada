import { defineFeature, loadFeature } from 'jest-cucumber';
import { logStep } from '../logStep';

type Alert = { product: string; qty: number; active: boolean };

class InventoryService {
  private stock = new Map<string, number>();
  private alerts: Alert[] = [];

  setStock(prod: string, qty: number) {
    this.stock.set(prod, qty);
    this.checkAlert(prod);
  }
  sell(prod: string, qty: number) {
    const current = (this.stock.get(prod) || 0) - qty;
    this.stock.set(prod, current);
    this.checkAlert(prod);
  }
  private checkAlert(prod: string) {
    const qty = this.stock.get(prod)!;
    const existing = this.alerts.find(a => a.product === prod);
    if (qty <= 10) {
      if (existing) { existing.qty = qty; existing.active = true; }
      else this.alerts.push({ product: prod, qty, active: true });
    } else if (existing) {
      existing.active = false;
    }
  }
  getActiveAlerts() { return this.alerts.filter(a => a.active); }
}

const feature = loadFeature('./test/bdd/features/stock-alert.feature');

defineFeature(feature, test => {
  let inv: InventoryService;

  beforeEach(() => { inv = new InventoryService(); });

  test('Generar alerta cuando el stock baja a 10 unidades o menos', ({ given, when, then }) => {
    given(/^existe un producto "([^"]*)" con stock (\d+)$/, (prod, qty) => {
      logStep(`Given ${prod} stock ${qty}`);
      inv.setStock(prod, Number(qty));
    });
    when(/^se vende (\d+) unidades de "([^"]*)"$/, (qty, prod) => {
      logStep(`When vendo ${qty} de ${prod}`);
      inv.sell(prod, Number(qty));
    });
    then(/^el sistema debe generar una alerta de stock para "([^"]*)" con cantidad (\d+)$/, (prod, qty) => {
      logStep(`Then alerta para ${prod}`);
      const alert = inv.getActiveAlerts().find(a => a.product === prod)!;
      expect(alert).toBeDefined();
      expect(alert.qty).toBe(Number(qty));
    });
  });

  test('Resolver alerta cuando el stock se repone', ({ given, when, then }) => {
    given(/^existe una alerta activa para "([^"]*)" con cantidad (\d+)$/, (prod, qty) => {
      logStep('Given alerta activa'); inv.setStock(prod, Number(qty));
    });
    when(/^se incrementa el stock de "([^"]*)" a (\d+) unidades$/, (prod, qty) => {
      logStep('When repongo stock'); inv.setStock(prod, Number(qty));
    });
    then(/^la alerta de "([^"]*)" debe marcarse como resuelta$/, (prod) => {
      logStep('Then alerta resuelta');
      expect(inv.getActiveAlerts().some(a => a.product === prod)).toBe(false);
    });
  });

  test('Consultar alertas activas', ({ given, when, then }) => {
    given('existen alertas activas para "Laptop" y "Mouse"', () => {
      logStep('Given dos alertas'); inv.setStock('Laptop', 5); inv.setStock('Mouse', 8);
    });
    when('el usuario revisa la sección de alertas', () => { logStep('When revisa alertas'); });
    then('el sistema muestra 2 alertas activas', () => {
      logStep('Then muestra 2'); expect(inv.getActiveAlerts().length).toBe(2);
    });
  });
});
