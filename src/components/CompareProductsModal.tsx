import React from 'react';
import { X } from 'lucide-react';
import { Product, formatVND } from '../data/products';
import { ResilientImage } from './ResilientImage';

interface CompareProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProducts: Product[];
  onToggleCompare: (productId: string) => void;
  onOpenConfigurator: (product: Product) => void;
  onAddToCart: (product: Product, optionId?: string, openDrawer?: boolean) => void;
}

export const CompareProductsModal: React.FC<CompareProductsModalProps> = ({
  isOpen,
  onClose,
  comparedProducts,
  onToggleCompare,
  onOpenConfigurator,
  onAddToCart
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-5xl w-full overflow-hidden border border-black/10 shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.08]">
          <div>
            <h3 className="text-base font-semibold text-[#1D1D1F]">
              Đối Chiếu Thông Số Kỹ Thuật ({comparedProducts.length}/3 Thiết Bị)
            </h3>
            <p className="text-xs text-[#6E6E73]">
              So sánh trực tiếp cấu hình, hiệu suất và giá niêm yết
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.05] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          {comparedProducts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-[#1D1D1F]">
                Chưa có sản phẩm nào trong danh sách so sánh.
              </p>
              <p className="text-xs text-[#6E6E73] mt-1">
                Nhấn vào nút “+ So sánh” trên bất kỳ thẻ sản phẩm nào để thêm vào bảng đối chiếu.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {comparedProducts.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-black/[0.08] bg-[#F9F9FB] p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#6E6E73] mb-2">
                      <span className="font-mono-tabular">{item.sku}</span>
                      <button
                        type="button"
                        onClick={() => onToggleCompare(item.id)}
                        className="text-[#D70015] hover:underline cursor-pointer"
                      >
                        Bỏ chọn
                      </button>
                    </div>
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#18181B] mb-3">
                      <ResilientImage
                        src={item.imageUrl}
                        alt={item.name}
                        category={item.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-base font-semibold text-[#1D1D1F]">
                      {item.name}
                    </h4>
                    <div className="font-mono-tabular text-sm font-semibold text-[#0071E3] mt-1">
                      {formatVND(item.basePrice)}
                    </div>
                    <p className="text-xs text-[#6E6E73] mt-1">
                      {item.architectureNote}
                    </p>

                    <div className="mt-4 pt-4 border-t border-black/[0.08] space-y-2.5">
                      {item.specs.map((s) => (
                        <div key={s.label} className="text-xs">
                          <span className="block text-[#6E6E73]">{s.label}</span>
                          <span className="font-mono-tabular font-medium text-[#1D1D1F]">
                            {s.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-black/[0.08] flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenConfigurator(item);
                      }}
                      className="flex-1 py-2 text-xs font-semibold text-[#1D1D1F] bg-white border border-black/15 rounded-lg hover:bg-black/[0.03] cursor-pointer"
                    >
                      Cấu hình
                    </button>
                    <button
                      type="button"
                      onClick={() => onAddToCart(item, undefined, true)}
                      className="flex-1 py-2 text-xs font-semibold text-white bg-[#0071E3] rounded-lg hover:bg-[#0077ED] cursor-pointer"
                    >
                      Mua ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
