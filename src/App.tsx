import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  ArrowUpRight,
  Check,
  X,
  Search,
  Scale,
  User as UserIcon,
  Heart,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal
} from 'lucide-react';
import {
  onAuthStateChanged,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  User
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType
} from './firebase';
import {
  PRODUCTS,
  CASE_STUDIES,
  HERO_BANNER_IMAGE,
  PROMO_VOUCHERS,
  Product,
  ProductCategory,
  formatVND
} from './data/products';
import { ResilientImage } from './components/ResilientImage';
import {
  CartCheckoutDrawer,
  CartItem,
  OrderRecord
} from './components/CartCheckoutDrawer';
import { AuthAccountModal } from './components/AuthAccountModal';
import { ProductConfiguratorModal } from './components/ProductConfiguratorModal';
import { CompareProductsModal } from './components/CompareProductsModal';

interface UserProfileData {
  uid: string;
  displayName: string;
  email: string;
  phone: string;
  organization: string;
}

interface LocalAccountRecord {
  uid: string;
  email: string;
  password: string;
  displayName: string;
  phone: string;
  organization: string;
}

const LOCAL_ACCOUNTS_KEY = 'aether_registered_accounts_v1';
const LOCAL_ACTIVE_SESSION_KEY = 'aether_active_session_v1';
const LOCAL_ORDERS_KEY = 'aether_orders_history_v1';
const LOCAL_WISHLIST_KEY = 'aether_wishlist_ids_v1';

