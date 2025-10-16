export interface FindAdvancedProductoFilters {
  marcaId?: number;
  proveedorId?: number;
  lineaId?: number;
  stockDesde?: number;
  stockHasta?: number;
  precioDesde?: number;
  precioHasta?: number;
  codigoProveedor?: string;
  take: number;
  page: number;
}