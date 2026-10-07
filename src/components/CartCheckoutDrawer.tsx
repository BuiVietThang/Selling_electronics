import React from 'react';
import {
  ShoppingBag,
  Check,
  Plus,
  Minus,
  X,
  Tag,
  Truck,
  CreditCard,
  Package,
  Trash2,
  FileText
} from 'lucide-react';
import { Product, PROMO_VOUCHERS, formatVND } from '../data/products';
import { ResilientImage } from './ResilientImage';

export interface CartItem {
  product: Product;
  optionId: string;
  optionLabel: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderRecord {
  orderCode: string;
  uid: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: 'bank_transfer' | 'cod' | 'corporate_credit' | 'installment_0';
  shippingMethod: 'standard_24h' | 'express_2h' | 'engineer_onsite';
  voucherCode: string;
  needVatInvoice: boolean;
  vatCompanyInfo: string;
  itemsSummary: string;
  itemCount: number;
  subtotalAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  status: 'confirmed' | 'calibrating' | 'shipping' | 'delivered';
  createdAtLabel: string;
}

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onClearCart: () => void;
  customerName: string;
  setCustomerName: (v: string) => void;
  customerPhone: string;
  setCustomerPhone: (v: string) => void;
  shippingAddress: string;
  setShippingAddress: (v: string) => void;
  paymentMethod: OrderRecord['paymentMethod'];
  setPaymentMethod: (v: OrderRecord['paymentMethod']) => void;
  shippingMethod: OrderRecord['shippingMethod'];
  setShippingMethod: (v: OrderRecord['shippingMethod']) => void;
  voucherInput: string;
  setVoucherInput: (v: string) => void;
  appliedVoucherCode: string;
  onApplyVoucher: (code: string) => void;
  needVatInvoice: boolean;
  setNeedVatInvoice: (v: boolean) => void;
  vatCompanyInfo: string;
  setVatCompanyInfo: (v: string) => void;
  subtotalAmount: number;
  discountAmount: number;
  shippingFee: number;
  finalTotalAmount: number;
  formError: string;
  onSubmitOrder: (e: React.FormEvent) => void;
  confirmedOrder: OrderRecord | null;
  onResetConfirmedOrder: () => void;
  orderHistory: OrderRecord[];
}