export default function App() {
  // Firebase Auth & Local Session State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [localSessionUser, setLocalSessionUser] = useState<UserProfileData | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isRegisteringFlow, setIsRegisteringFlow] = useState(false);

  // Compact Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccessNotice, setAuthSuccessNotice] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);

  // Auth Form Inputs
  const [authEmailInput, setAuthEmailInput] = useState('');
  const [authPasswordInput, setAuthPasswordInput] = useState('');
  const [authConfirmPasswordInput, setAuthConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Profile fields
  const [profileNameInput, setProfileNameInput] = useState('');
  const [profilePhoneInput, setProfilePhoneInput] = useState('');
  const [profileOrgInput, setProfileOrgInput] = useState('');

  // Storefront Catalog Controls (Default 6 Featured Products + Show All Toggle)
  const [selectedCategory, setSelectedCategory] = useState<'all' | ProductCategory>('all');
  const [priceRangeFilter, setPriceRangeFilter] = useState<'all' | 'under-40m' | '40m-80m' | 'over-80m'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [onlyWishlistFilter, setOnlyWishlistFilter] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Selected product for Configurator Modal
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');

  // Comparison List
  const [compareIds, setCompareIds] = useState<string[]>([
    'aether-book-pro-16',
    'aether-pure-climate-s1',
    'aether-servo-hd90'
  ]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Architecture Layer tab
  const [activeArchitectureLayer, setActiveArchitectureLayer] = useState<
    'silicon' | 'acoustic' | 'actuation'
  >('silicon');

  // E-Commerce Cart, Checkout, Vouchers & Order History
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      optionId: PRODUCTS[0].options[0].id,
      optionLabel: PRODUCTS[0].options[0].label,
      unitPrice: PRODUCTS[0].basePrice,
      quantity: 1
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucherCode, setAppliedVoucherCode] = useState('');
  const [shippingMethod, setShippingMethod] = useState<OrderRecord['shippingMethod']>('standard_24h');
  const [paymentMethod, setPaymentMethod] = useState<OrderRecord['paymentMethod']>('bank_transfer');
  const [shippingAddress, setShippingAddress] = useState('');
  const [needVatInvoice, setNeedVatInvoice] = useState(false);
  const [vatCompanyInfo, setVatCompanyInfo] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderRecord[]>([]);

  // Lead Capture / Consultation Form
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerOrg, setCustomerOrg] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [inquiryCategory, setInquiryCategory] = useState<ProductCategory>('computing');
  const [formError, setFormError] = useState('');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3400);
  };

  const getLocalAccounts = (): LocalAccountRecord[] => {
    try {
      const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
      return raw ? (JSON.parse(raw) as LocalAccountRecord[]) : [];
    } catch {
      return [];
    }
  };

  const saveLocalAccount = (record: LocalAccountRecord) => {
    const list = getLocalAccounts().filter(
      (a) => a.email.toLowerCase() !== record.email.toLowerCase()
    );
    list.push(record);
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(list));
  };

  // Restore local session, wishlist, and order history
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(LOCAL_ACTIVE_SESSION_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession) as UserProfileData;
        setLocalSessionUser(parsed);
        setUserProfile(parsed);
        setProfileNameInput(parsed.displayName);
        setProfilePhoneInput(parsed.phone);
        setProfileOrgInput(parsed.organization);
        setCustomerName((prev) => prev || parsed.displayName);
        setCustomerEmail((prev) => prev || parsed.email);
        setCustomerPhone((prev) => prev || parsed.phone);
        setCustomerOrg((prev) => prev || parsed.organization);
        setShippingAddress((prev) => prev || parsed.organization);
      }

      const savedOrders = localStorage.getItem(LOCAL_ORDERS_KEY);
      if (savedOrders) {
        setOrderHistory(JSON.parse(savedOrders) as OrderRecord[]);
      }

      const savedWishlist = localStorage.getItem(LOCAL_WISHLIST_KEY);
      if (savedWishlist) {
        setWishlistIds(JSON.parse(savedWishlist) as string[]);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Listen to Firebase Auth state & load private profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (isRegisteringFlow) return;

      setCurrentUser(user);
      setAuthReady(true);

      if (user) {
        const profilePath = `users/${user.uid}/private/profile`;
        try {
          const snap = await getDoc(doc(db, 'users', user.uid, 'private', 'profile'));
          if (snap.exists()) {
            const data = snap.data() as UserProfileData;
            setUserProfile(data);
            setProfileNameInput(data.displayName || user.displayName || '');
            setProfilePhoneInput(data.phone || '');
            setProfileOrgInput(data.organization || '');
            setCustomerName((prev) => prev || data.displayName || user.displayName || '');
            setCustomerEmail((prev) => prev || data.email || user.email || '');
            setCustomerPhone((prev) => prev || data.phone || '');
            setCustomerOrg((prev) => prev || data.organization || '');
            setShippingAddress((prev) => prev || data.organization || '');
          } else {
            const initialProfile: UserProfileData = {
              uid: user.uid,
              displayName: (user.displayName || 'Thành viên AETHER').slice(0, 100),
              email: (user.email || '').slice(0, 120),
              phone: '',
              organization: ''
            };
            setUserProfile(initialProfile);
            setProfileNameInput(initialProfile.displayName);
            setCustomerName((prev) => prev || initialProfile.displayName);
            setCustomerEmail((prev) => prev || initialProfile.email);

            if (initialProfile.email.length >= 3) {
              await setDoc(doc(db, 'users', user.uid, 'private', 'profile'), {
                ...initialProfile,
                updatedAt: serverTimestamp()
              });
            }
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, profilePath);
        }
      }
    });

    return () => unsubscribe();
  }, [isRegisteringFlow]);

  const isUserLoggedIn = Boolean(currentUser || localSessionUser);
  const activeDisplayEmail = currentUser?.email || localSessionUser?.email || '';
  const activeDisplayName =
    userProfile?.displayName ||
    currentUser?.displayName ||
    localSessionUser?.displayName ||
    'Tài khoản';

  // Toggle Wishlist
  const toggleWishlist = (productId: string, productName: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const updated = exists
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(updated));
      triggerToast(
        exists
          ? `Đã bỏ ${productName} khỏi danh sách quan tâm`
          : `Đã lưu ${productName} vào danh sách quan tâm`
      );
      return updated;
    });
  };

  // Register with password -> signOut -> switch to login form
  const handleRegisterWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessNotice('');

    const cleanName = profileNameInput.trim();
    const cleanEmail = authEmailInput.trim().toLowerCase();
    const cleanPhone = profilePhoneInput.trim();
    const cleanOrg = profileOrgInput.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanName) {
      setAuthError('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!emailRegex.test(cleanEmail)) {
      setAuthError('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    if (authPasswordInput.length < 6) {
      setAuthError('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }
    if (authPasswordInput !== authConfirmPasswordInput) {
      setAuthError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setAuthLoading(true);
    setIsRegisteringFlow(true);

    try {
      const generatedUid = `usr_${Date.now().toString(36)}`;
      saveLocalAccount({
        uid: generatedUid,
        email: cleanEmail,
        password: authPasswordInput,
        displayName: cleanName.slice(0, 100),
        phone: cleanPhone.slice(0, 30),
        organization: cleanOrg.slice(0, 120)
      });

      try {
        const cred = await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          authPasswordInput
        );
        await updateProfile(cred.user, {
          displayName: cleanName.slice(0, 100)
        });

        await setDoc(doc(db, 'users', cred.user.uid, 'private', 'profile'), {
          uid: cred.user.uid,
          displayName: cleanName.slice(0, 100),
          email: cleanEmail.slice(0, 120),
          phone: cleanPhone.slice(0, 30),
          organization: cleanOrg.slice(0, 120),
          updatedAt: serverTimestamp()
        });

        await signOut(auth);
      } catch (fbErr: unknown) {
        const errCode = (fbErr as { code?: string })?.code || '';
        if (errCode === 'auth/email-already-in-use') {
          setAuthError('Email này đã được đăng ký. Vui lòng chuyển sang Đăng nhập.');
          setIsRegisteringFlow(false);
          setAuthLoading(false);
          return;
        }
      }

      setCurrentUser(null);
      setLocalSessionUser(null);
      localStorage.removeItem(LOCAL_ACTIVE_SESSION_KEY);

      setAuthTab('login');
      setAuthEmailInput(cleanEmail);
      setAuthPasswordInput('');
      setAuthConfirmPasswordInput('');
      setAuthSuccessNotice(
        'Đăng ký thành công! Vui lòng nhập mật khẩu của bạn để đăng nhập.'
      );
      triggerToast('Đăng ký tài khoản thành công. Mời bạn đăng nhập!');
    } finally {
      setIsRegisteringFlow(false);
      setAuthLoading(false);
    }
  };

  // Login with email & password
  const handleLoginWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessNotice('');

    const cleanEmail = authEmailInput.trim().toLowerCase();
    if (!cleanEmail) {
      setAuthError('Vui lòng nhập địa chỉ email.');
      return;
    }
    if (!authPasswordInput) {
      setAuthError('Vui lòng nhập mật khẩu để đăng nhập.');
      return;
    }

    setAuthLoading(true);
    try {
      try {
        const cred = await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          authPasswordInput
        );
        const user = cred.user;
        setAuthPasswordInput('');
        setIsAuthModalOpen(false);
        triggerToast(`Đăng nhập thành công. Xin chào ${user.displayName || user.email}!`);
        return;
      } catch (fbErr: unknown) {
        const errCode = (fbErr as { code?: string })?.code || '';
        const accounts = getLocalAccounts();
        const matched = accounts.find(
          (a) => a.email.toLowerCase() === cleanEmail
        );

        if (matched) {
          if (matched.password !== authPasswordInput) {
            setAuthError('Mật khẩu không chính xác. Vui lòng kiểm tra lại.');
            return;
          }
          const profileObj: UserProfileData = {
            uid: matched.uid,
            displayName: matched.displayName,
            email: matched.email,
            phone: matched.phone,
            organization: matched.organization
          };
          setLocalSessionUser(profileObj);
          setUserProfile(profileObj);
          localStorage.setItem(LOCAL_ACTIVE_SESSION_KEY, JSON.stringify(profileObj));

          setProfileNameInput(profileObj.displayName);
          setProfilePhoneInput(profileObj.phone);
          setProfileOrgInput(profileObj.organization);
          setCustomerName(profileObj.displayName);
          setCustomerEmail(profileObj.email);
          if (profileObj.phone) setCustomerPhone(profileObj.phone);
          if (profileObj.organization) {
            setCustomerOrg(profileObj.organization);
            setShippingAddress((prev) => prev || profileObj.organization);
          }

          setAuthPasswordInput('');
          setIsAuthModalOpen(false);
          triggerToast(`Đăng nhập thành công. Xin chào ${profileObj.displayName}!`);
          return;
        }

        if (
          errCode === 'auth/wrong-password' ||
          errCode === 'auth/invalid-credential'
        ) {
          setAuthError('Email hoặc mật khẩu không chính xác.');
        } else {
          setAuthError(
            'Tài khoản chưa được đăng ký hoặc mật khẩu không đúng. Vui lòng đăng ký mới.'
          );
        }
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setAuthSuccessNotice('');
    setAuthLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const sanitizedName = (
        profileNameInput.trim() ||
        user.displayName ||
        'Thành viên AETHER'
      ).slice(0, 100);
      const sanitizedEmail = (user.email || 'user@aether.vn').slice(0, 120);
      const sanitizedPhone = profilePhoneInput.trim().slice(0, 30);
      const sanitizedOrg = profileOrgInput.trim().slice(0, 120);

      const profilePath = `users/${user.uid}/private/profile`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'private', 'profile'), {
          uid: user.uid,
          displayName: sanitizedName,
          email: sanitizedEmail,
          phone: sanitizedPhone,
          organization: sanitizedOrg,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, profilePath);
      }

      setUserProfile({
        uid: user.uid,
        displayName: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        organization: sanitizedOrg
      });
      setCustomerName(sanitizedName);
      setCustomerEmail(sanitizedEmail);
      if (sanitizedPhone) setCustomerPhone(sanitizedPhone);
      if (sanitizedOrg) {
        setCustomerOrg(sanitizedOrg);
        setShippingAddress((prev) => prev || sanitizedOrg);
      }

      setIsAuthModalOpen(false);
      triggerToast(`Xin chào, ${sanitizedName}`);
    } catch {
      setAuthError('Không thể hoàn tất xác thực Google. Vui lòng thử lại.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveUserProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const sanitizedName = (profileNameInput.trim() || 'Thành viên AETHER').slice(0, 100);
    const sanitizedEmail = activeDisplayEmail.slice(0, 120);
    const sanitizedPhone = profilePhoneInput.trim().slice(0, 30);
    const sanitizedOrg = profileOrgInput.trim().slice(0, 120);

    try {
      if (currentUser) {
        const profilePath = `users/${currentUser.uid}/private/profile`;
        try {
          await setDoc(doc(db, 'users', currentUser.uid, 'private', 'profile'), {
            uid: currentUser.uid,
            displayName: sanitizedName,
            email: sanitizedEmail,
            phone: sanitizedPhone,
            organization: sanitizedOrg,
            updatedAt: serverTimestamp()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, profilePath);
        }
      }

      if (localSessionUser) {
        const updatedLocal: UserProfileData = {
          ...localSessionUser,
          displayName: sanitizedName,
          phone: sanitizedPhone,
          organization: sanitizedOrg
        };
        setLocalSessionUser(updatedLocal);
        localStorage.setItem(LOCAL_ACTIVE_SESSION_KEY, JSON.stringify(updatedLocal));
      }

      setUserProfile({
        uid: currentUser?.uid || localSessionUser?.uid || 'local',
        displayName: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        organization: sanitizedOrg
      });
      setCustomerName(sanitizedName);
      setCustomerPhone(sanitizedPhone);
      setCustomerOrg(sanitizedOrg);
      setShippingAddress((prev) => prev || sanitizedOrg);

      setIsAuthModalOpen(false);
      triggerToast('Đã lưu thông tin hồ sơ AETHER ID');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (currentUser) {
      await signOut(auth);
    }
    setLocalSessionUser(null);
    setUserProfile(null);
    localStorage.removeItem(LOCAL_ACTIVE_SESSION_KEY);
    setIsAuthModalOpen(false);
    triggerToast('Đã đăng xuất khỏi tài khoản AETHER ID');
  };

  // E-Commerce Filter, Price Range, Wishlist & Sort
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesWishlist = !onlyWishlistFilter || wishlistIds.includes(p.id);
    const matchesPrice =
      priceRangeFilter === 'all'
        ? true
        : priceRangeFilter === 'under-40m'
        ? p.basePrice < 40000000
        : priceRangeFilter === '40m-80m'
        ? p.basePrice >= 40000000 && p.basePrice <= 80000000
        : p.basePrice > 80000000;

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.specs.some((s) => s.value.toLowerCase().includes(q));
    return matchesCat && matchesWishlist && matchesPrice && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
    if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
    return a.featuredPriority - b.featuredPriority;
  });

  // Show only 6 products by default unless user clicks the expand button
  const visibleProducts = showAllProducts
    ? filteredProducts
    : filteredProducts.slice(0, 6);

  const hiddenProductsCount = Math.max(0, filteredProducts.length - 6);

  const openProductModal = (product: Product) => {
    setActiveProduct(product);
    setSelectedOptionId(product.options[0].id);
  };

  const toggleCompareProduct = (productId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        triggerToast('Tối đa 3 thiết bị trong bảng đối chiếu thông số');
        return [...prev.slice(1), productId];
      }
      return [...prev, productId];
    });
  };

  const comparedProducts = compareIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const handleAddToCart = (
    product: Product,
    optionId?: string,
    openDrawer = false
  ) => {
    const chosenOption =
      product.options.find((o) => o.id === optionId) || product.options[0];
    const unitPrice = product.basePrice + chosenOption.priceDelta;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id && item.optionId === chosenOption.id
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          optionId: chosenOption.id,
          optionLabel: chosenOption.label,
          unitPrice,
          quantity: 1
        }
      ];
    });

    setConfirmedOrder(null);
    if (openDrawer) {
      setIsCartOpen(true);
    } else {
      triggerToast(`Đã thêm ${product.name} vào giỏ hàng`);
    }
  };

  const updateCartQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev];
      const nextQty = updated[index].quantity + delta;
      if (nextQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].quantity = nextQty;
      return updated;
    });
  };

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalAmount = cart.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );

  // Voucher Calculation
  const activeVoucherObj = PROMO_VOUCHERS.find(
    (v) => v.code === appliedVoucherCode
  );
  const discountAmount = activeVoucherObj
    ? subtotalAmount >= activeVoucherObj.minOrderAmount
      ? activeVoucherObj.discountFixed
        ? activeVoucherObj.discountFixed
        : activeVoucherObj.discountPercent
        ? Math.round((subtotalAmount * activeVoucherObj.discountPercent) / 100)
        : 0
      : 0
    : 0;

  const shippingFee =
    shippingMethod === 'standard_24h'
      ? 0
      : shippingMethod === 'express_2h'
      ? 350000
      : 1200000;

  const finalTotalAmount = Math.max(0, subtotalAmount - discountAmount + shippingFee);

  const handleApplyVoucher = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      setAppliedVoucherCode('');
      return;
    }
    const found = PROMO_VOUCHERS.find((v) => v.code === clean);
    if (!found) {
      triggerToast('Mã ưu đãi không tồn tại. Vui lòng kiểm tra lại.');
      return;
    }
    if (subtotalAmount < found.minOrderAmount) {
      triggerToast(
        `Mã ${found.code} yêu cầu giá trị đơn tối thiểu ${formatVND(found.minOrderAmount)}`
      );
      return;
    }
    setAppliedVoucherCode(found.code);
    triggerToast(`Đã áp dụng mã ${found.code}: ${found.label}`);
  };

  const handleCheckoutConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const cleanName = customerName.trim().slice(0, 100);
    const cleanPhone = customerPhone.trim().slice(0, 30);
    const cleanAddr = shippingAddress.trim().slice(0, 250);
    const cleanVat = vatCompanyInfo.trim().slice(0, 200);

    if (!cleanName || cleanPhone.length < 5 || cleanAddr.length < 3) {
      setFormError(
        'Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng chi tiết.'
      );
      return;
    }
    setFormError('');

    const orderCode = `ATH-${Math.floor(100000 + Math.random() * 900000)}`;
    const itemsSummary = cart
      .map((i) => `${i.product.name} (x${i.quantity})`)
      .join(', ')
      .slice(0, 800);

    const newOrder: OrderRecord = {
      orderCode,
      uid: currentUser?.uid || localSessionUser?.uid || 'guest',
      customerName: cleanName,
      customerPhone: cleanPhone,
      shippingAddress: cleanAddr,
      paymentMethod,
      shippingMethod,
      voucherCode: appliedVoucherCode.slice(0, 30),
      needVatInvoice,
      vatCompanyInfo: cleanVat,
      itemsSummary,
      itemCount: totalCartItems,
      subtotalAmount,
      discountAmount,
      shippingFee,
      totalAmount: finalTotalAmount,
      status: 'confirmed',
      createdAtLabel: new Date().toLocaleDateString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Persist to Firestore if authenticated via Firebase
    if (currentUser) {
      const orderPath = `users/${currentUser.uid}/orders/${orderCode}`;
      try {
        await setDoc(doc(db, 'users', currentUser.uid, 'orders', orderCode), {
          orderCode: newOrder.orderCode,
          uid: currentUser.uid,
          customerName: newOrder.customerName,
          customerPhone: newOrder.customerPhone,
          shippingAddress: newOrder.shippingAddress,
          paymentMethod: newOrder.paymentMethod,
          shippingMethod: newOrder.shippingMethod,
          voucherCode: newOrder.voucherCode,
          needVatInvoice: newOrder.needVatInvoice,
          vatCompanyInfo: newOrder.vatCompanyInfo,
          itemsSummary: newOrder.itemsSummary,
          itemCount: newOrder.itemCount,
          subtotalAmount: newOrder.subtotalAmount,
          discountAmount: newOrder.discountAmount,
          shippingFee: newOrder.shippingFee,
          totalAmount: newOrder.totalAmount,
          status: 'confirmed',
          createdAt: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, orderPath);
      }
    }

    const updatedHistory = [newOrder, ...orderHistory];
    setOrderHistory(updatedHistory);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updatedHistory));

    setConfirmedOrder(newOrder);
    setCart([]);
    setAppliedVoucherCode('');
    triggerToast(`Đặt hàng thành công! Mã vận đơn: #${orderCode}`);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\-\s()]{9,15}$/;

    if (!customerName.trim()) {
      setFormError('Vui lòng nhập họ tên người liên hệ.');
      return;
    }
    if (!emailRegex.test(customerEmail.trim())) {
      setFormError('Vui lòng nhập địa chỉ email doanh nghiệp hoặc cá nhân hợp lệ.');
      return;
    }
    if (!phoneRegex.test(customerPhone.trim())) {
      setFormError('Vui lòng nhập số điện thoại hợp lệ (9–15 chữ số).');
      return;
    }

    setQuoteSubmitted(true);
    triggerToast('Yêu cầu kỹ thuật & báo giá đã được ghi nhận.');
  };

  const countByCategory = (cat: ProductCategory) =>
    PRODUCTS.filter((p) => p.category === cat).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] text-[#1D1D1F]">
      {/* Sticky Top Bar following strict 3-Zone Contract */}
      <header className="sticky top-0 z-40 h-14 bg-[#000000]/85 backdrop-blur-xl border-b border-white/[0.1] px-6 lg:px-12 flex items-center justify-between text-white">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-brand text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          AETHER
        </a>

        {/* Zone 2: 5 single-line navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/75">
          <a
            href="#catalog"
            onClick={() => setSelectedCategory('computing')}
            className="hover:text-white transition-colors duration-150 whitespace-nowrap"
          >
            Laptop & Máy Trạm
          </a>
          <a
            href="#catalog"
            onClick={() => setSelectedCategory('appliances')}
            className="hover:text-white transition-colors duration-150 whitespace-nowrap"
          >
            Gia Dụng
          </a>
          <a
            href="#catalog"
            onClick={() => setSelectedCategory('industrial')}
            className="hover:text-white transition-colors duration-150 whitespace-nowrap"
          >
            Công Nghiệp
          </a>
          <a
            href="#architecture"
            className="hover:text-white transition-colors duration-150 whitespace-nowrap"
          >
            Kiến Trúc
          </a>
          <a
            href="#proof"
            className="hover:text-white transition-colors duration-150 whitespace-nowrap"
          >
            Triển Khai
          </a>
        </nav>

        {/* Zone 3: 2 primary actions (Compact Auth Trigger + Cart Trigger) */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setAuthError('');
              setAuthSuccessNotice('');
              setIsAuthModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/90 hover:text-white bg-white/[0.08] hover:bg-white/[0.15] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer max-w-[170px]"
          >
            <UserIcon className="w-3.5 h-3.5 text-[#2997FF] shrink-0" />
            <span className="truncate">
              {authReady && isUserLoggedIn ? activeDisplayName : 'Đăng nhập'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
            aria-label="Giỏ hàng và đơn hàng"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Giỏ hàng ({totalCartItems})</span>
          </button>
        </div>
      </header>

      {/* Subtle Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1D1D1F] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-lg border border-white/15 flex items-center gap-2.5 transition-opacity duration-150">
          <Check className="w-4 h-4 text-[#2997FF] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main id="top" className="flex-1">
        {/* SECTION 1: FULL-BLEED FIRST-SCREEN HERO BANNER (100vh Apple Keynote Style) */}
        <section className="relative w-full min-h-[calc(100vh-3.5rem)] bg-[#000000] text-[#F5F5F7] flex flex-col justify-between overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 z-0">
            <ResilientImage
              src={HERO_BANNER_IMAGE}
              alt="AETHER Full Ecosystem Banner — Titanium Laptop, Smart Home Purifier, and Robotic Servo Actuator"
              category="computing"
              title="AETHER Ecosystem 2026"
              className="w-full h-full object-cover object-center scale-[1.01]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-black/95" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(0,0,0,0.75)_100%)]" />
          </div>

          <div className="relative z-10 max-w-[1200px] w-full mx-auto px-6 pt-12 sm:pt-16 lg:pt-20 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-white/75 mb-4 tracking-wide">
              <span>AETHER Precision Hardware Storefront</span>
              <span aria-hidden="true">·</span>
              <span>18 Dòng Thiết Bị Độc Bản 2026</span>
              <span aria-hidden="true">·</span>
              <span>Ưu đãi mã AETHER2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-semibold tracking-tight text-white leading-[1.06] max-w-4xl mx-auto">
              Chuẩn mực cơ khí chính xác. Từ bàn làm việc đến dây chuyền tự động.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto font-normal">
              Hệ sinh thái thương mại điện tử chuyên nghiệp cung cấp máy trạm di động Titanium, máy móc gia dụng kiến trúc siêu tĩnh lặng và linh kiện tự động hóa công nghiệp.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#catalog"
                className="px-7 py-3.5 text-sm font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-xl transition-transform duration-150 active:scale-[0.99] whitespace-nowrap shadow-lg"
              >
                Mua Sắm Hệ Sinh Thái 2026
              </a>
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-white bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl border border-white/15 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Scale className="w-4 h-4 text-[#2997FF]" />
                <span>So Sánh Thông Số ({compareIds.length}/3)</span>
              </button>
            </div>
          </div>

          <div className="relative z-10 w-full bg-black/65 backdrop-blur-xl border-t border-white/15 mt-12">
            <div className="max-w-[1200px] mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div
                onClick={() => {
                  setSelectedCategory('computing');
                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group cursor-pointer pt-4 md:pt-0 md:px-4 first:pt-0 first:pl-0"
              >
                <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                  <span>01. Điện Toán Hiệu Năng Cao · 06 Sản phẩm</span>
                  <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-[#2997FF] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h2 className="text-base font-semibold text-white group-hover:text-[#2997FF] transition-colors">
                  Laptop, Máy Trạm, Tablet CAD & Server 2U
                </h2>
                <p className="text-xs text-[#A1A1A6] mt-1 leading-relaxed">
                  AetherBook Pro 16, Air 14, Studio Ultra, màn hình 6K XDR, AetherPad 13 và Server Blade R2.
                </p>
              </div>

              <div
                onClick={() => {
                  setSelectedCategory('appliances');
                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group cursor-pointer pt-4 md:pt-0 md:px-6"
              >
                <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                  <span>02. Máy Móc Gia Dụng Kiến Trúc · 06 Sản phẩm</span>
                  <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-[#2997FF] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h2 className="text-base font-semibold text-white group-hover:text-[#2997FF] transition-colors">
                  Khí Hậu, Hút Bụi, Espresso, Bếp Từ & Tủ Hấp
                </h2>
                <p className="text-xs text-[#A1A1A6] mt-1 leading-relaxed">
                  AtmosTower S1, AeroCyclone V12, BaristaCore E1, HydroSonic W8, AeroWardrobe V2 và ThermoPlate S4.
                </p>
              </div>

              <div
                onClick={() => {
                  setSelectedCategory('industrial');
                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group cursor-pointer pt-4 md:pt-0 md:pl-6"
              >
                <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                  <span>03. Linh Kiện Công Nghiệp · 06 Sản phẩm</span>
                  <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-[#2997FF] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h2 className="text-base font-semibold text-white group-hover:text-[#2997FF] transition-colors">
                  Servo, LiDAR, Cobot, Biến Tần GaN & MagLev
                </h2>
                <p className="text-xs text-[#A1A1A6] mt-1 leading-relaxed">
                  HarmonicDrive X-90, OpticCore M4, AetherArm C6, PowerCore G800, bàn từ MagLev M8 và PLC NexusEdge.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: COMPLETE E-COMMERCE STOREFRONT (DEFAULT 6 ITEMS + EXPAND BUTTON) */}
        <section id="catalog" className="py-20 lg:py-28 bg-white border-b border-black/[0.06]">
          <div className="max-w-[1200px] mx-auto px-6">
            {/* Storefront Header & Category Filter Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#6E6E73] mb-2">
                  <span>Cửa hàng trực tuyến chính hãng</span>
                  <span aria-hidden="true">·</span>
                  <span>18 Sản phẩm sẵn kho</span>
                  <span aria-hidden="true">·</span>
                  <span>Trả góp 0% & Xuất VAT tự động</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
                  Chọn thiết bị. Cấu hình & Đặt giao ngay.
                </h2>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-[#F5F5F7] rounded-xl self-start overflow-x-auto max-w-full">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-[#1D1D1F] text-white'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Tất Cả ({PRODUCTS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('computing')}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === 'computing'
                      ? 'bg-[#1D1D1F] text-white'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Laptop & Máy Trạm ({countByCategory('computing')})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('appliances')}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === 'appliances'
                      ? 'bg-[#1D1D1F] text-white'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Gia Dụng ({countByCategory('appliances')})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('industrial')}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === 'industrial'
                      ? 'bg-[#1D1D1F] text-white'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Công Nghiệp ({countByCategory('industrial')})
                </button>
              </div>
            </div>

            {/* E-Commerce Filter Toolbar: Search, Price Filter, Wishlist Toggle, Sort & Compare */}
            <div className="mb-10 p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.06] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#6E6E73] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên thiết bị, mã SKU, thông số (VD: OLED, LiDAR, GaN, MagLev, Bếp từ)..."
                  className="w-full pl-10 pr-8 py-2 text-xs bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#0071E3] text-[#1D1D1F]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                    aria-label="Xóa tìm kiếm"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Price Tier Filter + Wishlist Filter + Sort + Compare */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Price Filter Select */}
                <div className="flex items-center gap-1.5 text-xs text-[#6E6E73] bg-white border border-black/10 rounded-xl px-3 py-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#0071E3]" />
                  <select
                    value={priceRangeFilter}
                    onChange={(e) =>
                      setPriceRangeFilter(
                        e.target.value as 'all' | 'under-40m' | '40m-80m' | 'over-80m'
                      )
                    }
                    className="bg-transparent text-xs font-medium text-[#1D1D1F] focus:outline-none cursor-pointer"
                  >
                    <option value="all">Mọi mức giá</option>
                    <option value="under-40m">Dưới 40 triệu</option>
                    <option value="40m-80m">Từ 40 – 80 triệu</option>
                    <option value="over-80m">Trên 80 triệu</option>
                  </select>
                </div>

                {/* Sort Select */}
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')
                  }
                  className="bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs font-medium text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] cursor-pointer"
                >
                  <option value="featured">Sắp xếp: Tiêu biểu</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                </select>

                {/* Wishlist Filter Button */}
                <button
                  type="button"
                  onClick={() => setOnlyWishlistFilter(!onlyWishlistFilter)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors whitespace-nowrap cursor-pointer ${
                    onlyWishlistFilter
                      ? 'bg-[#D70015]/10 border-[#D70015] text-[#D70015]'
                      : 'bg-white border-black/10 text-[#1D1D1F] hover:bg-black/[0.03]'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      onlyWishlistFilter ? 'fill-[#D70015] text-[#D70015]' : 'text-[#6E6E73]'
                    }`}
                  />
                  <span>Đã lưu ({wishlistIds.length})</span>
                </button>

                {/* Compare Trigger */}
                <button
                  type="button"
                  onClick={() => setIsCompareModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#1D1D1F] bg-white hover:bg-black/[0.04] border border-black/15 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>So sánh ({compareIds.length}/3)</span>
                </button>
              </div>
            </div>

            {/* Empty State if filters return 0 */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-[#F9F9FB] rounded-2xl border border-black/[0.06]">
                <p className="text-base font-semibold text-[#1D1D1F]">
                  Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại
                </p>
                <p className="text-xs text-[#6E6E73] mt-1">
                  Hãy thử mở rộng khoảng giá hoặc đặt lại bộ lọc danh mục.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setPriceRangeFilter('all');
                    setOnlyWishlistFilter(false);
                  }}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#0071E3] rounded-lg cursor-pointer"
                >
                  Đặt Lại Toàn Bộ Bộ Lọc
                </button>
              </div>
            ) : (
              <>
                {/* 3-Column Storefront Product Grid (Shows 6 initially, or all when expanded) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {visibleProducts.map((product) => {
                    const isCompared = compareIds.includes(product.id);
                    const isWishlisted = wishlistIds.includes(product.id);
                    return (
                      <article
                        key={product.id}
                        className="group bg-[#F9F9FB] rounded-2xl border border-black/[0.07] overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5"
                      >
                        <div>
                          {/* 4:3 Product Image Slot (Unique per product) */}
                          <div className="aspect-[4/3] w-full bg-[#18181B] overflow-hidden relative">
                            <div
                              onClick={() => openProductModal(product)}
                              className="w-full h-full cursor-pointer"
                            >
                              <ResilientImage
                                src={product.imageUrl}
                                alt={product.name}
                                category={product.category}
                                title={product.name}
                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                              />
                            </div>
                            {/* Wishlist Heart Button */}
                            <button
                              type="button"
                              onClick={() => toggleWishlist(product.id, product.name)}
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md flex items-center justify-center text-white transition-colors cursor-pointer"
                              aria-label="Lưu sản phẩm yêu thích"
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  isWishlisted ? 'fill-[#FF375F] text-[#FF375F]' : 'text-white'
                                }`}
                              />
                            </button>
                          </div>

                          {/* Card Content */}
                          <div className="p-6">
                            {/* Unboxed Metadata with Middot Separator */}
                            <div className="flex items-center justify-between gap-2 text-xs text-[#6E6E73] mb-2">
                              <div className="flex items-center gap-1.5 truncate">
                                <span>{product.categoryLabel}</span>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono-tabular">{product.sku}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleCompareProduct(product.id)}
                                className={`text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                                  isCompared
                                    ? 'text-[#0071E3] font-semibold'
                                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                                }`}
                              >
                                {isCompared ? '✓ So sánh' : '+ So sánh'}
                              </button>
                            </div>

                            <h3
                              onClick={() => openProductModal(product)}
                              className="text-lg font-semibold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors cursor-pointer"
                            >
                              {product.name}
                            </h3>

                            <p className="text-xs text-[#515154] mt-1.5 leading-relaxed line-clamp-2">
                              {product.subtitle}
                            </p>

                            {/* Stock & Lead Time Unboxed Metadata */}
                            <div className="mt-3 flex items-center gap-2 text-[11px] text-[#6E6E73]">
                              <span className="text-[#1D1D1F] font-medium">
                                Sẵn kho: {product.stockCount} máy
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{product.leadTime}</span>
                            </div>

                            {/* Key Technical Specs Preview */}
                            <div className="mt-3.5 pt-3.5 border-t border-black/[0.06] space-y-1.5">
                              {product.specs.slice(0, 3).map((spec) => (
                                <div
                                  key={spec.label}
                                  className="flex items-baseline justify-between gap-2 text-xs"
                                >
                                  <span className="text-[#6E6E73] shrink-0">{spec.label}</span>
                                  <span className="font-mono-tabular text-[#1D1D1F] font-medium text-right truncate">
                                    {spec.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Card Footer: Price & E-Commerce Dual Actions */}
                        <div className="p-6 pt-4 border-t border-black/[0.06] bg-white flex items-center justify-between gap-2">
                          <div>
                            <span className="block text-[11px] text-[#6E6E73]">
                              Giá niêm yết (Gồm VAT)
                            </span>
                            <span className="font-mono-tabular text-base font-bold text-[#1D1D1F]">
                              {formatVND(product.basePrice)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleAddToCart(product, undefined, false)}
                              className="px-3 py-2 text-xs font-medium text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                            >
                              + Giỏ hàng
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddToCart(product, undefined, true)}
                              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                            >
                              Mua ngay
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* EXPAND / COLLAPSE BUTTON FOR HIDDEN PRODUCTS (DEFAULT 6 SHOWN) */}
                {filteredProducts.length > 6 && (
                  <div className="mt-12 pt-8 border-t border-black/[0.06] flex flex-col items-center text-center">
                    <p className="text-xs text-[#6E6E73] mb-4">
                      Đang hiển thị{' '}
                      <span className="font-mono-tabular font-semibold text-[#1D1D1F]">
                        {visibleProducts.length}
                      </span>{' '}
                      trên tổng số{' '}
                      <span className="font-mono-tabular font-semibold text-[#1D1D1F]">
                        {filteredProducts.length}
                      </span>{' '}
                      thiết bị trong danh mục
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        if (showAllProducts) {
                          setShowAllProducts(false);
                          document
                            .getElementById('catalog')
                            ?.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          setShowAllProducts(true);
                        }
                      }}
                      className="inline-flex items-center gap-2.5 px-7 py-3.5 text-xs sm:text-sm font-semibold text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED] border border-black/15 rounded-xl transition-colors cursor-pointer"
                    >
                      {showAllProducts ? (
                        <>
                          <span>Thu Gọn Danh Mục Về 6 Sản Phẩm Tiêu Biểu</span>
                          <ChevronUp className="w-4 h-4 text-[#0071E3]" />
                        </>
                      ) : (
                        <>
                          <span>
                            Khám Phá Thêm {hiddenProductsCount} Thiết Bị Chuyên Dụng Khác
                          </span>
                          <ChevronDown className="w-4 h-4 text-[#0071E3]" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* SECTION 3: CORE CAPABILITIES & ASYMMETRIC BENTO SHOWCASE */}
        <section id="architecture" className="py-20 lg:py-28 bg-[#F5F5F7] border-b border-black/[0.06]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#6E6E73] mb-2">
                  <span>Nền tảng kỹ thuật cốt lõi</span>
                  <span aria-hidden="true">·</span>
                  <span>Thiết kế phần cứng tích hợp dọc</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
                  Ba lĩnh vực. Một tiêu chuẩn dung sai micromet.
                </h2>
              </div>

              <div className="flex items-center gap-1 p-1 bg-[#E8E8ED] rounded-lg self-start">
                <button
                  type="button"
                  onClick={() => setActiveArchitectureLayer('silicon')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeArchitectureLayer === 'silicon'
                      ? 'bg-white text-[#1D1D1F] shadow-xs'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Vi Xử Lý & Điện Toán
                </button>
                <button
                  type="button"
                  onClick={() => setActiveArchitectureLayer('acoustic')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeArchitectureLayer === 'acoustic'
                      ? 'bg-white text-[#1D1D1F] shadow-xs'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Khí Động & Siêu Âm
                </button>
                <button
                  type="button"
                  onClick={() => setActiveArchitectureLayer('actuation')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeArchitectureLayer === 'actuation'
                      ? 'bg-white text-[#1D1D1F] shadow-xs'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Cơ Điện Tử & MagLev
                </button>
              </div>
            </div>

            {/* Dynamic Interactive Technical Readout Banner */}
            <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-white border border-black/[0.07] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {activeArchitectureLayer === 'silicon' && (
                <>
                  <div className="max-w-2xl">
                    <div className="text-xs text-[#6E6E73] mb-1">
                      01. Kiến trúc vi mạch hợp nhất Aether X4 Ultra & Máy chủ Blade R2
                    </div>
                    <h3 className="text-xl font-semibold text-[#1D1D1F]">
                      Chia sẻ chung một kiến trúc Neural Engine từ Máy trạm đến Cảm biến nhà máy
                    </h3>
                    <p className="text-sm text-[#515154] mt-2 leading-relaxed">
                      Các mô hình kiểm tra ngoại quan huấn luyện trên máy chủ AetherBlade R2 hoặc AetherStudio Ultra có thể biên dịch và nạp thẳng xuống cảm biến OpticCore M4 và bộ điều khiển NexusEdge TSN mà không cần chuyển đổi tập lệnh.
                    </p>
                  </div>
                  <div className="flex items-center gap-8 border-t lg:border-t-0 lg:border-l border-black/[0.08] pt-4 lg:pt-0 lg:pl-8 shrink-0">
                    <div>
                      <span className="block text-xs text-[#6E6E73]">Tiến trình quang khắc</span>
                      <span className="font-mono-tabular text-2xl font-semibold text-[#1D1D1F]">3 nm</span>
                    </div>
                    <div>
                      <span className="block text-xs text-[#6E6E73]">Băng thông Blade R2</span>
                      <span className="font-mono-tabular text-2xl font-semibold text-[#1D1D1F]">4.36 TB/s</span>
                    </div>
                    <div>
                      <span className="block text-xs text-[#6E6E73]">Độ trễ suy luận biên</span>
                      <span className="font-mono-tabular text-2xl font-semibold text-[#0071E3]">1.8 ms</span>
                    </div>
                  </div>
                </>
              )}

              {activeArchitectureLayer === 'acoustic' && (
                <>
                  <div className="max-w-2xl">
                    <div className="text-xs text-[#6E6E73] mb-1">
                      02. Khí động học Laminar, Sóng siêu âm Cavitation & Từ trường đa điểm
                    </div>
                    <h3 className="text-xl font-semibold text-[#1D1D1F]">
                      Vận hành chuẩn xác ở ngưỡng tĩnh lặng của phòng thu âm
                    </h3>
                    <p className="text-sm text-[#515154] mt-2 leading-relaxed">
                      Từ tháp đối lưu AtmosTower S1, tủ chăm sóc trang phục AeroWardrobe V2 cho tới bếp từ ma trận 48 cuộn cảm ThermoPlate S4, mọi thiết bị gia dụng đều được chế tác từ nhôm, kính Gốm và Titanium nguyên khối.
                    </p>
                  </div>
                  <div className="flex items-center gap-8 border-t lg:border-t-0 lg:border-l border-black/[0.08] pt-4 lg:pt-0 lg:pl-8 shrink-0">
                    <div>
                      <span className="block text-xs text-[#6E6E73]">Độ ồn ban đêm</span>
                      <span className="font-mono-tabular text-2xl font-semibold text-[#1D1D1F]">19.5 dBA</span>
                    </div>
                    <div>
                      <span className="block text-xs text-[#6E6E73]">Sai số nhiệt PID</span>
                      <span className="font-mono-tabular text-2xl font-semibold text-[#1D1D1F]">±0.1 °C</span>
                    </div>
                    <div>
                      <span className="block text-xs text-[#6E6E73]">Chuẩn lọc hạt mịn</span>
                      <span className="font-mono-tabular text-2xl font-semibold text-[#0071E3]">99.997%</span>
                    </div>
                  </div>
                </>
              )}

              {activeArchitectureLayer === 'actuation' && (
                <>
                  <div className="max-w-2xl">
                    <div className="text-xs text-[#6E6E73] mb-1">
                      03. Đệm từ trường MagLev không ma sát & Bán dẫn Gallium Nitride (GaN)
                    </div>
                    <h3 className="text-xl font-semibold text-[#1D1D1F]">
                      Độ lặp lại vị trí ±80 nanomet kết hợp hiệu suất chuyển đổi điện năng 99.1%
                    </h3>
                    <p className="text-sm text-[#515154] mt-2 leading-relaxed">
                      Sự kết hợp giữa bàn trượt đệm từ MagLev M8, hộp số sóng hài HarmonicDrive X-90 và bộ điều khiển PLC thời gian thực NexusEdge TSN giúp dây chuyền nhà máy hoạt động chuẩn phòng sạch ISO Class 2.
                    </p>
                  </div>
                  <div className="flex items-center gap-8 border-t lg:border-t-0 lg:border-l border-black/[0.08] pt-4 lg:pt-0 lg:pl-8 shrink-0">
                    <div>
                      <span className="block text-xs text-[#6E6E73]">Độ lặp lại MagLev</span>
                      <span className="font-mono-tabular text-2xl font-semibold text-[#1D1D1F]">±80 nm</span>
                    </div>
                    <div>
                      <span className="block text-xs text-[#6E6E73]">Hiệu suất biến tần GaN</span>
                      <span className="font-mono-tabular text-2xl font-semibold text-[#1D1D1F]">99.1%</span>
                    </div>
                    <div>
                      <span className="block text-xs text-[#6E6E73]">Chu kỳ quét TSN</span>
                      <span className="font-mono-tabular text-2xl font-semibold text-[#0071E3]">12.5 µs</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Asymmetric Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-black/[0.07] overflow-hidden flex flex-col justify-between">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4 text-xs text-[#6E6E73] mb-2">
                    <span>01. Hạ Tầng Máy Trạm & Máy Chủ AI Nội Bộ</span>
                    <span className="font-mono-tabular">1TB ECC · 6K Retina XDR · Thunderbolt 5</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-[#1D1D1F]">
                    AetherBlade R2 Server & AetherDisplay XDR 32
                  </h3>
                  <p className="text-sm text-[#515154] mt-2 max-w-xl leading-relaxed">
                    Xây dựng đám mây AI riêng tư ngay tại doanh nghiệp với máy chủ Rack 2U nhôm CNC và màn hình tham chiếu chuẩn màu 6K.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-black/[0.06] border-t border-black/[0.06]">
                  <div
                    onClick={() => openProductModal(PRODUCTS[5])}
                    className="bg-white p-5 cursor-pointer group"
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#18181B] mb-3">
                      <ResilientImage
                        src={PRODUCTS[5].imageUrl}
                        alt={PRODUCTS[5].name}
                        category="computing"
                        title={PRODUCTS[5].name}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                        {PRODUCTS[5].name}
                      </span>
                      <span className="font-mono-tabular text-xs text-[#6E6E73]">
                        {formatVND(PRODUCTS[5].basePrice)}
                      </span>
                    </div>
                  </div>
                  <div
                    onClick={() => openProductModal(PRODUCTS[3])}
                    className="bg-white p-5 cursor-pointer group"
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#18181B] mb-3">
                      <ResilientImage
                        src={PRODUCTS[3].imageUrl}
                        alt={PRODUCTS[3].name}
                        category="computing"
                        title={PRODUCTS[3].name}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                        {PRODUCTS[3].name}
                      </span>
                      <span className="font-mono-tabular text-xs text-[#6E6E73]">
                        {formatVND(PRODUCTS[3].basePrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden flex flex-col justify-between">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between text-xs text-[#6E6E73] mb-2">
                    <span>02. Bàn Trượt Đệm Từ MagLev</span>
                    <span className="font-mono-tabular">±80 nm · 4.5G Gia tốc</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#1D1D1F]">
                    MagLev M8 Linear Stage không ma sát cơ học
                  </h3>
                  <p className="text-sm text-[#515154] mt-2 leading-relaxed">
                    Ứng dụng cho dây chuyền quang khắc bán dẫn, kiểm tra quang học AOI và lắp ráp vi cơ điện tử.
                  </p>
                </div>

                <div className="px-6 pb-6">
                  <div
                    onClick={() => openProductModal(PRODUCTS[16])}
                    className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F5F5F7] mb-4 cursor-pointer group"
                  >
                    <ResilientImage
                      src={PRODUCTS[16].imageUrl}
                      alt={PRODUCTS[16].name}
                      category="industrial"
                      title={PRODUCTS[16].name}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-black/[0.06]">
                    <div>
                      <span className="block text-xs font-semibold text-[#1D1D1F]">
                        {PRODUCTS[16].name}
                      </span>
                      <span className="text-xs text-[#6E6E73]">
                        Thước quang 5nm · Sợi Carbon
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openProductModal(PRODUCTS[16])}
                      className="text-xs font-semibold text-[#0071E3] hover:underline whitespace-nowrap cursor-pointer"
                    >
                      Cấu hình
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: PROOF OF IMPACT & QUANTIFIED CASE STUDIES */}
        <section id="proof" className="py-20 lg:py-28 bg-white border-b border-black/[0.06]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-2xl mb-12">
              <div className="flex items-center gap-2 text-xs text-[#6E6E73] mb-2">
                <span>Hiệu quả vận hành thực tế</span>
                <span aria-hidden="true">·</span>
                <span>Dữ liệu đo kiểm độc lập năm 2026</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
                Được kiểm chứng tại các nhà máy bán dẫn, trung tâm R&D và công trình kiến trúc.
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {CASE_STUDIES.map((study) => (
                <div
                  key={study.id}
                  className="bg-[#F9F9FB] rounded-2xl border border-black/[0.07] p-6 sm:p-8 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#6E6E73] mb-4">
                      <span className="font-mono-tabular font-semibold text-[#1D1D1F]">
                        {study.index}.
                      </span>
                      <span>{study.category}</span>
                    </div>

                    <div className="pb-5 mb-5 border-b border-black/[0.06]">
                      <div className="font-mono-tabular text-3xl sm:text-4xl font-semibold text-[#0071E3] tracking-tight">
                        {study.metricValue}
                      </div>
                      <div className="text-sm font-semibold text-[#1D1D1F] mt-1">
                        {study.metricUnit}
                      </div>
                      <div className="text-xs text-[#6E6E73] mt-0.5">
                        {study.timeframe}
                      </div>
                    </div>

                    <h3 className="text-base font-semibold text-[#1D1D1F] mb-3">
                      {study.title}
                    </h3>

                    <blockquote className="text-xs sm:text-sm text-[#515154] leading-relaxed">
                      “{study.quote}”
                    </blockquote>
                  </div>

                  <div className="mt-6 pt-4 border-t border-black/[0.06]">
                    <div className="text-xs font-semibold text-[#1D1D1F]">
                      {study.author}
                    </div>
                    <div className="text-xs text-[#6E6E73]">
                      {study.role} · {study.client}
                    </div>
                    <div className="text-[11px] text-[#6E6E73] mt-2 pt-2 border-t border-black/[0.04]">
                      {study.outcomeSummary}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: INTERACTIVE TECHNICAL CONSULTATION & B2B/B2C QUOTE CAPTURE */}
        <section id="consultation" className="py-20 lg:py-28 bg-[#F5F5F7]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-5">
                <div className="flex items-center gap-2 text-xs text-[#6E6E73] mb-2">
                  <span>Tư vấn giải pháp & Đặt hàng dự án</span>
                  <span aria-hidden="true">·</span>
                  <span>Hỗ trợ kỹ thuật trực tiếp</span>
                </div>
                <h2 className="text-3xl font-semibold text-[#1D1D1F] tracking-tight">
                  Nhận bản vẽ CAD, hồ sơ kỹ thuật hoặc báo giá dự án OEM.
                </h2>
                <p className="text-sm text-[#515154] mt-3 leading-relaxed">
                  Đội ngũ kỹ sư hệ thống của AETHER tại Hà Nội và TP.HCM sẵn sàng hỗ trợ tích hợp giao thức EtherCAT/TSN, cấu hình máy trạm theo lô hoặc thiết kế giải pháp vi khí hậu cho công trình.
                </p>

                <div className="mt-8 space-y-5 border-t border-black/[0.08] pt-6">
                  <div>
                    <h3 className="text-xs font-semibold text-[#1D1D1F]">
                      01. Cung cấp mô hình 3D STEP & SDK thử nghiệm
                    </h3>
                    <p className="text-xs text-[#6E6E73] mt-1">
                      Tải trọn bộ bản vẽ kích thước lắp đặt của cụm Servo HarmonicDrive X-90, bàn từ MagLev M8 và cảm biến OpticCore M4.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[#1D1D1F]">
                      02. Chính sách bảo hành thay thế phần cứng trong 24 giờ
                    </h3>
                    <p className="text-xs text-[#6E6E73] mt-1">
                      Áp dụng cho toàn bộ 18 dòng thiết bị máy trạm, gia dụng kiến trúc và linh kiện công nghiệp trên toàn quốc.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[#1D1D1F]">
                      03. Trung tâm Nghiên cứu & Trải nghiệm Thực tế
                    </h3>
                    <p className="text-xs text-[#6E6E73] mt-1">
                      Khu Công nghệ cao Hòa Lạc (Hà Nội) · Khu Công nghệ cao Quận 9 (TP.HCM)
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-10 border border-black/[0.07]">
                {quoteSubmitted ? (
                  <div className="py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center mx-auto mb-4">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#1D1D1F]">
                      Yêu cầu báo giá & hồ sơ kỹ thuật đã được ghi nhận
                    </h3>
                    <p className="text-sm text-[#515154] mt-2 max-w-md mx-auto">
                      Cảm ơn <span className="font-semibold text-[#1D1D1F]">{customerName}</span>. Kỹ sư phụ trách sẽ gửi bảng báo giá chi tiết và tài liệu kỹ thuật tới{' '}
                      <span className="font-mono-tabular text-[#1D1D1F]">{customerEmail}</span> trong vòng 2 giờ làm việc.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setQuoteSubmitted(false);
                        setCustomerNotes('');
                      }}
                      className="mt-6 px-5 py-2.5 text-xs font-semibold text-white bg-[#1D1D1F] hover:bg-black rounded-lg transition-colors cursor-pointer"
                    >
                      Gửi Yêu Cầu Khác
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-5" noValidate>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-black/[0.08]">
                      <span className="text-sm font-semibold text-[#1D1D1F]">
                        Phiếu Yêu Cầu Báo Giá & Tài Liệu Kỹ Thuật
                      </span>
                      <span className="text-xs text-[#6E6E73]">
                        Phản hồi trong 2 giờ làm việc
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1D1D1F] mb-2">
                        Nhóm thiết bị quan tâm
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setInquiryCategory('computing')}
                          className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors whitespace-nowrap truncate cursor-pointer ${
                            inquiryCategory === 'computing'
                              ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
                              : 'bg-[#F5F5F7] text-[#1D1D1F] border-black/10 hover:border-black/30'
                          }`}
                        >
                          Laptop & Máy Trạm
                        </button>
                        <button
                          type="button"
                          onClick={() => setInquiryCategory('appliances')}
                          className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors whitespace-nowrap truncate cursor-pointer ${
                            inquiryCategory === 'appliances'
                              ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
                              : 'bg-[#F5F5F7] text-[#1D1D1F] border-black/10 hover:border-black/30'
                          }`}
                        >
                          Máy Móc Gia Dụng
                        </button>
                        <button
                          type="button"
                          onClick={() => setInquiryCategory('industrial')}
                          className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors whitespace-nowrap truncate cursor-pointer ${
                            inquiryCategory === 'industrial'
                              ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
                              : 'bg-[#F5F5F7] text-[#1D1D1F] border-black/10 hover:border-black/30'
                          }`}
                        >
                          Linh Kiện Công Nghiệp
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="lead-name"
                          className="block text-xs font-medium text-[#1D1D1F] mb-1.5"
                        >
                          Họ và tên người liên hệ *
                        </label>
                        <input
                          id="lead-name"
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Nguyễn Văn An"
                          className="w-full px-3.5 py-2.5 text-sm bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lead-org"
                          className="block text-xs font-medium text-[#1D1D1F] mb-1.5"
                        >
                          Đơn vị / Doanh nghiệp (Tùy chọn)
                        </label>
                        <input
                          id="lead-org"
                          type="text"
                          value={customerOrg}
                          onChange={(e) => setCustomerOrg(e.target.value)}
                          placeholder="Công ty TNHH Cơ Điện Tử..."
                          className="w-full px-3.5 py-2.5 text-sm bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="lead-email"
                          className="block text-xs font-medium text-[#1D1D1F] mb-1.5"
                        >
                          Email nhận báo giá & bản vẽ CAD *
                        </label>
                        <input
                          id="lead-email"
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="kythuat@doanhnghiep.vn"
                          className="w-full px-3.5 py-2.5 text-sm bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lead-phone"
                          className="block text-xs font-medium text-[#1D1D1F] mb-1.5"
                        >
                          Số điện thoại liên hệ *
                        </label>
                        <input
                          id="lead-phone"
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="0903 123 456"
                          className="w-full px-3.5 py-2.5 text-sm bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3] font-mono-tabular"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="lead-notes"
                        className="block text-xs font-medium text-[#1D1D1F] mb-1.5"
                      >
                        Yêu cầu cấu hình hoặc thông số kỹ thuật cụ thể
                      </label>
                      <textarea
                        id="lead-notes"
                        rows={3}
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        placeholder="Ví dụ: Cần báo giá 10 cụm Servo HarmonicDrive X-90 chuẩn phòng sạch kèm file STEP 3D..."
                        className="w-full px-3.5 py-2.5 text-sm bg-[#F5F5F7] border border-black/15 rounded-lg focus:outline-none focus:border-[#0071E3]"
                      />
                    </div>

                    {formError && (
                      <div className="text-xs font-medium text-[#D70015] bg-[#D70015]/10 px-3.5 py-2.5 rounded-lg">
                        {formError}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 px-5 text-sm font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Nhận Báo Giá & Hồ Sơ Kỹ Thuật
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* QUIET FOOTER */}
      <footer className="bg-white border-t border-black/[0.08] py-12 text-xs text-[#6E6E73]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-black/[0.06]">
            <div>
              <span className="font-brand text-sm font-bold text-[#1D1D1F] tracking-tight">
                AETHER
              </span>
              <p className="mt-2 leading-relaxed">
                Hệ sinh thái phần cứng điện toán hiệu năng cao, thiết bị gia dụng kiến trúc và cơ điện tử công nghiệp chính xác.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#1D1D1F] mb-2.5">Điện Toán & Máy Trạm</h4>
              <ul className="space-y-1.5">
                {PRODUCTS.filter((p) => p.category === 'computing').map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => openProductModal(p)}
                      className="hover:text-[#1D1D1F] transition-colors cursor-pointer text-left"
                    >
                      {p.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#1D1D1F] mb-2.5">Gia Dụng Kiến Trúc</h4>
              <ul className="space-y-1.5">
                {PRODUCTS.filter((p) => p.category === 'appliances').map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => openProductModal(p)}
                      className="hover:text-[#1D1D1F] transition-colors cursor-pointer text-left"
                    >
                      {p.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#1D1D1F] mb-2.5">Linh Kiện Công Nghiệp</h4>
              <ul className="space-y-1.5">
                {PRODUCTS.filter((p) => p.category === 'industrial').map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => openProductModal(p)}
                      className="hover:text-[#1D1D1F] transition-colors cursor-pointer text-left"
                    >
                      {p.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 AETHER Precision Electronics Inc. Bảo lưu mọi quyền.</p>
            <div className="flex items-center gap-4">
              <span>Hotline: 1800 6890</span>
              <span aria-hidden="true">·</span>
              <span>Điều khoản cung ứng B2B</span>
              <span aria-hidden="true">·</span>
              <span>Tiêu chuẩn RoHS & ISO 9001</span>
            </div>
          </div>
        </div>
      </footer>

      {/* MODALS & DRAWERS */}
      <AuthAccountModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        isUserLoggedIn={isUserLoggedIn}
        activeDisplayEmail={activeDisplayEmail}
        authTab={authTab}
        setAuthTab={setAuthTab}
        authError={authError}
        setAuthError={setAuthError}
        authSuccessNotice={authSuccessNotice}
        setAuthSuccessNotice={setAuthSuccessNotice}
        authLoading={authLoading}
        authEmailInput={authEmailInput}
        setAuthEmailInput={setAuthEmailInput}
        authPasswordInput={authPasswordInput}
        setAuthPasswordInput={setAuthPasswordInput}
        authConfirmPasswordInput={authConfirmPasswordInput}
        setAuthConfirmPasswordInput={setAuthConfirmPasswordInput}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        profileNameInput={profileNameInput}
        setProfileNameInput={setProfileNameInput}
        profilePhoneInput={profilePhoneInput}
        setProfilePhoneInput={setProfilePhoneInput}
        profileOrgInput={profileOrgInput}
        setProfileOrgInput={setProfileOrgInput}
        onRegisterWithPassword={handleRegisterWithPassword}
        onLoginWithPassword={handleLoginWithPassword}
        onGoogleSignIn={handleGoogleSignIn}
        onSaveUserProfile={handleSaveUserProfile}
        onLogout={handleLogout}
      />

      <CompareProductsModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        comparedProducts={comparedProducts}
        onToggleCompare={toggleCompareProduct}
        onOpenConfigurator={openProductModal}
        onAddToCart={handleAddToCart}
      />

      <ProductConfiguratorModal
        product={activeProduct}
        selectedOptionId={selectedOptionId}
        setSelectedOptionId={setSelectedOptionId}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartCheckoutDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateCartQuantity}
        onClearCart={() => setCart([])}
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerPhone={customerPhone}
        setCustomerPhone={setCustomerPhone}
        shippingAddress={shippingAddress}
        setShippingAddress={setShippingAddress}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        shippingMethod={shippingMethod}
        setShippingMethod={setShippingMethod}
        voucherInput={voucherInput}
        setVoucherInput={setVoucherInput}
        appliedVoucherCode={appliedVoucherCode}
        onApplyVoucher={handleApplyVoucher}
        needVatInvoice={needVatInvoice}
        setNeedVatInvoice={setNeedVatInvoice}
        vatCompanyInfo={vatCompanyInfo}
        setVatCompanyInfo={setVatCompanyInfo}
        subtotalAmount={subtotalAmount}
        discountAmount={discountAmount}
        shippingFee={shippingFee}
        finalTotalAmount={finalTotalAmount}
        formError={formError}
        onSubmitOrder={handleCheckoutConfirm}
        confirmedOrder={confirmedOrder}
        onResetConfirmedOrder={() => setConfirmedOrder(null)}
        orderHistory={orderHistory}
      />
    </div>
  );
}
