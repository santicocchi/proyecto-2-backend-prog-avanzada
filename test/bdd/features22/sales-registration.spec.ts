import { defineFeature, loadFeature } from 'jest-cucumber';
import { logStep } from '../logStep';

type Product = { name: string; price: number; stock: number };
interface SaleItem { name: string; qty: number; price: number }
interface Sale { customer: string; items: SaleItem[]; total: number }

class SalesService {
  private catalog = new Map<string, Product>();
  private history: Sale[] = [];
  addProduct(name: string, price: number, stock: number) {
    this.catalog.set(name, { name, price, stock });
  }
  createSale(customer: string, items: { name: string; qty: number }[]): { ok: boolean; msg: string; sale?: Sale } {
    // check stock
    for (const it of items) {
      const p = this.catalog.get(it.name);
      if (!p || p.stock < it.qty) return { ok: false, msg: 'Stock insuficiente' };
    }
    // update stock & calc total
    let total = 0;
    const detail: SaleItem[] = [];
    for (const it of items) {
      const p = this.catalog.get(it.name)!;
      p.stock -= it.qty;
      total += p.price * it.qty;
      detail.push({ name: p.name, qty: it.qty, price: p.price });
    }
    const sale: Sale = { customer, items: detail, total };
    this.history.push(sale);
    return { ok: true, msg: 'Venta registrada', sale };
  }
  getProduct(name: string) { return this.catalog.get(name)!; }
  getHistory() { return this.history; }
}

const feature = loadFeature('./test/bdd/features/sales-registration.feature');

defineFeature(feature, test => {
  let svc: SalesService;
  let res: any;

  beforeEach(() => { svc = new SalesService(); res = undefined; });

  test('Registrar una venta exitosa', ({ given, when, then }) => {
    given(/^existe un cliente "([^"]*)" y productos "([^"]*)" \(precio (\d+), stock (\d+)\) y "([^"]*)" \(precio (\d+), stock (\d+)\)$/, (cli, p1, price1, s1, p2, price2, s2) => {
      logStep('Given catalog with 2 products');
      svc.addProduct(p1, Number(price1), Number(s1));
      svc.addProduct(p2, Number(price2), Number(s2));
    });
    when(/^se crea una venta con (\d+) "([^"]*)" y (\d+) "([^"]*)" para "([^"]*)"$/, (q1, p1, q2, p2, cli) => {
      logStep('When create sale');
      res = svc.createSale(cli, [ { name: p1, qty: Number(q1) }, { name: p2, qty: Number(q2) }]);
    });
    then(/^el total de la venta debe ser (\d+) y los stocks deben actualizarse a (\d+) y (\d+)$/, (total, s1After, s2After) => {
      logStep('Then verify total and stock');
      expect(res.ok).toBe(true);
      expect(res.sale.total).toBe(Number(total));
      const p1 = svc.getProduct('Libro');
      const p2 = svc.getProduct('Lapicera');
      expect(p1.stock).toBe(Number(s1After));
      expect(p2.stock).toBe(Number(s2After));
    });
  });

  test('Venta rechazada por stock insuficiente', ({ given, when, then }) => {
    given(/^existe un cliente "([^"]*)" y producto "([^"]*)" \(precio (\d+), stock (\d+)\)$/, (cli, p, price, stock) => {
      logStep('Given single product low stock');
      svc.addProduct(p, Number(price), Number(stock));
    });
    when(/^se intenta vender (\d+) "([^"]*)" a "([^"]*)"$/, (qty, prod, cli) => {
      logStep('When attempt sale over stock');
      res = svc.createSale(cli, [ { name: prod, qty: Number(qty) }]);
    });
    then('el sistema debe rechazar la venta por stock insuficiente', () => {
      logStep('Then sale rejected');
      expect(res.ok).toBe(false);
    });
  });
});