export const CartCheckoutDrawer: React.FC<CartCheckoutDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onClearCart,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  shippingAddress,
  setShippingAddress,
  paymentMethod,
  setPaymentMethod,
  shippingMethod,
  setShippingMethod,
  voucherInput,
  setVoucherInput,
  appliedVoucherCode,
  onApplyVoucher,
  needVatInvoice,
  setNeedVatInvoice,
  vatCompanyInfo,
  setVatCompanyInfo,
  subtotalAmount,
  discountAmount,
  shippingFee,
  finalTotalAmount,
  formError,
  onSubmitOrder,
  confirmedOrder,
  onResetConfirmedOrder,
  orderHistory
}) => {
  const [activeTab, setActiveTab] = React.useState<'cart' | 'orders'>('cart');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg h-full flex flex-col justify-between shadow-2xl border-l border-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header with Tabs */}
        <div className="px-6 pt-5 pb-4 border-b border-black/[0.08]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold text-[#1D1D1F]">
                Trung Tâm Đặt Hàng & Vận Đơn AETHER
              </h3>
              <p className="text-xs text-[#6E6E73]">
                Bảo hiểm hàng hóa 100% · Chứng nhận hiệu chuẩn xuất xưởng
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.05] cursor-pointer"
              aria-label="Đóng giỏ hàng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1 p-1 bg-[#F5F5F7] rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('cart')}
              className={`py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'cart'
                  ? 'bg-white text-[#1D1D1F] shadow-xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Giỏ Hàng & Thanh Toán ({cart.reduce((s, i) => s + i.quantity, 0)})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-white text-[#1D1D1F] shadow-xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Tra Cứu Đơn Hàng ({orderHistory.length})
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'orders' ? (
            /* ORDER TRACKING & HISTORY TAB */
            orderHistory.length === 0 ? (
              <div className="py-16 text-center">
                <Package className="w-10 h-10 text-[#86868B] mx-auto mb-3 stroke-[1.5]" />
                <p className="text-sm font-medium text-[#1D1D1F]">
                  Chưa có đơn đặt hàng nào
                </p>
                <p className="text-xs text-[#6E6E73] mt-1">
                  Các đơn hàng bạn đặt sẽ hiển thị mã vận đơn và tiến độ hiệu chuẩn tại đây.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orderHistory.map((ord) => (
                  <div
                    key={ord.orderCode}
                    className="p-4 rounded-xl bg-[#F9F9FB] border border-black/[0.08] space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-2.5">
                      <div>
                        <span className="font-mono-tabular text-xs font-bold text-[#0071E3]">
                          #{ord.orderCode}
                        </span>
                        <span className="text-[11px] text-[#6E6E73] ml-2">
                          · {ord.createdAtLabel}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-[#1D1D1F]">
                        Đã xác nhận & Hiệu chuẩn
                      </span>
                    </div>

                    <p className="text-xs text-[#1D1D1F] font-medium leading-relaxed">
                      {ord.itemsSummary}
                    </p>

                    <div className="text-[11px] text-[#6E6E73] space-y-0.5">
                      <div>
                        Người nhận: <strong className="text-[#1D1D1F]">{ord.customerName}</strong> ({ord.customerPhone})
                      </div>
                      <div>Địa chỉ: {ord.shippingAddress}</div>
                      {ord.needVatInvoice && ord.vatCompanyInfo && (
                        <div>Hóa đơn VAT: {ord.vatCompanyInfo}</div>
                      )}
                    </div>

                    {/* Visual Progress Steps */}
                    <div className="pt-2 grid grid-cols-4 gap-1 text-[10px] text-center">
                      <div className="bg-[#0071E3] text-white py-1 rounded font-semibold">
                        1. Tiếp nhận
                      </div>
                      <div className="bg-[#0071E3]/15 text-[#0071E3] py-1 rounded font-semibold">
                        2. Hiệu chuẩn
                      </div>
                      <div className="bg-black/[0.05] text-[#6E6E73] py-1 rounded">
                        3. Vận chuyển
                      </div>
                      <div className="bg-black/[0.05] text-[#6E6E73] py-1 rounded">
                        4. Bàn giao
                      </div>
                    </div>

                    <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between text-xs">
                      <span className="text-[#6E6E73]">Tổng thanh toán:</span>
                      <span className="font-mono-tabular font-bold text-[#1D1D1F]">
                        {formatVND(ord.totalAmount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : confirmedOrder ? (
            /* POST-ORDER CONFIRMATION RECEIPT */
            <div className="py-6 space-y-5">
              <div className="w-12 h-12 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <div className="text-center">
                <span className="font-mono-tabular text-xs font-semibold text-[#0071E3]">
                  MÃ VẬN ĐƠN: #{confirmedOrder.orderCode}
                </span>
                <h4 className="text-xl font-semibold text-[#1D1D1F] mt-1">
                  Đặt hàng & Khởi tạo phiếu xuất kho thành công
                </h4>
                <p className="text-xs text-[#515154] mt-1.5 leading-relaxed">
                  Cảm ơn <strong>{confirmedOrder.customerName}</strong>. Kỹ thuật viên điều phối của AETHER sẽ liên hệ qua số{' '}
                  <span className="font-mono-tabular font-semibold">{confirmedOrder.customerPhone}</span> trong 15 phút để xác nhận lịch giao lắp.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F5F5F7] border border-black/[0.07] space-y-2.5 text-xs">
                <div className="font-semibold text-[#1D1D1F] border-b border-black/[0.06] pb-2">
                  Chi tiết biên nhận đặt hàng
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">Sản phẩm:</span>
                  <span className="text-[#1D1D1F] font-medium text-right max-w-[240px]">
                    {confirmedOrder.itemsSummary}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">Địa chỉ nhận:</span>
                  <span className="text-[#1D1D1F] text-right max-w-[240px]">
                    {confirmedOrder.shippingAddress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">Tổng thanh toán:</span>
                  <span className="font-mono-tabular font-bold text-[#0071E3]">
                    {formatVND(confirmedOrder.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="flex-1 py-2.5 text-xs font-semibold text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED] rounded-xl cursor-pointer"
                >
                  Theo Dõi Tiến Độ Đơn
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onResetConfirmedOrder();
                    onClose();
                  }}
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-[#1D1D1F] hover:bg-black rounded-xl cursor-pointer"
                >
                  Tiếp Tục Mua Sắm
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            /* EMPTY CART */
            <div className="py-16 text-center">
              <ShoppingBag className="w-10 h-10 text-[#86868B] mx-auto mb-3 stroke-[1.5]" />
              <p className="text-sm font-medium text-[#1D1D1F]">
                Giỏ hàng của bạn đang trống
              </p>
              <p className="text-xs text-[#6E6E73] mt-1">
                Hãy chọn thiết bị từ danh mục 18 sản phẩm để cấu hình và đặt mua.
              </p>
            </div>
          ) : (
            /* ACTIVE CART & FULL E-COMMERCE CHECKOUT */
            <>
              {/* Item List Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1D1D1F]">
                  Danh sách thiết bị ({cart.reduce((s, i) => s + i.quantity, 0)})
                </span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="inline-flex items-center gap-1 text-[11px] text-[#6E6E73] hover:text-[#D70015] cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Xóa toàn bộ</span>
                </button>
              </div>

              <div className="space-y-3">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.optionId}`}
                    className="p-3.5 rounded-xl bg-[#F5F5F7] border border-black/[0.06] flex gap-3.5"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#18181B] shrink-0">
                      <ResilientImage
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        category={item.product.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-[#1D1D1F] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-[#6E6E73] truncate mt-0.5">
                        {item.optionLabel}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-mono-tabular text-xs font-semibold text-[#1D1D1F]">
                          {formatVND(item.unitPrice * item.quantity)}
                        </span>
                        <div className="flex items-center gap-2 bg-white rounded-md border border-black/10 px-1.5 py-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(idx, -1)}
                            className="p-0.5 text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                            aria-label="Giảm số lượng"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono-tabular text-xs font-semibold px-1">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(idx, 1)}
                            className="p-0.5 text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                            aria-label="Tăng số lượng"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Voucher / Promo Code Section */}
              <div className="p-4 rounded-xl bg-[#F9F9FB] border border-black/[0.07] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#0071E3]" />
                    <span>Mã ưu đãi / Chiết khấu dự án</span>
                  </span>
                  {appliedVoucherCode && (
                    <span className="text-[11px] font-semibold text-[#0071E3]">
                      Đã áp dụng: {appliedVoucherCode}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                    placeholder="Nhập mã (VD: AETHER2026, B2BPRO5)"
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-black/15 rounded-lg font-mono-tabular uppercase focus:outline-none focus:border-[#0071E3]"
                  />
                  <button
                    type="button"
                    onClick={() => onApplyVoucher(voucherInput)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1D1D1F] hover:bg-black rounded-lg whitespace-nowrap cursor-pointer"
                  >
                    Áp dụng
                  </button>
                </div>

                {/* Quick clickable voucher suggestions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PROMO_VOUCHERS.map((v) => (
                    <button
                      key={v.code}
                      type="button"
                      onClick={() => {
                        setVoucherInput(v.code);
                        onApplyVoucher(v.code);
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                        appliedVoucherCode === v.code
                          ? 'bg-[#0071E3]/10 border-[#0071E3] text-[#0071E3] font-semibold'
                          : 'bg-white border-black/10 text-[#515154] hover:border-black/25'
                      }`}
                    >
                      {v.code} ({v.label})
                    </button>
                  ))}
                </div>
              </div>

              {/* Shipping Method Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>Phương thức vận chuyển & lắp đặt</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    {
                      id: 'standard_24h',
                      title: 'Giao hàng tiêu chuẩn bảo hiểm (24h–48h)',
                      desc: 'Miễn phí toàn quốc có niêm phong chống sốc',
                      feeLabel: 'Miễn phí'
                    },
                    {
                      id: 'express_2h',
                      title: 'Giao hỏa tốc 2 giờ (Hà Nội & TP.HCM)',
                      desc: 'Chuyên viên bàn giao trực tiếp trong 120 phút',
                      feeLabel: '350.000 ₫'
                    },
                    {
                      id: 'engineer_onsite',
                      title: 'Kỹ sư lắp đặt & Hiệu chuẩn Laser tận nơi',
                      desc: 'Kèm biên bản nghiệm thu thông số kỹ thuật tại nhà máy/biệt thự',
                      feeLabel: '1.200.000 ₫'
                    }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        setShippingMethod(m.id as OrderRecord['shippingMethod'])
                      }
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between ${
                        shippingMethod === m.id
                          ? 'border-[#0071E3] bg-[#0071E3]/[0.04]'
                          : 'border-black/12 hover:border-black/25'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold text-[#1D1D1F]">
                          {m.title}
                        </div>
                        <div className="text-[11px] text-[#6E6E73]">{m.desc}</div>
                      </div>
                      <span className="font-mono-tabular text-xs font-semibold text-[#1D1D1F] shrink-0 ml-2">
                        {m.feeLabel}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>Phương thức thanh toán</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'bank_transfer', label: 'Chuyển khoản QR / IB' },
                    { id: 'cod', label: 'Thanh toán khi nhận (COD)' },
                    { id: 'corporate_credit', label: 'Công nợ B2B 30 ngày' },
                    { id: 'installment_0', label: 'Trả góp 0% (12 tháng)' }
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() =>
                        setPaymentMethod(pm.id as OrderRecord['paymentMethod'])
                      }
                      className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-colors cursor-pointer ${
                        paymentMethod === pm.id
                          ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
                          : 'bg-white text-[#1D1D1F] border-black/15 hover:border-black/30'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Delivery & VAT Invoice Form */}
              <form
                id="drawer-checkout-form"
                onSubmit={onSubmitOrder}
                className="space-y-3 pt-4 border-t border-black/[0.08]"
              >
                <div className="text-xs font-semibold text-[#1D1D1F]">
                  Thông tin người nhận & Địa chỉ bàn giao
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    maxLength={100}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Họ và tên người nhận *"
                    className="w-full px-3 py-2 text-xs bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3]"
                  />
                  <input
                    type="tel"
                    maxLength={30}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Số điện thoại nhận hàng *"
                    className="w-full px-3 py-2 text-xs bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3] font-mono-tabular"
                  />
                </div>
                <input
                  type="text"
                  maxLength={250}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Địa chỉ giao hàng chi tiết (Số nhà, Phường/Xã, Quận/Huyện, Tỉnh/TP) *"
                  className="w-full px-3 py-2 text-xs bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3]"
                />

                {/* VAT Invoice Toggle */}
                <label className="flex items-center gap-2 text-xs text-[#1D1D1F] pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needVatInvoice}
                    onChange={(e) => setNeedVatInvoice(e.target.checked)}
                    className="rounded border-black/20 text-[#0071E3] focus:ring-[#0071E3]"
                  />
                  <FileText className="w-3.5 h-3.5 text-[#6E6E73]" />
                  <span>Yêu cầu xuất hóa đơn điện tử GTGT (VAT 10% đã bao gồm)</span>
                </label>

                {needVatInvoice && (
                  <input
                    type="text"
                    maxLength={200}
                    value={vatCompanyInfo}
                    onChange={(e) => setVatCompanyInfo(e.target.value)}
                    placeholder="Tên công ty · Mã số thuế · Email nhận hóa đơn điện tử"
                    className="w-full px-3 py-2 text-xs bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3]"
                  />
                )}

                {formError && (
                  <p className="text-[11px] text-[#D70015] font-medium bg-[#D70015]/10 px-3 py-2 rounded-lg">
                    {formError}
                  </p>
                )}
              </form>
            </>
          )}
        </div>

        {/* Drawer Sticky Summary Footer */}
        {activeTab === 'cart' && cart.length > 0 && !confirmedOrder && (
          <div className="p-6 border-t border-black/[0.08] bg-[#F5F5F7] space-y-2.5">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[#6E6E73]">
                <span>Tạm tính ({cart.reduce((s, i) => s + i.quantity, 0)} sản phẩm):</span>
                <span className="font-mono-tabular text-[#1D1D1F]">
                  {formatVND(subtotalAmount)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#0071E3] font-medium">
                  <span>Chiết khấu mã ưu đãi ({appliedVoucherCode}):</span>
                  <span className="font-mono-tabular">-{formatVND(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6E6E73]">
                <span>Phí vận chuyển & lắp đặt:</span>
                <span className="font-mono-tabular text-[#1D1D1F]">
                  {shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-black/[0.08]">
                <span className="text-xs font-semibold text-[#1D1D1F]">
                  Tổng thanh toán (Đã gồm VAT):
                </span>
                <span className="font-mono-tabular text-lg font-bold text-[#1D1D1F]">
                  {formatVND(finalTotalAmount)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              form="drawer-checkout-form"
              className="w-full py-3 px-4 text-xs sm:text-sm font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-xl transition-colors whitespace-nowrap cursor-pointer shadow-sm"
            >
              Hoàn Tất Đặt Hàng & Xuất Vận Đơn
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
