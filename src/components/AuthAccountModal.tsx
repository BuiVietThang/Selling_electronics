import React from 'react';
import { X, Check, ShieldCheck, LogOut, Eye, EyeOff } from 'lucide-react';

interface AuthAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  isUserLoggedIn: boolean;
  activeDisplayEmail: string;
  authTab: 'login' | 'register';
  setAuthTab: (tab: 'login' | 'register') => void;
  authError: string;
  setAuthError: (val: string) => void;
  authSuccessNotice: string;
  setAuthSuccessNotice: (val: string) => void;
  authLoading: boolean;
  authEmailInput: string;
  setAuthEmailInput: (val: string) => void;
  authPasswordInput: string;
  setAuthPasswordInput: (val: string) => void;
  authConfirmPasswordInput: string;
  setAuthConfirmPasswordInput: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  profileNameInput: string;
  setProfileNameInput: (val: string) => void;
  profilePhoneInput: string;
  setProfilePhoneInput: (val: string) => void;
  profileOrgInput: string;
  setProfileOrgInput: (val: string) => void;
  onRegisterWithPassword: (e: React.FormEvent) => void;
  onLoginWithPassword: (e: React.FormEvent) => void;
  onGoogleSignIn: () => void;
  onSaveUserProfile: (e: React.FormEvent) => void;
  onLogout: () => void;
}

