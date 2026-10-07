import React from 'react';
import { X, Check, ShoppingBag, Zap } from 'lucide-react';
import { Product, formatVND } from '../data/products';
import { ResilientImage } from './ResilientImage';

interface ProductConfiguratorModalProps {
  product: Product | null;
  selectedOptionId: string;
  setSelectedOptionId: (id: string) => void;
  onClose: () => void;
  onAddToCart: (product: Product, optionId: string, openDrawer?: boolean) => void;
}

export const ProductConfiguratorModal: React.FC<ProductConfiguratorModalProps> = ({
  product,
  selectedOptionId,
  setSelectedOptionId,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

  const currentPrice =
    product.basePrice +
    (product.options.find((o) => o.id === selectedOptionId)?.priceDelta || 0);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden border border-black/10 shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.08]">
          <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
            <span>{product.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">{product.sku}</span>
            <span aria-hidden="true">·</span>
            <span>Bảo hành {product.warrantyMonths} tháng</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.05] transition-colors cursor-pointer"
            aria-label="Đóng cửa sổ cấu hình"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Product Visual & Highlights */}
          <div className="lg:col-span-6 bg-[#F5F5F7] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black/[0.08]">
            <div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#18181B] mb-6">
                <ResilientImage
                  src={product.imageUrl}
                  alt={product.name}
                  category={product.category}
                  title={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h4 className="text-xs font-semibold text-[#1D1D1F] mb-2.5">
                Đặc điểm kỹ thuật nổi bật
              </h4>
              <ul className="space-y-2 text-xs text-[#515154]">
                {product.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#0071E3] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-black/[0.08] flex items-center justify-between text-xs text-[#6E6E73]">
              <span>Sẵn hàng: {product.stockCount} thiết bị</span>
              <span>{product.leadTime}</span>
            </div>
          </div>

          {/* Right: Contiguous Purchase & Spec Configuration Module */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-[#1D1D1F]">
                {product.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#515154] mt-2 leading-relaxed">
                {product.subtitle}
              </p>

              {/* Variant Selection */}
              <div className="mt-6">
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-2.5">
                  Chọn phiên bản cấu hình
                </label>
                <div className="space-y-2.5">
                  {product.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    const optionTotal = product.basePrice + opt.priceDelta;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedOptionId(opt.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[#0071E3] bg-[#0071E3]/[0.04]'
                            : 'border-black/15 hover:border-black/30'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-[#1D1D1F]">
                            {opt.label}
                          </span>
                          <span className="font-mono-tabular text-xs font-semibold text-[#1D1D1F]">
                            {formatVND(optionTotal)}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6E6E73] mt-1">
                          {opt.specSummary}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Full Technical Specifications Table */}
              <div className="mt-6">
                <h4 className="text-xs font-semibold text-[#1D1D1F] mb-2.5">
                  Thông số kỹ thuật chi tiết
                </h4>
                <div className="divide-y divide-black/[0.06] border-t border-b border-black/[0.06]">
                  {product.specs.map((s) => (
                    <div
                      key={s.label}
                      className="py-2 flex items-baseline justify-between gap-4 text-xs"
                    >
                      <span className="text-[#6E6E73]">{s.label}</span>
                      <span className="font-mono-tabular text-[#1D1D1F] font-medium text-right">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contiguous Price + Dual E-Commerce CTAs (Add to Cart vs Instant Buy) */}
            <div className="mt-6 pt-5 border-t border-black/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="block text-xs text-[#6E6E73]">
                  Tổng giá trị cấu hình (Gồm VAT)
                </span>
                <span className="font-mono-tabular text-xl font-bold text-[#1D1D1F]">
                  {formatVND(currentPrice)}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, selectedOptionId, false);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED] rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Thêm Vào Giỏ</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, selectedOptionId, true);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Mua Ngay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