export const AuthAccountModal: React.FC<AuthAccountModalProps> = ({
  isOpen,
  onClose,
  isUserLoggedIn,
  activeDisplayEmail,
  authTab,
  setAuthTab,
  authError,
  setAuthError,
  authSuccessNotice,
  setAuthSuccessNotice,
  authLoading,
  authEmailInput,
  setAuthEmailInput,
  authPasswordInput,
  setAuthPasswordInput,
  authConfirmPasswordInput,
  setAuthConfirmPasswordInput,
  showPassword,
  setShowPassword,
  profileNameInput,
  setProfileNameInput,
  profilePhoneInput,
  setProfilePhoneInput,
  profileOrgInput,
  setProfileOrgInput,
  onRegisterWithPassword,
  onLoginWithPassword,
  onGoogleSignIn,
  onSaveUserProfile,
  onLogout
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-sm w-full overflow-hidden border border-black/10 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.08]">
          <div>
            <span className="font-brand text-xs font-bold tracking-tight text-[#1D1D1F]">
              AETHER ID
            </span>
            <h3 className="text-base font-semibold text-[#1D1D1F] mt-0.5">
              {isUserLoggedIn
                ? 'Hồ Sơ Tài Khoản Kỹ Thuật'
                : authTab === 'login'
                ? 'Đăng Nhập Tài Khoản'
                : 'Đăng Ký Tài Khoản Mới'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.05] cursor-pointer"
            aria-label="Đóng hộp thoại tài khoản"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isUserLoggedIn ? (
          <form onSubmit={onSaveUserProfile} className="mt-4 space-y-3.5">
            <div className="p-3 rounded-xl bg-[#F5F5F7] flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[#1D1D1F] truncate">
                  {activeDisplayEmail}
                </div>
                <div className="text-[11px] text-[#6E6E73]">
                  Đã đăng nhập · Bảo mật thông tin AETHER ID
                </div>
              </div>
              <ShieldCheck className="w-4 h-4 text-[#0071E3] shrink-0 ml-2" />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                Họ và tên hiển thị
              </label>
              <input
                type="text"
                maxLength={100}
                value={profileNameInput}
                onChange={(e) => setProfileNameInput(e.target.value)}
                placeholder="Nguyễn Văn An"
                className="w-full px-3 py-2 text-xs bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                Số điện thoại liên hệ nhận hàng
              </label>
              <input
                type="tel"
                maxLength={30}
                value={profilePhoneInput}
                onChange={(e) => setProfilePhoneInput(e.target.value)}
                placeholder="0903 123 456"
                className="w-full px-3 py-2 text-xs bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3] font-mono-tabular"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                Địa chỉ / Đơn vị công tác
              </label>
              <input
                type="text"
                maxLength={120}
                value={profileOrgInput}
                onChange={(e) => setProfileOrgInput(e.target.value)}
                placeholder="Công ty TNHH Cơ Điện Tử..."
                className="w-full px-3 py-2 text-xs bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3]"
              />
            </div>

            {authError && (
              <p className="text-[11px] text-[#D70015] font-medium">{authError}</p>
            )}

            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                disabled={authLoading}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                {authLoading ? 'Đang lưu...' : 'Lưu Hồ Sơ'}
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-medium text-[#D70015] bg-[#D70015]/10 hover:bg-[#D70015]/15 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-4 space-y-3.5">
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#F5F5F7] rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('login');
                  setAuthError('');
                }}
                className={`py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  authTab === 'login'
                    ? 'bg-white text-[#1D1D1F] shadow-xs'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                Đăng Nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('register');
                  setAuthError('');
                  setAuthSuccessNotice('');
                }}
                className={`py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  authTab === 'register'
                    ? 'bg-white text-[#1D1D1F] shadow-xs'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                Đăng Ký Mới
              </button>
            </div>

            {authSuccessNotice && authTab === 'login' && (
              <div className="text-xs font-medium text-[#0071E3] bg-[#0071E3]/10 border border-[#0071E3]/20 px-3 py-2.5 rounded-xl flex items-start gap-2">
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authSuccessNotice}</span>
              </div>
            )}

            {authTab === 'register' ? (
              <form onSubmit={onRegisterWithPassword} className="space-y-2.5" noValidate>
                <div>
                  <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    value={profileNameInput}
                    onChange={(e) => setProfileNameInput(e.target.value)}
                    placeholder="Nguyễn Văn An"
                    className="w-full px-3 py-2 text-xs bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                    Email đăng nhập *
                  </label>
                  <input
                    type="email"
                    maxLength={120}
                    value={authEmailInput}
                    onChange={(e) => setAuthEmailInput(e.target.value)}
                    placeholder="email@doanhnghiep.vn"
                    className="w-full px-3 py-2 text-xs bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                      Mật khẩu *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={authPasswordInput}
                        onChange={(e) => setAuthPasswordInput(e.target.value)}
                        placeholder="≥ 6 ký tự"
                        className="w-full pl-3 pr-7 py-2 text-xs bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                      Nhập lại mật khẩu *
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={authConfirmPasswordInput}
                      onChange={(e) => setAuthConfirmPasswordInput(e.target.value)}
                      placeholder="Xác nhận"
                      className="w-full px-3 py-2 text-xs bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      maxLength={30}
                      value={profilePhoneInput}
                      onChange={(e) => setProfilePhoneInput(e.target.value)}
                      placeholder="0903 123 456"
                      className="w-full px-3 py-2 text-xs bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3] font-mono-tabular"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                      Công ty / Đơn vị
                    </label>
                    <input
                      type="text"
                      maxLength={120}
                      value={profileOrgInput}
                      onChange={(e) => setProfileOrgInput(e.target.value)}
                      placeholder="Tên đơn vị..."
                      className="w-full px-3 py-2 text-xs bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3]"
                    />
                  </div>
                </div>

                {authError && (
                  <div className="text-[11px] font-medium text-[#D70015] bg-[#D70015]/10 px-3 py-2 rounded-lg">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-xl transition-colors cursor-pointer disabled:opacity-50 mt-1"
                >
                  {authLoading ? 'Đang khởi tạo tài khoản...' : 'Đăng Ký Tài Khoản'}
                </button>
              </form>
            ) : (
              <form onSubmit={onLoginWithPassword} className="space-y-3" noValidate>
                <div>
                  <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                    Email đăng nhập
                  </label>
                  <input
                    type="email"
                    maxLength={120}
                    value={authEmailInput}
                    onChange={(e) => setAuthEmailInput(e.target.value)}
                    placeholder="email@doanhnghiep.vn"
                    className="w-full px-3 py-2 text-xs bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={authPasswordInput}
                      onChange={(e) => setAuthPasswordInput(e.target.value)}
                      placeholder="Nhập mật khẩu của bạn"
                      autoFocus={Boolean(authSuccessNotice)}
                      className="w-full pl-3 pr-8 py-2 text-xs bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="text-[11px] font-medium text-[#D70015] bg-[#D70015]/10 px-3 py-2 rounded-lg">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  {authLoading ? 'Đang kiểm tra...' : 'Đăng Nhập'}
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-black/[0.08]" />
                  <span className="flex-shrink mx-2 text-[10px] text-[#6E6E73]">
                    hoặc
                  </span>
                  <div className="flex-grow border-t border-black/[0.08]" />
                </div>

                <button
                  type="button"
                  disabled={authLoading}
                  onClick={onGoogleSignIn}
                  className="w-full py-2 px-4 text-xs font-medium text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED] border border-black/10 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Tiếp tục nhanh với Google</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
