import { useState } from 'react';
import {
  Calculator,
  RefreshCw,
  FileText,
  ArrowRightLeft,
  Smartphone,
  Truck,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  DollarSign,
  Calendar,
  MapPin,
  CreditCard,
  Percent,
  Clock,
  MessageCircle,
  CalendarDays,
  ShieldCheck,
  Ban,
  ArrowRight,
  Wifi,
  WifiOff,
  Lock,
  Tv,
  Globe,
  Gift,
  Star,
  Zap,
  Home,
  PhoneCall,
  Package,
  Layers,
  BadgeCheck,
  Plus,
  Trash2,
} from 'lucide-react';

// Utility functions
const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Speech tip component
const SpeechTip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-start space-x-3 p-4 bg-[#00C9B7]/10 border border-[#00C9B7]/30 rounded-xl">
    <MessageCircle className="w-5 h-5 text-[#00C9B7] flex-shrink-0 mt-0.5" />
    <div className="text-sm text-gray-300">
      <span className="font-medium text-[#00C9B7]">Como informarle al cliente: </span>
      {children}
    </div>
  </div>
);

// Copy button component
const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center space-x-2 w-full py-2.5 bg-[#00C9B7] text-gray-900 font-semibold rounded-xl hover:bg-[#00B5A5] transition-all"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span>Copiado!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>COPIAR INFO</span>
        </>
      )}
    </button>
  );
};

// CRM comment block component
const CrmBlock: React.FC<{ comment: string }> = ({ comment }) => (
  <div className="bg-gray-700/20 rounded-xl p-4">
    <label className="block text-sm font-medium text-gray-400 mb-2">
      Plantilla para CRM
    </label>
    <p className="text-sm text-gray-300 mb-3 font-mono break-words">{comment}</p>
    <CopyButton text={comment} />
  </div>
);

// Module A: Cycle Change Calculator
const CycleChangeCalculator: React.FC = () => {
  const [currentBill, setCurrentBill] = useState<string>('');
  const [newPrice, setNewPrice] = useState<string>('');
  const [sourceCycle, setSourceCycle] = useState<string>('7');
  const [destCycle, setDestCycle] = useState<string>('14');
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [invoiceIssued, setInvoiceIssued] = useState<boolean>(false);
  const [result, setResult] = useState<{
    transitionBill: number;
    proportionalDays: number;
    previousBillAmount: number;
    showInvoiceWarning: boolean;
    nextBillDate: string;
    daysUntilChange: number;
    dailyPrice: number;
    comment: string;
  } | null>(null);

  const calculate = () => {
    const bill = parseFloat(currentBill) || 0;
    const price = parseFloat(newPrice) || 0;
    const srcCycle = parseInt(sourceCycle);
    const dstCycle = parseInt(destCycle);
    const today = new Date(currentDate);
    const currentDay = today.getDate();

    const daysInCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    let proportionalDays = 0;
    if (dstCycle > srcCycle) {
      proportionalDays = dstCycle - srcCycle;
    } else {
      proportionalDays = (daysInCurrentMonth - srcCycle) + dstCycle;
    }

    const dailyPrice = price / daysInCurrentMonth;
    const transitionBill = (dailyPrice * proportionalDays) + price;

    let daysUntilChange = srcCycle - currentDay;
    if (daysUntilChange < 0) {
      daysUntilChange = (daysInCurrentMonth - currentDay) + srcCycle;
    }

    const nextBillDate = new Date(today);
    if (currentDay <= dstCycle) {
      nextBillDate.setDate(dstCycle);
    } else {
      nextBillDate.setMonth(nextBillDate.getMonth() + 1);
      nextBillDate.setDate(dstCycle);
    }

    const comment = `Cambio de Ciclo: ${srcCycle} → ${dstCycle}. Boleta Transición: ${formatCurrency(transitionBill)}. Días Proporcionales: ${proportionalDays}. Precio Diario: ${formatCurrency(dailyPrice)}. Abono Adelantado: ${formatCurrency(price)}. Próxima Boleta: ${formatDate(nextBillDate)}.`;

    setResult({
      transitionBill,
      proportionalDays,
      previousBillAmount: bill,
      showInvoiceWarning: invoiceIssued,
      nextBillDate: formatDate(nextBillDate),
      daysUntilChange,
      dailyPrice,
      comment,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Monto Boleta Actual</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="number" value={currentBill} onChange={(e) => setCurrentBill(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all" placeholder="0.00" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Precio Lista/Promo Nuevo</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all" placeholder="0.00" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Ciclo Origen</label>
          <select value={sourceCycle} onChange={(e) => setSourceCycle(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all appearance-none cursor-pointer">
            <option value="7">Día 7</option><option value="14">Día 14</option><option value="21">Día 21</option><option value="28">Día 28</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Ciclo Destino</label>
          <select value={destCycle} onChange={(e) => setDestCycle(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all appearance-none cursor-pointer">
            <option value="7">Día 7</option><option value="14">Día 14</option><option value="21">Día 21</option><option value="28">Día 28</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Fecha Actual</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="date" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all" />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3 py-2">
        <input type="checkbox" id="invoiceIssued" checked={invoiceIssued} onChange={(e) => setInvoiceIssued(e.target.checked)}
          className="w-5 h-5 rounded border-gray-600 bg-gray-700/50 text-[#00ADEE] focus:ring-[#00ADEE] cursor-pointer" />
        <label htmlFor="invoiceIssued" className="text-sm text-gray-300 cursor-pointer">La factura del ciclo anterior ya fue emitida</label>
      </div>
      <button onClick={calculate}
        className="w-full py-3 bg-gradient-to-r from-[#00ADEE] to-[#0095D0] text-white font-semibold rounded-xl hover:from-[#0095D0] hover:to-[#00ADEE] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
        Calcular Boleta de Transición
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          {result.showInvoiceWarning && (
            <div className="flex items-start space-x-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-200">La factura de {formatCurrency(result.previousBillAmount)} debe abonarse; el ajuste por los días no utilizados se verá en la cuenta destino.</p>
            </div>
          )}
          <div className="bg-gray-700/30 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center"><span className="text-gray-400">Días hasta el cambio:</span><span className="text-white font-medium">{result.daysUntilChange} días</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">Días Proporcionales:</span><span className="text-white font-medium">{result.proportionalDays} días</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">Precio Diario:</span><span className="text-white font-medium">{formatCurrency(result.dailyPrice)}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">Próxima Boleta:</span><span className="text-[#00C9B7] font-medium">{result.nextBillDate}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">Boleta de Transición:</span><span className="text-2xl text-[#00ADEE] font-bold">{formatCurrency(result.transitionBill)}</span></div>
          </div>
          <SpeechTip>
            <p>«Vamos a realizar un cambio de ciclo del día {sourceCycle} al día {destCycle}. La boleta de transición incluye {result.proportionalDays} días proporcionales más el abono adelantado del mes completo. La próxima factura llega el {result.nextBillDate}.»</p>
          </SpeechTip>
          <CrmBlock comment={result.comment} />
        </div>
      )}
    </div>
  );
};

// Module B: Port Out Retention Calculator
const PortOutCalculator: React.FC = () => {
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<string>('45');
  const [months] = useState<string>('6');
  const [result, setResult] = useState<{
    finalPrice: number;
    discountAmount: number;
    originalPrice: number;
    discountPercent: number;
    comment: string;
  } | null>(null);

  const calculate = () => {
    const price = parseFloat(currentPrice) || 0;
    const discount = parseFloat(discountPercent) || 45;
    const discountAmount = price * (discount / 100);
    const finalPrice = price - discountAmount;
    const comment = `Port Out Retención ${discount}%. Precio Original: ${formatCurrency(price)}. Precio con Descuento: ${formatCurrency(finalPrice)}. Vigencia: 6 meses.`;
    setResult({ finalPrice, discountAmount, originalPrice: price, discountPercent: discount, comment });
  };

  return (
    <div className="space-y-4">
      {/* Policy info boxes */}
      <div className="space-y-3">
        <div className="p-4 bg-[#00ADEE]/10 border border-[#00ADEE]/30 rounded-xl">
          <div className="flex items-start space-x-2">
            <MapPin className="w-5 h-5 text-[#00ADEE] flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-medium text-[#00ADEE] mb-1">Todas las localidades</p>
              <p>Si el cliente tiene un descuento inferior al <strong>45%</strong>, le corresponde el 45% de descuento por 6 meses. Si el cliente ya cuenta con un descuento superior al 45%, se deberá asignar la promoción correspondiente según la política vigente de retención.</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-[#00C9B7]/10 border border-[#00C9B7]/30 rounded-xl">
          <div className="flex items-start space-x-2">
            <MapPin className="w-5 h-5 text-[#00C9B7] flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-medium text-[#00C9B7] mb-1">Zona Rosario</p>
              <p>Si el cliente tiene un descuento inferior al <strong>65%</strong>, le corresponde el 65% de descuento por 6 meses. Si el cliente ya cuenta con un descuento superior al 65%, se deberá asignar la promoción correspondiente según la política vigente de retención.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Precio Actual del Cliente</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="number" value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all" placeholder="0.00" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">% de Retención</label>
          <select value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all appearance-none cursor-pointer">
            <option value="45">45% (Estándar - Todas las localidades)</option>
            <option value="65">65% (Zona Rosario)</option>
            <option value="80">80% (Retención Especial)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-2 p-3 bg-gray-700/30 rounded-xl">
        <Clock className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-400">Vigencia: 6 meses (fijo)</span>
      </div>

      <button onClick={calculate}
        className="w-full py-3 bg-gradient-to-r from-[#00ADEE] to-[#0095D0] text-white font-semibold rounded-xl hover:from-[#0095D0] hover:to-[#00ADEE] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
        Calcular Retención
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-gray-700/30 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center"><span className="text-gray-400">Precio Original:</span><span className="text-white font-medium line-through">{formatCurrency(result.originalPrice)}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">Descuento ({result.discountPercent}%):</span><span className="text-green-400 font-medium">-{formatCurrency(result.discountAmount)}</span></div>
            <div className="border-t border-gray-600 pt-3 flex justify-between items-center"><span className="text-gray-300 font-medium">Precio Final:</span><span className="text-2xl text-[#00ADEE] font-bold">{formatCurrency(result.finalPrice)}</span></div>
            <p className="text-sm text-gray-400 text-center">Vigencia: 6 meses</p>
          </div>
          <SpeechTip>
            <p>«¡Hola! Te habla [Nombre] de Personal. Te contacto porque tu línea tiene un beneficio exclusivo: un descuento por 6 meses para que tu factura quede en {formatCurrency(result.finalPrice)} final. Es un precio preferencial que no es para todo el mundo. ¿Te lo dejo activado ahora mismo así ya empezás a ahorrar?»</p>
          </SpeechTip>
          <CrmBlock comment={result.comment} />
        </div>
      )}
    </div>
  );
};

// Module C: Credit Note Calculator
const CreditNoteCalculator: React.FC = () => {
  const [listPrice, setListPrice] = useState<string>('');
  const [daysInMonth, setDaysInMonth] = useState<string>('30');
  const [correctPercent, setCorrectPercent] = useState<string>('');
  const [chargedPercent, setChargedPercent] = useState<string>('');
  const [result, setResult] = useState<{
    amountWithoutTax: number; amountWithTax: number; finalPriceCorrect: number; finalPriceCharged: number; requiresApproval: boolean; comment: string;
  } | null>(null);

  const calculate = () => {
    const price = parseFloat(listPrice) || 0;
    const days = parseInt(daysInMonth) || 30;
    const correctPct = parseFloat(correctPercent) || 0;
    const chargedPct = parseFloat(chargedPercent) || 0;
    const dailyPrice = price / days;
    const correctAmount = dailyPrice * (correctPct / 100) * days;
    const wrongAmount = dailyPrice * (chargedPct / 100) * days;
    const difference = wrongAmount - correctAmount;
    const withoutTax = Math.abs(difference) / 1.21;
    const withTax = withoutTax * 1.21;
    const requiresApproval = withoutTax > 325640;
    const comment = `NCL Motivo: Descuento mal aplicado. Lista: ${formatCurrency(price)}. % Correcto: ${correctPct}%. % Cobrado: ${chargedPct}%. Importe S/IVA: ${formatCurrency(withoutTax)}. Importe C/IVA: ${formatCurrency(withTax)}.${requiresApproval ? ' REQUIERE APROBACIÓN SUPERVISOR/BO.' : ''}`;
    setResult({ amountWithoutTax: withoutTax, amountWithTax: withTax, finalPriceCorrect: correctAmount, finalPriceCharged: wrongAmount, requiresApproval, comment });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Precio de Lista</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="number" value={listPrice} onChange={(e) => setListPrice(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00C9B7] focus:border-transparent transition-all" placeholder="0.00" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Días del Mes</label>
          <select value={daysInMonth} onChange={(e) => setDaysInMonth(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#00C9B7] focus:border-transparent transition-all appearance-none cursor-pointer">
            <option value="28">28 días</option><option value="29">29 días</option><option value="30">30 días</option><option value="31">31 días</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">% que Debería Tener (Correcto)</label>
          <div className="relative">
            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="number" value={correctPercent} onChange={(e) => setCorrectPercent(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00C9B7] focus:border-transparent transition-all" placeholder="Ej: 60" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">% que se le Cobró (Mal Aplicado)</label>
          <div className="relative">
            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="number" value={chargedPercent} onChange={(e) => setChargedPercent(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00C9B7] focus:border-transparent transition-all" placeholder="Ej: 20" />
          </div>
        </div>
      </div>
      <button onClick={calculate}
        className="w-full py-3 bg-gradient-to-r from-[#00C9B7] to-[#00B5A5] text-gray-900 font-semibold rounded-xl hover:from-[#00B5A5] hover:to-[#00C9B7] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
        Calcular Nota de Crédito
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          {result.requiresApproval && (
            <div className="flex items-start space-x-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-pulse">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200 font-medium">Requiere aprobación de Supervisor/BO - El monto supera los $325.640</p>
            </div>
          )}
          <div className="bg-gray-700/30 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center"><span className="text-gray-400">Monto que le Cobraron:</span><span className="text-red-400 font-medium">{formatCurrency(result.finalPriceCharged)}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">Monto que Debería Pagar:</span><span className="text-green-400 font-medium">{formatCurrency(result.finalPriceCorrect)}</span></div>
            <div className="border-t border-gray-600 pt-3 flex justify-between items-center"><span className="text-gray-400">Importe S/IVA (FAN):</span><span className="text-xl text-[#00C9B7] font-bold">{formatCurrency(result.amountWithoutTax)}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">Importe C/IVA (Cliente):</span><span className="text-xl text-white font-bold">{formatCurrency(result.amountWithTax)}</span></div>
          </div>
          <SpeechTip>
            <p>«Vemos que se te aplicó mal el descuento. Te generamos una nota de crédito de {formatCurrency(result.amountWithTax)} que se verá reflejada en tu próxima factura.»</p>
          </SpeechTip>
          <CrmBlock comment={result.comment} />
        </div>
      )}
    </div>
  );
};

// Module D: Refund Calculator
const RefundCalculator: React.FC = () => {
  const [debitedAmount, setDebitedAmount] = useState<string>('');
  const [correctAmount, setCorrectAmount] = useState<string>('');
  const [result, setResult] = useState<{
    differenceWithTax: number; differenceWithoutTax: number; comment: string;
  } | null>(null);

  const calculate = () => {
    const debited = parseFloat(debitedAmount) || 0;
    const correct = parseFloat(correctAmount) || 0;
    const diffWithTax = debited - correct;
    const diffWithoutTax = diffWithTax / 1.21;
    const comment = `Reintegro por Diferencia. Debitado: ${formatCurrency(debited)}. Correcto: ${formatCurrency(correct)}. Diferencia C/IVA: ${formatCurrency(diffWithTax)}. Diferencia S/IVA: ${formatCurrency(diffWithoutTax)}.`;
    setResult({ differenceWithTax: diffWithTax, differenceWithoutTax: diffWithoutTax, comment });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Valor Debitado</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="number" value={debitedAmount} onChange={(e) => setDebitedAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all" placeholder="0.00" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Valor que Correspondía Debitar</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="number" value={correctAmount} onChange={(e) => setCorrectAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all" placeholder="0.00" />
          </div>
        </div>
      </div>
      <button onClick={calculate}
        className="w-full py-3 bg-gradient-to-r from-[#00ADEE] to-[#0095D0] text-white font-semibold rounded-xl hover:from-[#0095D0] hover:to-[#00ADEE] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
        Calcular Diferencia
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-gray-700/30 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center"><span className="text-gray-400">Diferencia C/IVA:</span><span className="text-xl text-white font-bold">{formatCurrency(result.differenceWithTax)}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">Diferencia S/IVA:</span><span className="text-xl text-[#00ADEE] font-bold">{formatCurrency(result.differenceWithoutTax)}</span></div>
          </div>
          <SpeechTip>
            <p>«Te reintegramos la diferencia de {formatCurrency(result.differenceWithTax)} que se te cobró de más. El ajuste se verá en tu próxima factura.»</p>
          </SpeechTip>
          <CrmBlock comment={result.comment} />
        </div>
      )}
    </div>
  );
};

// Module E: Personal Pay Simulator
const PersonalPaySimulator: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [level, setLevel] = useState<string>('1');
  const [result, setResult] = useState<{
    refundAmount: number; finalPrice: number; originalPrice: number; level: number; refundPercent: number; maxRefund: number; comment: string;
  } | null>(null);

  const getLevelConfig = (lvl: number) => {
    switch (lvl) {
      case 1: return { percent: 10, maxRefund: 750, description: 'Solo por usar la App' };
      case 2: return { percent: 15, maxRefund: 2000, description: 'Consumo desde $75.000' };
      case 3: return { percent: 20, maxRefund: 3500, description: 'Consumo desde $200.000' };
      case 4: return { percent: 25, maxRefund: 7000, description: 'Consumo desde $300.000' };
      default: return { percent: 10, maxRefund: 750, description: 'Solo por usar la App' };
    }
  };

  const calculate = () => {
    const price = parseFloat(amount) || 0;
    const levelNum = parseInt(level) || 1;
    const config = getLevelConfig(levelNum);
    const calculatedRefund = price * (config.percent / 100);
    const refundAmount = Math.min(calculatedRefund, config.maxRefund);
    const finalPrice = price - refundAmount;
    const comment = `Personal Pay Nivel ${levelNum} (${config.description}). Precio Original: ${formatCurrency(price)}. Reintegro ${config.percent}%: ${formatCurrency(refundAmount)}${calculatedRefund > config.maxRefund ? ' (tope aplicado)' : ''}. Precio Final Real: ${formatCurrency(finalPrice)}.`;
    setResult({ refundAmount, finalPrice, originalPrice: price, level: levelNum, refundPercent: config.percent, maxRefund: config.maxRefund, comment });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Monto Final (de otros módulos)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all" placeholder="0.00" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Nivel del Cliente</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all appearance-none cursor-pointer">
            <option value="1">Nivel 1 (10% - tope $750)</option><option value="2">Nivel 2 (15% - tope $2.000)</option><option value="3">Nivel 3 (20% - tope $3.500)</option><option value="4">Nivel 4 (25% - tope $7.000)</option>
          </select>
        </div>
      </div>
      <button onClick={calculate}
        className="w-full py-3 bg-gradient-to-r from-[#00ADEE] to-[#0095D0] text-white font-semibold rounded-xl hover:from-[#0095D0] hover:to-[#00ADEE] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
        Calcular Reintegro Personal Pay
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-gray-700/30 rounded-xl p-5 space-y-3">
            <div className="text-center pb-2 border-b border-gray-600">
              <span className="text-[#00C9B7] font-medium">Nivel {result.level}</span>
              <p className="text-sm text-gray-400">{getLevelConfig(result.level).description}</p>
            </div>
            <div className="flex justify-between items-center"><span className="text-gray-400">Precio Original:</span><span className="text-white font-medium">{formatCurrency(result.originalPrice)}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">Reintegro ({result.refundPercent}%):</span><span className="text-green-400 font-medium">-{formatCurrency(result.refundAmount)}</span></div>
            <p className="text-xs text-gray-500 text-center">Tope máximo: {formatCurrency(result.maxRefund)}</p>
            <div className="border-t border-gray-600 pt-3 flex justify-between items-center"><span className="text-gray-300 font-medium">Precio Final Real:</span><span className="text-2xl text-[#00ADEE] font-bold">{formatCurrency(result.finalPrice)}</span></div>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-[#00ADEE]/10 border border-[#00ADEE]/30 rounded-lg">
            <Smartphone className="w-5 h-5 text-[#00ADEE]" /><span className="text-sm text-[#00ADEE]">Pagando con la App</span>
          </div>
          <SpeechTip>
            <p>«Si pagás con la App Personal Pay, tenés un reintegro del {result.refundPercent}%, por lo que el precio final real es de {formatCurrency(result.finalPrice)}.»</p>
          </SpeechTip>
          <CrmBlock comment={result.comment} />
        </div>
      )}
    </div>
  );
};

// Argentine public holidays 2024-2026 (YYYY-MM-DD)
const AR_HOLIDAYS = new Set([
  '2024-01-01','2024-02-12','2024-02-13','2024-03-24','2024-03-29','2024-04-02',
  '2024-05-01','2024-05-25','2024-06-17','2024-07-09','2024-08-17','2024-10-12',
  '2024-11-18','2024-12-08','2024-12-25',
  '2025-01-01','2025-03-03','2025-03-04','2025-03-24','2025-04-18','2025-04-02',
  '2025-05-01','2025-05-25','2025-06-20','2025-07-09','2025-08-17','2025-10-12',
  '2025-11-17','2025-12-08','2025-12-25',
  '2026-01-01','2026-02-16','2026-02-17','2026-03-24','2026-04-03','2026-04-02',
  '2026-05-01','2026-05-25','2026-06-15','2026-07-09','2026-08-17','2026-10-12',
  '2026-11-23','2026-12-08','2026-12-25',
]);

const isWorkingDay = (date: Date): boolean => {
  const dow = date.getDay();
  if (dow === 0 || dow === 6) return false;
  const key = date.toISOString().split('T')[0];
  return !AR_HOLIDAYS.has(key);
};

const addWorkingDays = (startDate: Date, days: number): Date => {
  const result = new Date(startDate);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    if (isWorkingDay(result)) added++;
  }
  return result;
};

// Module F: Logistics Verifier
const LogisticsVerifier: React.FC = () => {
  const [postalCode, setPostalCode] = useState<string>('');
  const [saleDate, setSaleDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{
    estimatedDays: string;
    zone: string;
    portabilityDate: string;
    chipDate: string;
    workingDaysUsed: number;
    comment: string;
  } | null>(null);

  const calculate = () => {
    const cpNum = parseInt(postalCode) || 0;
    const saleDateVal = saleDate ? new Date(saleDate) : new Date();
    let zone = '';
    let estimatedDays = '';
    let workingDaysUsed = 0;

    if (cpNum < 1900) {
      zone = cpNum >= 1000 && cpNum <= 1499 ? 'CABA' : 'GBA / Zona < 1900';
      estimatedDays = '48 a 72 horas';
      workingDaysUsed = 6;
    } else {
      zone = 'Interior / CP ≥ 1900';
      estimatedDays = '4 a 5 días hábiles';
      workingDaysUsed = 10;
    }

    const portDate = addWorkingDays(saleDateVal, workingDaysUsed);
    // chip arrives before portDate: 5 working days from sale
    const chipDate = addWorkingDays(saleDateVal, 5);

    const comment = `Logística CP ${postalCode}. Zona: ${zone}. Entrega: ${estimatedDays}. Gestión: ${formatDate(saleDateVal)}. Chip llega: ${formatDate(chipDate)} (5 días hábiles). Fecha de Portación: ${formatDate(portDate)} (${workingDaysUsed} días hábiles). Al finalizar el tilde verde: foto DNI frente y dorso al WhatsApp 11 7195-0001 opción PORTABILIDAD.`;

    setResult({ estimatedDays, zone, portabilityDate: formatDate(portDate), chipDate: formatDate(chipDate), workingDaysUsed, comment });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Código Postal</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all" placeholder="Ej: 1425 o 3000" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Fecha del Llamado (Gestión)</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-gray-700/30 rounded-xl">
          <p className="text-gray-400 mb-1">CP menor a 1900</p>
          <p className="text-white font-medium">Portación: 6 días hábiles</p>
          <p className="text-gray-400">Chip: 5 días hábiles</p>
        </div>
        <div className="p-3 bg-gray-700/30 rounded-xl">
          <p className="text-gray-400 mb-1">CP igual o mayor a 1900</p>
          <p className="text-white font-medium">Portación: 10 días hábiles</p>
          <p className="text-gray-400">Chip: 5 días hábiles</p>
        </div>
      </div>

      <button onClick={calculate}
        className="w-full py-3 bg-gradient-to-r from-[#00ADEE] to-[#0095D0] text-white font-semibold rounded-xl hover:from-[#0095D0] hover:to-[#00ADEE] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
        Calcular Fechas
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-gray-700/30 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center"><span className="text-gray-400">Zona:</span><span className="text-white font-medium">{result.zone}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">Entrega del Chip:</span><span className="text-[#00ADEE] font-bold">{result.chipDate}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">Días hábiles portación:</span><span className="text-white font-medium">{result.workingDaysUsed} días</span></div>
            <div className="border-t border-gray-600 pt-3">
              <div className="flex items-center space-x-2 mb-2"><Clock className="w-4 h-4 text-[#00C9B7]" /><span className="text-gray-300 font-medium">Fecha de Portación a Personal:</span></div>
              <p className="text-center text-2xl text-[#00C9B7] font-bold">{result.portabilityDate}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-200">
              <p className="font-medium mb-1">Al finalizar el tramite (tilde verde):</p>
              <p>Indicarle al cliente que envie foto del <strong>FRENTE Y DORSO DE SU DNI</strong> via WhatsApp al <strong>11 7195-0001</strong> — Opcion <strong>PORTABILIDAD</strong> del menu.</p>
            </div>
          </div>

          <SpeechTip>
            <p>«Su chip llega el {result.chipDate} aproximadamente (5 días hábiles). Una vez que tengamos el tilde verde, la línea se activa en Personal el {result.portabilityDate}. Al finalizar el trámite, por favor mándenos una foto del frente y dorso de su DNI al WhatsApp 11 7195-0001, opción Portabilidad del menú.»</p>
          </SpeechTip>
          <CrmBlock comment={result.comment} />
        </div>
      )}
    </div>
  );
};

// Module G: Days Adjustment Calculator
const DaysAdjustmentCalculator: React.FC = () => {
  const [daysInMonth, setDaysInMonth] = useState<string>('30');
  const [daysToAdjust, setDaysToAdjust] = useState<string>('');
  const [totalInvoice, setTotalInvoice] = useState<string>('');
  const [result, setResult] = useState<{
    dailyPrice: number; amountToAdjust: number; amountToAdjustWithoutTax: number; comment: string;
  } | null>(null);

  const calculate = () => {
    const days = parseInt(daysInMonth) || 30;
    const adjustDays = parseInt(daysToAdjust) || 0;
    const invoice = parseFloat(totalInvoice) || 0;
    const dailyPrice = invoice / days;
    const amountToAdjust = dailyPrice * adjustDays;
    const amountToAdjustWithoutTax = amountToAdjust / 1.21;
    const comment = `Ajuste por Días. Días del mes: ${days}. Días a ajustar: ${adjustDays}. Factura: ${formatCurrency(invoice)}. Precio diario: ${formatCurrency(dailyPrice)}. Monto a ajustar C/IVA: ${formatCurrency(amountToAdjust)}. Monto a ajustar S/IVA: ${formatCurrency(amountToAdjustWithoutTax)}.`;
    setResult({ dailyPrice, amountToAdjust, amountToAdjustWithoutTax, comment });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Días del Mes</label>
          <select value={daysInMonth} onChange={(e) => setDaysInMonth(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all appearance-none cursor-pointer">
            <option value="28">28 días</option><option value="29">29 días</option><option value="30">30 días</option><option value="31">31 días</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Cantidad de Días a Ajustar</label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="number" value={daysToAdjust} onChange={(e) => setDaysToAdjust(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all" placeholder="Ej: 5" />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Total de la Factura Actual</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="number" value={totalInvoice} onChange={(e) => setTotalInvoice(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all" placeholder="0.00" />
          </div>
        </div>
      </div>
      <button onClick={calculate}
        className="w-full py-3 bg-gradient-to-r from-[#00ADEE] to-[#0095D0] text-white font-semibold rounded-xl hover:from-[#0095D0] hover:to-[#00ADEE] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
        Calcular Ajuste
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-gray-700/30 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center"><span className="text-gray-400">Precio Diario:</span><span className="text-white font-medium">{formatCurrency(result.dailyPrice)}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">Monto a Ajustar C/IVA:</span><span className="text-xl text-white font-bold">{formatCurrency(result.amountToAdjust)}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">Monto a Ajustar S/IVA:</span><span className="text-xl text-[#00ADEE] font-bold">{formatCurrency(result.amountToAdjustWithoutTax)}</span></div>
          </div>
          <SpeechTip>
            <p>«Por los {daysToAdjust} días, corresponde un ajuste de {formatCurrency(result.amountToAdjust)}. Este monto se verá reflejado en tu cuenta.»</p>
          </SpeechTip>
          <CrmBlock comment={result.comment} />
        </div>
      )}
    </div>
  );
};

// Module H: Cycle/Disconnection/Movement Validator
const CYCLE_EMISSION_WINDOWS: Record<number, { start: number; end: number }> = {
  7: { start: 6, end: 8 },
  14: { start: 13, end: 15 },
  21: { start: 20, end: 22 },
  28: { start: 27, end: 29 },
};

const CycleValidator: React.FC = () => {
  const [gestionDate, setGestionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [cycle, setCycle] = useState<string>('7');
  const [tramite, setTramite] = useState<string>('baja_posdatada');
  const [invoiceStatus, setInvoiceStatus] = useState<string>('no_emitida');
  const [planAmount, setPlanAmount] = useState<string>('');
  const [hasPacks, setHasPacks] = useState<boolean>(false);
  const [result, setResult] = useState<{
    cycleCloseDateStr: string;
    disconnectionDate: string;
    mustPay: boolean;
    mustPayMsg: string;
    creditAmount: number | null;
    creditMsg: string;
    isPrepago: boolean;
    prepagoAlerts: string[];
    emissionScenario: 'A' | 'B' | null;
    emissionMsg: string;
    emissionDateStr: string;
    ncAmountNoTax: number | null;
    packsAlert: string;
    fan21Warning: string;
    speech: string;
    comment: string;
  } | null>(null);

  const getCycleCloseDay = (cycleDay: number) => cycleDay - 1;

  const calculate = () => {
    const today = new Date(gestionDate);
    const currentDay = today.getDate();
    const cycleDay = parseInt(cycle);
    const plan = parseFloat(planAmount) || 0;
    const closeDay = getCycleCloseDay(cycleDay);
    const emissionWindow = CYCLE_EMISSION_WINDOWS[cycleDay];

    // Calculate cycle close date
    const closeDate = new Date(today.getFullYear(), today.getMonth(), closeDay);
    if (currentDay > closeDay) {
      closeDate.setMonth(closeDate.getMonth() + 1);
    }

    // Emission window dates for current month
    const emissionStart = new Date(today.getFullYear(), today.getMonth(), emissionWindow.start);
    const emissionEnd = new Date(today.getFullYear(), today.getMonth(), emissionWindow.end);

    // Determine emission scenario
    let emissionScenario: 'A' | 'B' | null = null;
    let emissionMsg = '';
    let emissionDateStr = '';
    let ncAmountNoTax: number | null = null;

    if (tramite !== 'baja_inmediata') {
      const daysBeforeEmission = Math.ceil((emissionStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      emissionDateStr = `${emissionWindow.start}/${emissionWindow.end}`;

      if (hasPacks) {
        emissionScenario = 'B';
        emissionMsg = `Posee Packs adicionales: siempre se debe verificar la Factura de Cierre. Los cargos de servicios adicionales (Fútbol/HBO/Etc) se cobran a posterior aunque el abono base se frene.`;
      } else if (daysBeforeEmission >= 3) {
        emissionScenario = 'A';
        emissionMsg = `Gestión a término. El sistema NO emitirá la factura del próximo mes. No requiere ajuste manual.`;
      } else {
        emissionScenario = 'B';
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const daysToAdjust = Math.max(0, Math.ceil((closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
        ncAmountNoTax = ((plan / daysInMonth) * daysToAdjust) / 1.21;
        emissionMsg = `Factura ya emitida o en proceso. Se debe abonar el comprobante vigente y cargar una NC por ${formatCurrency(ncAmountNoTax)} S/IVA para compensar el período no utilizado.`;
      }
    }

    // Disconnection date
    let disconnectionDate = '';
    if (tramite === 'baja_inmediata') {
      disconnectionDate = 'Inmediata (5 minutos)';
    } else {
      disconnectionDate = formatDate(closeDate);
    }

    // Invoice logic
    let mustPay = false;
    let mustPayMsg = '';
    let creditAmount: number | null = null;
    let creditMsg = '';

    if (invoiceStatus === 'emitida_pendiente') {
      mustPay = true;
      mustPayMsg = `La factura de ${formatCurrency(plan)} sigue vigente. Si tiene Débito Automático, el cobro se realizará igual y el ajuste impactará en el segundo mes.`;
    } else if (invoiceStatus === 'emitida_abonada' && tramite === 'unificacion') {
      const daysUntilClose = Math.max(0, Math.ceil((closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      creditAmount = (plan / daysInMonth) * daysUntilClose;
      creditMsg = `Saldo a favor: ${formatCurrency(creditAmount)}. Este monto se verá como crédito en la nueva cuenta unificada.`;
    } else if (invoiceStatus === 'emitida_abonada') {
      const daysUntilClose = Math.max(0, Math.ceil((closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      creditAmount = (plan / daysInMonth) * daysUntilClose;
      creditMsg = `Corresponde nota de crédito por ${formatCurrency(creditAmount)} S/IVA en FAN por los días no utilizados.`;
    }

    // Prepago comparison
    const isPrepago = tramite === 'pase_prepago';
    const prepagoAlerts: string[] = [];
    if (isPrepago) {
      prepagoAlerts.push('En Prepago el costo por Giga es superior (compra por "vasito") frente al Abono (compra "mayorista").');
      prepagoAlerts.push('En Abono tiene WhatsApp gratis (texto) incluso sin datos; en Prepago, sin crédito queda incomunicado.');
      prepagoAlerts.push('Alternativa: Abono Control - no genera deuda acumulativa y mantiene los beneficios del abono.');
    }

    // Packs alert
    let packsAlert = '';
    if (hasPacks) {
      packsAlert = 'Posee Packs adicionales. Verificar Factura de Cierre: los cargos de servicios adicionales se cobran a posterior aunque el abono base se frene.';
    }

    // FAN 21-day warning
    let fan21Warning = '';
    const altaDate = new Date(today);
    altaDate.setDate(altaDate.getDate() - 21);
    fan21Warning = 'Recordar: FAN valida que hayan pasado al menos 21 días desde el alta para ciertos movimientos. Verificar fecha de alta del cliente.';

    // Speech
    let speech = '';
    if (tramite === 'baja_inmediata') {
      speech = `«Se procesa la baja inmediata de la línea. La desconexión se realiza en este momento. ${mustPay ? `La factura pendiente de ${formatCurrency(plan)} debe abonarse para evitar mora en el DNI.` : ''}»`;
    } else if (emissionScenario === 'A') {
      speech = `«Quédese tranquilo que, al gestionar la baja hoy ${formatDate(today)}, su ciclo cierra el ${closeDay} y el sistema ya no le enviará la factura del mes que viene.»`;
    } else if (emissionScenario === 'B') {
      const emissionDay = emissionWindow.start;
      speech = `«Como su factura ya se emitió el día ${emissionDay}, usted deberá abonarla y yo le cargaré ahora mismo un ajuste de ${ncAmountNoTax ? formatCurrency(ncAmountNoTax) : formatCurrency(creditAmount || 0)} a su favor.»`;
    } else if (tramite === 'pase_prepago') {
      speech = `«El pase a Prepago se efectiviza el ${formatDate(closeDate)}. ${mustPay ? mustPayMsg : ''} ${creditMsg ? creditMsg : ''} Tenga en cuenta que en Prepago no tiene WhatsApp gratis sin datos, y el costo por GB es más alto. Si lo que le preocupa es la deuda, le recomiendo Abono Control que no genera deuda acumulativa.»`;
    } else if (tramite === 'unificacion') {
      speech = `«La unificación se procesa con cierre de ciclo el ${formatDate(closeDate)}. ${creditMsg ? creditMsg : ''} El ciclo destino se adopta automáticamente si la cuenta ya existe, o se asigna el más próximo si es nueva.»`;
    } else {
      speech = `«La baja posdatada se efectiviza el ${formatDate(closeDate)}. ${mustPay ? mustPayMsg : ''} ${creditMsg ? creditMsg : ''} El cliente deja de tener abono ese día.»`;
    }

    const comment = `Validación Ciclo ${cycleDay}. Trámite: ${tramite}. Cierre: ${formatDate(closeDate)}. Desconexión: ${disconnectionDate}. Factura: ${invoiceStatus}. ${emissionScenario ? `Emisión: Escenario ${emissionScenario} (ventana ${emissionDateStr}).` : ''} ${mustPay ? 'DEBE ABONAR.' : ''} ${ncAmountNoTax ? `NC ${formatCurrency(ncAmountNoTax)} S/IVA.` : ''} ${creditAmount ? `NCL ${formatCurrency(creditAmount)} S/IVA.` : ''} ${hasPacks ? 'PACKS: Verificar Factura Cierre.' : ''} ${isPrepago ? 'ALERTA PREPAGO.' : ''}`;

    setResult({
      cycleCloseDateStr: formatDate(closeDate),
      disconnectionDate,
      mustPay,
      mustPayMsg,
      creditAmount,
      creditMsg,
      isPrepago,
      prepagoAlerts,
      emissionScenario,
      emissionMsg,
      emissionDateStr,
      ncAmountNoTax,
      packsAlert,
      fan21Warning,
      speech,
      comment,
    });
  };

  return (
    <div className="space-y-4">
      {/* Emission windows reference table */}
      <div className="p-4 bg-gray-700/30 rounded-xl">
        <p className="text-sm font-medium text-gray-300 mb-2">Ventanas de Emisión por Ciclo</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="bg-gray-600/30 rounded-lg p-2 text-center"><span className="text-gray-400">Ciclo 7:</span><br /><span className="text-white font-medium">Días 6-8</span></div>
          <div className="bg-gray-600/30 rounded-lg p-2 text-center"><span className="text-gray-400">Ciclo 14:</span><br /><span className="text-white font-medium">Días 13-15</span></div>
          <div className="bg-gray-600/30 rounded-lg p-2 text-center"><span className="text-gray-400">Ciclo 21:</span><br /><span className="text-white font-medium">Días 20-22</span></div>
          <div className="bg-gray-600/30 rounded-lg p-2 text-center"><span className="text-gray-400">Ciclo 28:</span><br /><span className="text-white font-medium">Días 27-29</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Fecha de Gestión</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="date" value={gestionDate} onChange={(e) => setGestionDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Ciclo de Facturación</label>
          <select value={cycle} onChange={(e) => setCycle(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all appearance-none cursor-pointer">
            <option value="7">Ciclo 7 (Cierre día 6)</option><option value="14">Ciclo 14 (Cierre día 13)</option><option value="21">Ciclo 21 (Cierre día 20)</option><option value="28">Ciclo 28 (Cierre día 27)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Trámite</label>
          <select value={tramite} onChange={(e) => setTramite(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all appearance-none cursor-pointer">
            <option value="baja_posdatada">Baja Posdatada</option><option value="pase_prepago">Pase a Prepago</option><option value="unificacion">Movimiento de Producto / Unificación</option><option value="baja_inmediata">Baja Inmediata</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Estado de la Última Factura</label>
          <select value={invoiceStatus} onChange={(e) => setInvoiceStatus(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all appearance-none cursor-pointer">
            <option value="no_emitida">No emitida</option><option value="emitida_pendiente">Emitida y Pendiente</option><option value="emitida_abonada">Emitida y Abonada</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Monto del Plan Actual</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="number" value={planAmount} onChange={(e) => setPlanAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all" placeholder="0.00" />
          </div>
        </div>
        <div className="flex items-center space-x-3 py-7">
          <input type="checkbox" id="hasPacks" checked={hasPacks} onChange={(e) => setHasPacks(e.target.checked)}
            className="w-5 h-5 rounded border-gray-600 bg-gray-700/50 text-[#00ADEE] focus:ring-[#00ADEE] cursor-pointer" />
          <label htmlFor="hasPacks" className="text-sm text-gray-300 cursor-pointer">Posee Packs (Fútbol / HBO / Etc)</label>
        </div>
      </div>

      <button onClick={calculate}
        className="w-full py-3 bg-gradient-to-r from-[#00ADEE] to-[#0095D0] text-white font-semibold rounded-xl hover:from-[#0095D0] hover:to-[#00ADEE] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
        Validar Ciclo y Movimiento
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          {/* Disconnection info */}
          <div className="bg-gray-700/30 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Cierre de Ciclo:</span>
              <span className="text-[#00C9B7] font-bold">{result.cycleCloseDateStr}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Fecha de Desconexión:</span>
              <span className={`text-lg font-bold ${tramite === 'baja_inmediata' ? 'text-red-400' : 'text-white'}`}>{result.disconnectionDate}</span>
            </div>
            {result.emissionScenario && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Ventana de Emisión:</span>
                <span className="text-white font-medium">Días {result.emissionDateStr}</span>
              </div>
            )}
          </div>

          {/* Emission rule result */}
          {result.emissionScenario && (
            <div className={`flex items-start space-x-3 p-4 rounded-xl ${result.emissionScenario === 'A' ? 'bg-green-500/10 border border-green-500/30' : 'bg-amber-500/10 border border-amber-500/30'}`}>
              {result.emissionScenario === 'A'
                ? <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                : <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              }
              <div>
                <p className={`text-sm font-medium mb-1 ${result.emissionScenario === 'A' ? 'text-green-300' : 'text-amber-300'}`}>
                  Escenario {result.emissionScenario}: {result.emissionScenario === 'A' ? 'Prevención' : 'Ajuste Necesario'}
                </p>
                <p className={`text-sm ${result.emissionScenario === 'A' ? 'text-green-200' : 'text-amber-200'}`}>{result.emissionMsg}</p>
              </div>
            </div>
          )}

          {/* NC amount if scenario B */}
          {result.ncAmountNoTax !== null && (
            <div className="bg-gray-700/30 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium text-gray-300">Cálculo de NC (Escenario B)</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Monto NC S/IVA (para FAN):</span>
                <span className="text-xl text-[#00C9B7] font-bold">{formatCurrency(result.ncAmountNoTax)}</span>
              </div>
            </div>
          )}

          {/* Payment obligation */}
          {result.mustPay && (
            <div className="flex items-start space-x-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-200">{result.mustPayMsg}</p>
            </div>
          )}

          {/* Credit info */}
          {result.creditMsg && (
            <div className="flex items-start space-x-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <DollarSign className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-200">{result.creditMsg}</p>
            </div>
          )}

          {/* Packs alert */}
          {result.packsAlert && (
            <div className="flex items-start space-x-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-purple-200">{result.packsAlert}</p>
            </div>
          )}

          {/* Prepago alerts */}
          {result.isPrepago && result.prepagoAlerts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-1">
                <WifiOff className="w-5 h-5 text-red-400" />
                <span className="font-medium text-red-400">Alertas Pase a Prepago</span>
              </div>
              {result.prepagoAlerts.map((alert, i) => (
                <div key={i} className={`flex items-start space-x-3 p-3 rounded-xl ${i === 2 ? 'bg-[#00ADEE]/10 border border-[#00ADEE]/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                  {i === 2 ? <Wifi className="w-5 h-5 text-[#00ADEE] flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />}
                  <p className={`text-sm ${i === 2 ? 'text-[#00ADEE]' : 'text-red-200'}`}>{alert}</p>
                </div>
              ))}
            </div>
          )}

          {/* Unification note */}
          {tramite === 'unificacion' && (
            <div className="flex items-start space-x-3 p-3 bg-[#00ADEE]/10 border border-[#00ADEE]/30 rounded-xl">
              <Info className="w-5 h-5 text-[#00ADEE] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#00ADEE]">En movimientos de unificación, el ciclo destino se adopta automáticamente si la cuenta ya existe, o se asigna el más próximo si es nueva.</p>
            </div>
          )}

          {/* FAN 21-day warning */}
          {tramite !== 'baja_inmediata' && (
            <div className="flex items-start space-x-3 p-3 bg-gray-600/20 border border-gray-600/40 rounded-xl">
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400">{result.fan21Warning}</p>
            </div>
          )}

          <SpeechTip><p>{result.speech}</p></SpeechTip>
          <CrmBlock comment={result.comment} />
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// BENEFICIOS TAB
// ─────────────────────────────────────────────

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  color: string;
  convergent?: boolean;
  children: React.ReactNode;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, color, convergent, children }) => (
  <div className={`rounded-2xl border p-5 space-y-3 ${convergent ? 'border-[#00C9B7]/40 bg-[#00C9B7]/5' : 'border-gray-700/50 bg-gray-800/50'}`}>
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}25` }}>
        <div style={{ color }}>{icon}</div>
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h4 className="font-semibold text-white text-sm">{title}</h4>
          {convergent && <span className="text-xs px-2 py-0.5 bg-[#00C9B7]/20 text-[#00C9B7] rounded-full font-medium">Convergente</span>}
        </div>
      </div>
    </div>
    <div className="text-sm text-gray-300 space-y-1.5">{children}</div>
  </div>
);

const BulletItem: React.FC<{ icon?: React.ReactNode; text: string; warn?: boolean; good?: boolean }> = ({ icon, text, warn, good }) => (
  <div className={`flex items-start space-x-2 ${warn ? 'text-amber-300' : good ? 'text-green-300' : 'text-gray-300'}`}>
    <span className="flex-shrink-0 mt-0.5">{icon || <span className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 ${warn ? 'bg-amber-400' : good ? 'bg-green-400' : 'bg-gray-500'}`} />}</span>
    <span className="text-sm">{text}</span>
  </div>
);

const BeneficiosTab: React.FC = () => {
  const [hogarItems, setHogarItems] = useState<{ id: number; tipo: string }[]>([]);
  const [movilItems, setMovilItems] = useState<{ id: number; lineas: string; plan: string }[]>([]);
  const [unificada, setUnificada] = useState<string>('no');
  const [esVenta, setEsVenta] = useState<string>('no');
  const [debitoAutomatico, setDebitoAutomatico] = useState<string>('no');

  const addHogar = () => setHogarItems([...hogarItems, { id: Date.now(), tipo: 'ninguno' }]);
  const removeHogar = (id: number) => setHogarItems(hogarItems.filter(h => h.id !== id));
  const updateHogar = (id: number, tipo: string) => setHogarItems(hogarItems.map(h => h.id === id ? { ...h, tipo } : h));

  const addMovil = () => setMovilItems([...movilItems, { id: Date.now(), lineas: '1', plan: 'prepago' }]);
  const removeMovil = (id: number) => setMovilItems(movilItems.filter(m => m.id !== id));
  const updateMovil = (id: number, field: 'lineas' | 'plan', value: string) => setMovilItems(movilItems.map(m => m.id === id ? { ...m, [field]: value } : m));

  const hasHogar = hogarItems.some(h => h.tipo !== 'ninguno');
  const hasMovil = movilItems.length > 0;
  const hasInternet = hogarItems.some(h => h.tipo === 'solo_internet' || h.tipo === 'flow_full_deco' || h.tipo === 'flow_full_app');
  const hasTV = hogarItems.some(h => ['flow_basico', 'flow_clasico', 'flow_flex', 'flow_full_deco', 'flow_full_app'].includes(h.tipo));
  const hasDeco = hogarItems.some(h => h.tipo === 'flow_full_deco');

  const getDADescuento = (): number | null => {
    if (debitoAutomatico !== 'si') return null;
    const hasCombo = hasInternet && hasTV;
    const totalLineas = movilItems.reduce((acc, m) => acc + (m.lineas === '4mas' ? 4 : parseInt(m.lineas) || 1), 0);
    let base = 0;
    if (hasCombo && hasMovil) base = 6000;
    else if (hasCombo) base = 4000;
    else if (hasInternet && hasMovil) base = 4000;
    else if (hasTV && hasMovil) base = 4000;
    else if (hasInternet || hasTV) base = 2000;
    else if (hasMovil) base = 2000;
    const extraLines = Math.max(0, totalLineas - 1);
    return Math.min(base + extraLines * 2000, 12000);
  };

  const getCUVInfo = (): { monto: number; descripcion: string } | null => {
    if (esVenta === 'si') {
      const soloHogar = hogarItems.filter(h => h.tipo !== 'ninguno');
      if (hasDeco && soloHogar.length === 1) return { monto: 30000, descripcion: 'Alta nueva con Deco (monoproducto)' };
      return null;
    } else {
      if (hasDeco && hasInternet) return { monto: 30000, descripcion: 'Cliente existente con Internet que suma Flow + Deco' };
      if (hasDeco) return { monto: 15000, descripcion: 'Cliente existente que suma Deco' };
      return null;
    }
  };

  const daDescuento = getDADescuento();
  const cuvInfo = getCUVInfo();

  const HOGAR_OPTIONS = [
    { value: 'ninguno', label: 'Ninguno' },
    { value: 'solo_internet', label: 'Solo Internet' },
    { value: 'flow_basico', label: 'Flow Basico' },
    { value: 'flow_clasico', label: 'Flow Clasico' },
    { value: 'flow_flex', label: 'Flow Flex' },
    { value: 'flow_full_deco', label: 'Flow Full (con Deco)' },
    { value: 'flow_full_app', label: 'Flow Full (App)' },
  ];

  const PLAN_OPTIONS = [
    { value: 'prepago', label: 'Prepago' },
    { value: 'control_3', label: 'Abono Control 3 GB' },
    { value: 'control_5', label: 'Abono Control 5 GB' },
    { value: 'control_10', label: 'Abono Control 10 GB' },
    { value: 'fijo_4', label: 'Abono Fijo 4 GB' },
    { value: 'fijo_8', label: 'Abono Fijo 8 GB' },
    { value: 'fijo_15', label: 'Abono Fijo 15 GB' },
    { value: 'black_30', label: 'Plan Black 30 GB' },
    { value: 'black_50', label: 'Plan Black 50 GB' },
  ];

  const getPlanInfo = (plan: string) => {
    const parts = plan.split('_');
    const tipo = parts[0];
    const gb = parts[1] ? parseInt(parts[1]) : 0;
    return { tipo, gb, isPrepago: tipo === 'prepago', isControl: tipo === 'control', isFijo: tipo === 'fijo', isBlack: tipo === 'black', isFijoOrBlack: tipo === 'fijo' || tipo === 'black' };
  };

  const getRoamingInfo = (plan: string) => {
    const { isFijoOrBlack, gb } = getPlanInfo(plan);
    if (!isFijoOrBlack) return null;
    if (gb === 4) return { gb: 2, region: 'paises limitrofes y EEUU' };
    if (gb === 8) return { gb: 3, region: 'todo el continente americano' };
    if (gb === 15) return { gb: 5, region: 'todo el continente americano' };
    if (gb === 30) return { gb: 8, region: 'America y Europa' };
    if (gb === 50) return { gb: 8, region: 'America, Europa y Resto del Mundo' };
    return null;
  };

  const getControlCredito = (plan: string) => {
    const { gb } = getPlanInfo(plan);
    if (gb === 3) return '$2.000';
    if (gb === 5) return '$3.000';
    if (gb === 10) return '$4.000';
    return null;
  };

  const getTotalDescuento = () => {
    if (unificada !== 'si' || !hasHogar || !hasMovil) return null;
    const totalLineas = movilItems.reduce((acc, m) => acc + (m.lineas === '4mas' ? 4 : parseInt(m.lineas) || 1), 0);
    if (totalLineas === 0) return null;
    return totalLineas === 1 ? 4000 : totalLineas === 2 ? 7000 : totalLineas === 3 ? 10000 : 12000;
  };

  const totalDescuento = getTotalDescuento();

  const renderTVBenefits = (tipo: string) => {
    if (tipo === 'flow_basico') {
      return (
        <BenefitCard icon={<Tv className="w-5 h-5" />} title="Flow Basico" color="#F59E0B">
          <BulletItem text="Canales de aire (aprox. 35): noticias locales e internacionales." />
          <BulletItem warn text="No incluye tantas opciones de deportes o cine." />
          <BulletItem good text="Mas economico, ideal para contenido basico." />
        </BenefitCard>
      );
    }
    if (tipo === 'flow_clasico') {
      return (
        <BenefitCard icon={<Tv className="w-5 h-5" />} title="Flow Clasico" color="#00ADEE">
          <BulletItem good text="Grilla amplia: mas de 80 canales." />
          <BulletItem good text="Deportes (ESPN, TyC Sports) y entretenimiento." />
          <BulletItem good text="Gran cantidad de senales en HD." />
          <BulletItem good text="Acceso gratuito a la app movil Flow." />
        </BenefitCard>
      );
    }
    if (tipo === 'flow_flex') {
      return (
        <BenefitCard icon={<Tv className="w-5 h-5" />} title="Flow Flex" color="#00C9B7">
          <BulletItem good text="100% Digital, sin cables ni decodificadores." />
          <BulletItem good text="Disponible en Smart TV, celular o tablet." />
        </BenefitCard>
      );
    }
    if (tipo === 'flow_full_deco' || tipo === 'flow_full_app') {
      return (
        <BenefitCard icon={<Tv className="w-5 h-5" />} title={tipo === 'flow_full_deco' ? 'Flow Full (con Deco)' : 'Flow Full (App)'} color="#00C9B7">
          <BulletItem good text="Paramount+ incluido de regalo." />
          <BulletItem good text="Pausar, grabar 24hs y retroceder la guia." />
          <BulletItem good text="Hasta 2 pantallas simultaneas y 40 dispositivos." />
        </BenefitCard>
      );
    }
    if (tipo === 'solo_internet') {
      return (
        <BenefitCard icon={<Wifi className="w-5 h-5" />} title="Solo Internet" color="#6B7280">
          <BulletItem text="Servicio de internet residencial sin TV." />
        </BenefitCard>
      );
    }
    return null;
  };

  const renderPrepagoBenefits = () => (
    <BenefitCard icon={<PhoneCall className="w-5 h-5" />} title="Prepago - Ciclo de Vida" color="#F59E0B">
      <div className="space-y-2">
        <div className="flex items-center space-x-3 p-2 bg-green-500/10 rounded-lg">
          <span className="w-20 text-xs font-medium text-green-400 flex-shrink-0">0-180 dias</span>
          <span className="text-xs text-green-300">Activo - navega, llama y recibe.</span>
        </div>
        <div className="flex items-center space-x-3 p-2 bg-amber-500/10 rounded-lg">
          <span className="w-20 text-xs font-medium text-amber-400 flex-shrink-0">180-240 dias</span>
          <span className="text-xs text-amber-300">Restringido - solo recibe llamadas.</span>
        </div>
        <div className="flex items-center space-x-3 p-2 bg-orange-500/10 rounded-lg">
          <span className="w-20 text-xs font-medium text-orange-400 flex-shrink-0">240-365 dias</span>
          <span className="text-xs text-orange-300">Desactivo - solo llamadas gratuitas.</span>
        </div>
        <div className="flex items-center space-x-3 p-2 bg-red-500/10 rounded-lg">
          <span className="w-20 text-xs font-medium text-red-400 flex-shrink-0">+365 dias</span>
          <span className="text-xs text-red-300">Baja - se pierde el numero.</span>
        </div>
      </div>
    </BenefitCard>
  );

  const renderControlBenefits = (plan: string) => {
    const { gb } = getPlanInfo(plan);
    const credito = getControlCredito(plan);
    return (
      <BenefitCard icon={<Zap className="w-5 h-5" />} title={`Abono Control ${gb} GB`} color="#00ADEE">
        <BulletItem good text="WhatsApp gratis y llamadas ilimitadas." />
        <BulletItem good text="Noches Libres: 500 MB extra de 00:00 a 06:00 hs." />
        {credito && <BulletItem good text={`Credito de regalo de ${credito} para comprar packs.`} />}
        <BulletItem good text="Control total del gasto: se corta al consumir los datos." />
        <BulletItem good text="Sin deudas acumulativas si no paga." />
        <BulletItem text="Flexibilidad: cargas virtuales en cualquier momento." />
        <BulletItem warn text="NO accede a Duplicar Gigas (solo Abono Fijo y Black)." />
        {unificada === 'si' && hasHogar && (
          <>
            <BulletItem good text="WiFi Backup: 50 GB por 72hs ante fallas (convergente)." />
            <BulletItem good text="Acceso a red Personal WiFi Zone (convergente)." />
          </>
        )}
      </BenefitCard>
    );
  };

  const renderFijoBenefits = (plan: string) => {
    const { gb, isBlack } = getPlanInfo(plan);
    const roaming = getRoamingInfo(plan);
    return (
      <BenefitCard icon={<Zap className="w-5 h-5" />} title={`${isBlack ? 'Plan Black' : 'Abono Fijo'} ${gb} GB`} color="#00C9B7">
        <BulletItem good text="WhatsApp gratis, llamadas y SMS ilimitados." />
        {!isBlack && <BulletItem good text="Credito de $20 mensual renovable cada ciclo." />}
        {esVenta === 'si' && <BulletItem good text="Gigas de Regalo: 60 GB (10 GB/mes x 6 meses) en alta nueva." />}
        <BulletItem good text="Video Pass: 5 GB exclusivos para Flow y YouTube." />
        {(gb === 30 || gb === 50) && <BulletItem good text="WiFi Pass: 10 GB para usar como modem." />}
        {(gb === 30 || gb === 50) && <BulletItem good text="Guardar Gigas: datos no consumidos se acumulan (60 dias)." />}
        {roaming && <BulletItem good text={`Roaming: ${roaming.gb} GB en ${roaming.region}. WhatsApp gratis en viaje.`} />}
        {unificada === 'si' && hasHogar && (
          <BulletItem good text={`Duplicate: ${gb * 2} GB al precio de ${gb} GB (convergente).`} />
        )}
      </BenefitCard>
    );
  };

  return (
    <div className="space-y-6">
      {/* Hogar Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Home className="w-4 h-4" /><span>Servicios Hogar</span>
          </h3>
          <button onClick={addHogar} className="flex items-center gap-2 px-4 py-2 bg-[#00ADEE]/20 hover:bg-[#00ADEE]/30 text-[#00ADEE] text-sm font-semibold rounded-lg transition-all">
            <Plus className="w-5 h-5" /><span>Agregar</span>
          </button>
        </div>
        {hogarItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-600 rounded-xl">
            Presioná + Agregar para añadir un servicio hogar
          </div>
        ) : (
          hogarItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <select value={item.tipo} onChange={(e) => updateHogar(item.id, e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#00ADEE]">
                {HOGAR_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <button onClick={() => removeHogar(item.id)} className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Móvil Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Smartphone className="w-4 h-4" /><span>Lineas Moviles</span>
          </h3>
          <button onClick={addMovil} className="flex items-center gap-2 px-4 py-2 bg-[#00C9B7]/20 hover:bg-[#00C9B7]/30 text-[#00C9B7] text-sm font-semibold rounded-lg transition-all">
            <Plus className="w-5 h-5" /><span>Agregar</span>
          </button>
        </div>
        {movilItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-600 rounded-xl">
            Presioná + Agregar para añadir una línea móvil
          </div>
        ) : (
          movilItems.map((item, idx) => (
            <div key={item.id} className="p-5 bg-gray-800/50 rounded-xl border border-gray-700 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Package className="w-4 h-4" />
                  <span className="font-medium">Movil #{idx + 1}</span>
                </div>
                <button onClick={() => removeMovil(item.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Cantidad de lineas</label>
                  <select value={item.lineas} onChange={(e) => updateMovil(item.id, 'lineas', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm">
                    <option value="1">1 linea</option>
                    <option value="2">2 lineas</option>
                    <option value="3">3 lineas</option>
                    <option value="4mas">4 o mas</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1.5">Tipo de Plan</label>
                  <select value={item.plan} onChange={(e) => updateMovil(item.id, 'plan', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm">
                    {PLAN_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Opciones de contexto */}
      {(hasHogar || hasMovil) && (
        <div className="space-y-2">
          {[
            { label: '¿Es venta nueva?', value: esVenta, set: setEsVenta, icon: <Gift className="w-5 h-5 text-[#00ADEE]" /> },
            { label: '¿Factura Unificada?', value: unificada, set: setUnificada, icon: <Layers className="w-5 h-5 text-[#00C9B7]" /> },
            { label: '¿Acepta Debito Automatico?', value: debitoAutomatico, set: setDebitoAutomatico, icon: <CreditCard className="w-5 h-5 text-[#00ADEE]" /> },
          ].map(({ label, value, set, icon }) => (
            <div key={label} className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {icon}
                  <span className="text-sm text-gray-300 font-medium">{label}</span>
                </div>
                <div className="flex gap-2">
                  {['si', 'no'].map((v) => (
                    <button key={v} onClick={() => set(v)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${value === v ? (v === 'si' ? 'bg-[#00C9B7] text-white' : 'bg-gray-600 text-gray-300') : 'bg-gray-700/50 border border-gray-600 text-gray-400 hover:border-gray-500'}`}>
                      {v === 'si' ? 'Si' : 'No'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Benefits Section */}
      {(hasHogar || hasMovil) && (
        <div className="space-y-4 pt-4 border-t border-gray-700">
          {/* CUV */}
          {cuvInfo && (
            <BenefitCard icon={<DollarSign className="w-5 h-5" />} title="CUV - Costo de Instalacion" color="#F59E0B">
              <BulletItem warn text="Se cobra en la primera factura, no al vendedor/tecnico." />
              <BulletItem text={cuvInfo.descripcion} />
              <div className="flex justify-between items-center p-3 bg-amber-500/10 rounded-xl mt-2">
                <span className="text-gray-300">Monto CUV:</span>
                <span className="text-xl font-bold text-amber-400">{formatCurrency(cuvInfo.monto)}</span>
              </div>
            </BenefitCard>
          )}

          {/* DA Discount */}
          {daDescuento !== null && daDescuento > 0 && (
            <BenefitCard icon={<CreditCard className="w-5 h-5" />} title="Descuento Debito Automatico" color="#00ADEE">
              <BulletItem good text="Descuento mensual por adhesion a debito automatico (6 meses)." />
              <BulletItem text="Movil $2k | Internet $2k | Combo $4k | Internet+Movil $4k | Combo+Movil $6k." />
              <div className="flex justify-between items-center p-3 bg-[#00ADEE]/10 rounded-xl mt-2">
                <span className="text-gray-300">Descuento DA:</span>
                <span className="text-xl font-bold text-[#00ADEE]">{formatCurrency(daDescuento)}</span>
              </div>
            </BenefitCard>
          )}

          {/* TV Individual Benefits */}
          {hogarItems.filter(h => h.tipo !== 'ninguno').map(item => (
            <div key={`tv-${item.id}`}>{renderTVBenefits(item.tipo)}</div>
          ))}

          {/* Mobile Individual Benefits */}
          {movilItems.map(item => {
            const planInfo = getPlanInfo(item.plan);
            if (planInfo.isPrepago) return <div key={`mob-${item.id}`}>{renderPrepagoBenefits()}</div>;
            if (planInfo.isControl) return <div key={`mob-${item.id}`}>{renderControlBenefits(item.plan)}</div>;
            if (planInfo.isFijoOrBlack) return <div key={`mob-${item.id}`}>{renderFijoBenefits(item.plan)}</div>;
            return null;
          })}

          {/* Convergent Benefits */}
          {unificada === 'si' && hasHogar && hasMovil && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#00C9B7] uppercase tracking-wider flex items-center gap-2">
                <BadgeCheck className="w-4 h-4" /><span>Beneficios de Convergencia</span>
              </h3>

              {totalDescuento && (
                <BenefitCard icon={<DollarSign className="w-5 h-5" />} title="Descuento Conexion Total" color="#00C9B7" convergent>
                  <BulletItem text="Base $4k + $2k por cada linea adicional. Tope $12k." />
                  <div className="flex justify-between items-center p-4 bg-[#00C9B7]/10 rounded-xl">
                    <span className="text-gray-300 font-medium">Descuento mensual:</span>
                    <span className="text-2xl font-bold text-[#00C9B7]">{formatCurrency(totalDescuento)}</span>
                  </div>
                </BenefitCard>
              )}

              <BenefitCard icon={<ShieldCheck className="w-5 h-5" />} title="WiFi Backup - 50 GB por 72hs" color="#00ADEE" convergent>
                <BulletItem good text="50 GB gratis por 72 horas ante fallas tecnicas del hogar." />
                <BulletItem text="Aplica a TODOS los planes (incluso Prepago y Control)." />
              </BenefitCard>

              <BenefitCard icon={<CreditCard className="w-5 h-5" />} title="Personal Pay - Nivel 4" color="#00C9B7" convergent>
                <BulletItem good text="Acceso al Nivel 4 de Personal Pay." />
                <BulletItem good text="Hasta 25% de reintegro en factura + 15% extra sin tope." />
              </BenefitCard>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!hasHogar && !hasMovil && (
        <div className="text-center text-gray-500 py-16">
          <Star className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Agrega servicios hogar o moviles para ver los beneficios</p>
        </div>
      )}
    </div>
  );
};

// ─── ID Data & Parse ────────────────────────────────────────────────────────

const HOGAR_IDS: string[] = [
  'BUNDLE_INT100_FLOWFLEX','BUNDLE_INT100_FLOWFLEX_ABONO','BUNDLE_INT100_TV_CLASIC','BUNDLE_INT100_TV_CLASIC_2','BUNDLE_INT100_TV_DIGHD','BUNDLE_INT100_TV_DIGHD_2','BUNDLE_INT100_TV_FLOW_BOX','BUNDLE_INT100_TV_FLOW_BOX_2',
  'BUNDLE_INT1000_FLOWFLEX','BUNDLE_INT1000_FLOWFLEX_ABONO','BUNDLE_INT1000_TV_CLASIC','BUNDLE_INT1000_TV_DIGHD','BUNDLE_INT1000_TV_FLOW_BOX',
  'BUNDLE_INT25_FLOWFLEX','BUNDLE_INT25_FLOWFLEX_ABONO','BUNDLE_INT25_TV_CLASIC','BUNDLE_INT25_TV_CLASIC_2','BUNDLE_INT25_TV_DIGHD','BUNDLE_INT25_TV_DIGHD_2','BUNDLE_INT25_TV_FLOW_BOX','BUNDLE_INT25_TV_FLOW_BOX_2',
  'BUNDLE_INT300_FLOWFLEX','BUNDLE_INT300_FLOWFLEX_ABONO','BUNDLE_INT300_TV_CLASIC','BUNDLE_INT300_TV_CLASIC_2','BUNDLE_INT300_TV_DIGHD','BUNDLE_INT300_TV_DIGHD_2','BUNDLE_INT300_TV_FLOW_BOX','BUNDLE_INT300_TV_FLOW_BOX_2',
  'BUNDLE_INT50_FLOWFLEX','BUNDLE_INT50_FLOWFLEX_ABONO','BUNDLE_INT50_TV_CLASIC','BUNDLE_INT50_TV_DIGHD','BUNDLE_INT50_TV_FLOW_BOX',
  'BUNDLE_TOIP_INT100','BUNDLE_TOIP_INT100_FLOWFLEX','BUNDLE_TOIP_INT100_FLOWFLEX_ABONO','BUNDLE_TOIP_INT100_TV_CLASIC','BUNDLE_TOIP_INT100_TV_CLASIC_2','BUNDLE_TOIP_INT100_TV_DIGHD','BUNDLE_TOIP_INT100_TV_DIGHD_2','BUNDLE_TOIP_INT100_TV_FLOW_BOX','BUNDLE_TOIP_INT100_TV_FLOW_BOX_2',
  'BUNDLE_TOIP_INT1000','BUNDLE_TOIP_INT1000_FLOWFLEX','BUNDLE_TOIP_INT1000_FLOWFLEX_ABONO','BUNDLE_TOIP_INT1000_TV_CLASIC','BUNDLE_TOIP_INT1000_TV_DIGHD','BUNDLE_TOIP_INT1000_TV_FLOW_BOX',
  'BUNDLE_TOIP_INT25','BUNDLE_TOIP_INT25_FLOWFLEX','BUNDLE_TOIP_INT25_FLOWFLEX_ABONO','BUNDLE_TOIP_INT25_TV_CLASIC','BUNDLE_TOIP_INT25_TV_CLASIC_2','BUNDLE_TOIP_INT25_TV_DIGHD','BUNDLE_TOIP_INT25_TV_DIGHD_2','BUNDLE_TOIP_INT25_TV_FLOW_BOX','BUNDLE_TOIP_INT25_TV_FLOW_BOX_2',
  'BUNDLE_TOIP_INT300','BUNDLE_TOIP_INT300_FLOWFLEX','BUNDLE_TOIP_INT300_FLOWFLEX_ABONO','BUNDLE_TOIP_INT300_TV_CLASIC','BUNDLE_TOIP_INT300_TV_CLASIC_2','BUNDLE_TOIP_INT300_TV_DIGHD','BUNDLE_TOIP_INT300_TV_DIGHD_2','BUNDLE_TOIP_INT300_TV_FLOW_BOX','BUNDLE_TOIP_INT300_TV_FLOW_BOX_2',
  'BUNDLE_TOIP_INT50','BUNDLE_TOIP_INT50_FLOWFLEX','BUNDLE_TOIP_INT50_FLOWFLEX_ABONO','BUNDLE_TOIP_INT50_TV_CLASIC','BUNDLE_TOIP_INT50_TV_DIGHD','BUNDLE_TOIP_INT50_TV_FLOW_BOX',
  'BUNDLE_TOIP_INT50_FLOWSKINNY','BUNDLE_TOIP_INT50_FLOWSKINNY_DECO','BUNDLE_TOIP_INT100_FLOWSKINNY','BUNDLE_TOIP_INT100_FLOWSKINNY_DECO','BUNDLE_TOIP_INT300_FLOWSKINNY','BUNDLE_TOIP_INT300_FLOWSKINNY_DECO','BUNDLE_TOIP_INT600_FLOWSKINNY','BUNDLE_TOIP_INT600_FLOWSKINNY_DECO','BUNDLE_TOIP_INT1000_FLOWSKINNY','BUNDLE_TOIP_INT1000_FLOWSKINNY_DECO',
  'BUNDLE_TOIP_INT50_FLOWPLUS','BUNDLE_TOIP_INT50_FLOWPLUS_DECO','BUNDLE_TOIP_INT100_FLOWPLUS','BUNDLE_TOIP_INT100_FLOWPLUS_DECO','BUNDLE_TOIP_INT300_FLOWPLUS','BUNDLE_TOIP_INT300_FLOWPLUS_DECO','BUNDLE_TOIP_INT600_FLOWPLUS','BUNDLE_TOIP_INT600_FLOWPLUS_DECO','BUNDLE_TOIP_INT1000_FLOWPLUS','BUNDLE_TOIP_INT1000_FLOWPLUS_DECO',
  'FAN_INT_25MB','FAN_INT_50MB','FAN_INT_100MB','FAN_INT_300MB','FAN_INT_1000MB','FAN_INT_100MB_VOZ_FWA',
  'FAN_TV_CLASICO','FAN_TV_CLASICO_MIG01','FAN_TV_CLASICO_MIG02','FAN_TV_CLASICO_MIG03','FAN_TV_CLASICO_MIG04','FAN_TV_CLASICO_MIG05','FAN_TV_CLASICO_MIG06','FAN_TV_CLASICO_TNB','FAN_TV_CLASICO_TNB_2',
  'FAN_TV_DIGHD','FAN_TV_DIGHD_2','FAN_TV_FLOWBOX','FAN_TV_FLOWBOX_2','FAN_TV_BOCADIGHD','FAN_TV_BOCAFLOW','FAN_TV_QP_0004',
  'FAN_TV_FLOWSKINNY','FAN_TV_FLOWSKINNY_DECO','FAN_TV_FLOWPLUS','FAN_TV_FLOWPLUS_DECO',
  'FAN_VOLTE_TOTAL_PAIS_FULL',
];

const MOVIL_IDS: string[] = [
  'FAN_APRO0','FAN_AFMT0','FAN_APRO2','FAN_AFON1','FAN_AFMA2','FAN_AFLIX','FAN_AFLI3','FAN_AFON4','FAN_APRO3','FAN_AFCA4',
  'FAN_AFDT3','FAN_APRO4','FAN_AFNAC','FAN_APROC','FAN_APROT','FAN_APROQ',
  'FAN_ADNU1','FAN_ADNU3','FAN_ADNU5','FAN_ADNU8','FAN_APRO5','FAN_ADN03','FAN_ADN05',
  'FAN_PMAS1','FAN_PMAS2','FAN_PMAS3','FAN_PMAS4','FAN_PBAV3','FAN_PTIB5','FAN_PDNU1','FAN_PDNU2',
  'FAN_AFRSS','FAN_AFRS3','FAN_AFRS4','FAN_AFRS5','FAN_AFRS8','FAN_APRO8',
  'FAN_ABC01','FAN_ABC02','FAN_ABC03','FAN_ABC05','FAN_ABC10',
  'FAN_PMON3','FAN_PMON5','FAN_PMO10','FAN_PMO30','FAN_PMO50',
];

const parseHogarID = (id: string): string => {
  if (!id) return '';
  const p = id.split('_');
  if (p[0] === 'FAN') {
    if (p[1] === 'INT') return `Solo Internet ${p[2].replace('MB', ' Mb')}${p[3] === 'VOZ' ? ' + Voz FWA' : ''}`;
    if (p[1] === 'TV') {
      const tvMap: Record<string, string> = { CLASICO: 'TV Clasico', DIGHD: 'TV Digital HD', FLOWBOX: 'Flow Box', BOCADIGHD: 'Boca TV DigHD', BOCAFLOW: 'Boca Flow', FLOWSKINNY: 'Flow Skinny', FLOWPLUS: 'Flow Plus' };
      const rest = p.slice(2).join('_');
      const isMig = rest.includes('MIG');
      const isTNB = rest.includes('TNB');
      const baseParts = p[2] === 'BOCADIGHD' || p[2] === 'BOCAFLOW' ? p[2] : p[2];
      const tvLabel = tvMap[baseParts] || rest;
      const deco = rest.endsWith('DECO') ? ' (con Deco)' : '';
      return `Solo TV: ${tvLabel}${deco}${isMig ? ' [Migracion]' : ''}${isTNB ? ' [TNB]' : ''}`;
    }
    if (p[1] === 'VOLTE') return 'VoLTE Total País Full';
    return id;
  }
  if (p[0] !== 'BUNDLE') return id;
  let i = 1;
  const parts: string[] = [];
  if (p[i] === 'TOIP') { parts.push('Telefonia Fija'); i++; }
  if (p[i]?.startsWith('INT')) { parts.unshift(`Internet ${p[i].replace('INT', '')} Mb`); i++; }
  const tvMap2: Record<string, string> = { FLOWFLEX: 'Flow Flex', FLOWSKINNY: 'Flow Skinny', FLOWPLUS: 'Flow Plus' };
  if (p[i] && tvMap2[p[i]]) { const lbl = tvMap2[p[i]]; i++; const deco = p[p.length-1]==='DECO' ? ' (con Deco)' : ''; const ab = p[p.length-1]==='ABONO' ? ' [Abono]' : ''; parts.push(lbl+deco+ab); }
  else if (p[i] === 'TV') { i++; const tv2: Record<string, string> = { CLASIC: 'TV Clasica', DIGHD: 'TV Digital HD' }; const box = p[i]==='FLOW' && p[i+1]==='BOX'; const tLabel = box ? 'Flow Box' : (tv2[p[i]] || p[i]); const v2 = p[p.length-1]==='2' ? ' (v2)' : ''; parts.push(tLabel+v2); }
  return parts.join(' + ') || id;
};

const parseMovilID = (id: string): string => {
  const moMap: Record<string, string> = {
    'FAN_PMON3':'Plan Movil 3 GB','FAN_PMON5':'Plan Movil 5 GB','FAN_PMO10':'Plan Movil 10 GB','FAN_PMO30':'Plan Movil 30 GB','FAN_PMO50':'Plan Movil 50 GB',
    'FAN_ABC01':'ABC Movil 1 GB','FAN_ABC02':'ABC Movil 2 GB','FAN_ABC03':'ABC Movil 3 GB','FAN_ABC05':'ABC Movil 5 GB','FAN_ABC10':'ABC Movil 10 GB',
    'FAN_PMAS1':'Plan Mas 1','FAN_PMAS2':'Plan Mas 2','FAN_PMAS3':'Plan Mas 3','FAN_PMAS4':'Plan Mas 4',
    'FAN_ADNU1':'Plan Nuevo 1 GB','FAN_ADNU3':'Plan Nuevo 3 GB','FAN_ADNU5':'Plan Nuevo 5 GB','FAN_ADNU8':'Plan Nuevo 8 GB',
    'FAN_ADN03':'Plan Nuevo v2 3 GB','FAN_ADN05':'Plan Nuevo v2 5 GB',
    'FAN_PDNU1':'Plan Digital Nuevo 1','FAN_PDNU2':'Plan Digital Nuevo 2',
    'FAN_AFRSS':'Plan Retencion S','FAN_AFRS3':'Plan Retencion 3','FAN_AFRS4':'Plan Retencion 4','FAN_AFRS5':'Plan Retencion 5','FAN_AFRS8':'Plan Retencion 8',
    'FAN_APRO8':'Promo Abono 8','FAN_APRO5':'Promo Abono 5','FAN_APRO4':'Promo Abono 4','FAN_APRO3':'Promo Abono 3','FAN_APRO2':'Promo Abono 2','FAN_APRO0':'Promo Abono 0','FAN_APROC':'Promo Abono Control','FAN_APROT':'Promo Abono Total','FAN_APROQ':'Promo Abono Q',
    'FAN_AFMT0':'Abono Fijo MT 0','FAN_AFON1':'Abono Fijo ON 1','FAN_AFMA2':'Abono Fijo MA 2','FAN_AFLIX':'Abono Fijo LIX','FAN_AFLI3':'Abono Fijo LI 3','FAN_AFON4':'Abono Fijo ON 4','FAN_AFCA4':'Abono Fijo CA 4','FAN_AFDT3':'Abono Fijo DT 3','FAN_AFNAC':'Abono Fijo NAC',
    'FAN_PBAV3':'Plan Bav 3','FAN_PTIB5':'Plan TIB 5',
  };
  return moMap[id] || id;
};

// ─── Autocomplete Component ───────────────────────────────────────────────────

interface IDAutocompleteProps {
  ids: string[];
  parseID: (id: string) => string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  accentColor?: string;
  label?: string;
}

const IDAutocomplete: React.FC<IDAutocompleteProps> = ({ ids, parseID, value, onChange, placeholder = 'Escribi el ID...', accentColor = '#00ADEE', label }) => {
  const [query, setQuery] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const displayText = value ? `${value}` : '';

  const suggestions = React.useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return ids.slice(0, 12);
    return ids.filter(id =>
      id.toLowerCase().includes(q) || parseID(id).toLowerCase().includes(q)
    ).slice(0, 12);
  }, [query, ids, parseID]);

  const select = (id: string) => {
    onChange(id);
    setQuery('');
    setOpen(false);
    setHighlighted(-1);
  };

  const clear = () => { onChange(''); setQuery(''); setOpen(false); };

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { setHighlighted(h => Math.min(h + 1, suggestions.length - 1)); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { setHighlighted(h => Math.max(h - 1, 0)); e.preventDefault(); }
    else if (e.key === 'Enter' && highlighted >= 0) { select(suggestions[highlighted]); e.preventDefault(); }
    else if (e.key === 'Escape') { setOpen(false); setQuery(''); }
  };

  return (
    <div ref={containerRef} className="relative">
      {label && <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>}
      <div className="relative flex items-center">
        {value && !open ? (
          <div className="w-full flex items-center gap-2 px-4 py-3 bg-gray-800/60 border rounded-xl cursor-pointer transition-all hover:border-gray-500"
            style={{ borderColor: `${accentColor}60` }}
            onClick={() => { setOpen(true); setQuery(''); setTimeout(() => inputRef.current?.focus(), 0); }}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-mono text-white truncate">{value}</p>
              <p className="text-xs truncate mt-0.5" style={{ color: accentColor }}>{parseID(value)}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); clear(); }}
              className="text-gray-500 hover:text-red-400 flex-shrink-0 transition-colors">
              <span className="text-lg leading-none">&times;</span>
            </button>
          </div>
        ) : (
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); setHighlighted(-1); }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600 rounded-xl text-white text-sm outline-none transition-all focus:border-opacity-100"
            style={{ ['--tw-ring-color' as string]: accentColor }}
          />
        )}
      </div>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          {suggestions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">Sin resultados</div>
          ) : (
            <ul className="max-h-64 overflow-y-auto">
              {suggestions.map((id, i) => (
                <li key={id}
                  onMouseDown={() => select(id)}
                  onMouseEnter={() => setHighlighted(i)}
                  className={`px-4 py-2.5 cursor-pointer transition-colors border-b border-gray-800/50 last:border-0 ${highlighted === i ? 'bg-gray-700/70' : 'hover:bg-gray-800/70'}`}>
                  <p className="text-xs font-mono text-gray-200">{id}</p>
                  <p className="text-xs mt-0.5" style={{ color: accentColor }}>{parseID(id)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

// ─── IDs Tab ─────────────────────────────────────────────────────────────────

const IDsTab: React.FC = () => {
  const [modo, setModo] = useState<'hogar' | 'movil'>('hogar');
  const [selectedID, setSelectedID] = useState<string>('');
  const [precioLista, setPrecioLista] = useState<string>('');
  const [dtoPct, setDtoPct] = useState<string>('');

  const ids = modo === 'hogar' ? HOGAR_IDS : MOVIL_IDS;
  const parseID = modo === 'hogar' ? parseHogarID : parseMovilID;
  const accentColor = modo === 'hogar' ? '#00ADEE' : '#00C9B7';

  const precio = parseFloat(precioLista) || 0;
  const dto = parseFloat(dtoPct) || 0;
  const precioFinal = precio * (1 - dto / 100);
  const ahorro = precio - precioFinal;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(['hogar', 'movil'] as const).map(m => (
          <button key={m} onClick={() => { setModo(m); setSelectedID(''); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${modo === m ? 'bg-[#00ADEE] text-white' : 'bg-gray-700/50 text-gray-400 hover:text-white border border-gray-600'}`}>
            {m === 'hogar' ? 'Hogar' : 'Movil'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <IDAutocomplete
          ids={ids}
          parseID={parseID}
          value={selectedID}
          onChange={setSelectedID}
          placeholder="Escribi el ID o parte del nombre..."
          accentColor={accentColor}
          label="Buscar y seleccionar ID"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Precio de Lista ($)</label>
            <input type="number" value={precioLista} onChange={e => setPrecioLista(e.target.value)} placeholder="0"
              className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#00ADEE] outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Descuento (%)</label>
            <input type="number" value={dtoPct} onChange={e => setDtoPct(e.target.value)} placeholder="0"
              className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#00ADEE] outline-none" />
          </div>
        </div>

        {precio > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-gray-800/50 rounded-xl text-center border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Precio Lista</p>
              <p className="text-lg font-bold text-white">{formatCurrency(precio)}</p>
            </div>
            <div className="p-4 bg-red-500/10 rounded-xl text-center border border-red-500/30">
              <p className="text-xs text-gray-400 mb-1">Descuento</p>
              <p className="text-lg font-bold text-red-400">- {formatCurrency(ahorro)}</p>
            </div>
            <div className="p-4 rounded-xl text-center border" style={{ backgroundColor: `${accentColor}15`, borderColor: `${accentColor}40` }}>
              <p className="text-xs text-gray-400 mb-1">Precio Final</p>
              <p className="text-lg font-bold" style={{ color: accentColor }}>{formatCurrency(precioFinal)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Contingencia Tab ─────────────────────────────────────────────────────────

interface ContHogar {
  idProducto: string;
  ciclo: string;
  dtoActual: string;
  dtoFan: string;
  precioBase: string;
}

interface ContLinea {
  id: number;
  idProducto: string;
  ciclo: string;
  dtoActual: string;
  dtoFan: string;
  precioBase: string;
}

interface Adicional {
  activo: boolean;
  precio: number;
  dto: string;
}

const ADICIONALES_DEF = [
  { key: 'disney_premium', label: 'Disney+ Premium', precio: 23999, notaNuevo: '' },
  { key: 'disney_std', label: 'Disney+ Estandar', precio: 15599, notaNuevo: '' },
  { key: 'futbol', label: 'Pack Futbol', precio: 26340, notaNuevo: '' },
  { key: 'hbo', label: 'Pack HBO', precio: 24840, notaNuevo: '4 meses al 50% en usuarios nuevos' },
  { key: 'universal', label: 'Pack Universal+', precio: 11499, notaNuevo: '3 meses sin cargo en usuarios nuevos' },
  { key: 'atrevido', label: 'Pack Atrevido (Adultos)', precio: 27160, notaNuevo: '4 meses al 50% en usuarios nuevos' },
];

const ContingenciaTab: React.FC = () => {
  const [hogar, setHogar] = useState<ContHogar>({ idProducto: '', ciclo: '7', dtoActual: '0', dtoFan: '0', precioBase: '' });
  const [lineas, setLineas] = useState<ContLinea[]>([]);
  const [adicionales, setAdicionales] = useState<Record<string, Adicional>>(() => {
    const init: Record<string, Adicional> = {};
    ADICIONALES_DEF.forEach(a => { init[a.key] = { activo: false, precio: a.precio, dto: '0' }; });
    return init;
  });
  const [bocas, setBocas] = useState<string>('0');
  const [decos, setDecos] = useState<string>('0');
  const [decoIsNew, setDecoIsNew] = useState<boolean>(false);
  const [extensores, setExtensores] = useState<string>('0');
  const [extDto, setExtDto] = useState<string>('0');
  const [decoDto, setDecoDto] = useState<string>('0');
  const [daOption, setDaOption] = useState<'si' | 'no' | 'ya_tiene'>('no');
  const [unificada, setUnificada] = useState<'si' | 'no' | 'ya'>('no');
  const [ppay, setPpay] = useState<'si' | 'no'>('no');
  const [ppayNivel, setPpayNivel] = useState<string>('1');
  const [resultado, setResultado] = useState<{ totalMensual: number; speech: string } | null>(null);

  const addLinea = () => setLineas([...lineas, { id: Date.now(), idProducto: '', ciclo: '7', dtoActual: '0', dtoFan: '0', precioBase: '' }]);
  const removeLinea = (id: number) => setLineas(lineas.filter(l => l.id !== id));
  const updateLinea = (id: number, field: keyof ContLinea, val: string) => setLineas(lineas.map(l => l.id === id ? { ...l, [field]: val } : l));

  const calcPrecio = (base: string, dtoActual: string, dtoFan: string) => {
    const b = parseFloat(base) || 0;
    const da = parseFloat(dtoActual) || 0;
    const df = parseFloat(dtoFan) || 0;
    return Math.max(0, b - da - (b * df / 100));
  };

  const calcular = () => {
    const decoUnitario = decoIsNew ? 7310 : 4100;
    const decoCount = parseInt(decos) || 0;
    const extCount = parseInt(extensores) || 0;

    const precioHogar = calcPrecio(hogar.precioBase, hogar.dtoActual, hogar.dtoFan);
    const precioLineas = lineas.reduce((acc, l) => acc + calcPrecio(l.precioBase, l.dtoActual, l.dtoFan), 0);
    const precioDecos = decoCount * decoUnitario * (1 - (parseFloat(decoDto) || 0) / 100);
    const precioExt = extCount * 3150 * (1 - (parseFloat(extDto) || 0) / 100);
    const precioAdd = ADICIONALES_DEF.reduce((acc, a) => {
      const st = adicionales[a.key];
      return st?.activo ? acc + st.precio * (1 - (parseFloat(st.dto) || 0) / 100) : acc;
    }, 0);

    let totalMensual = precioHogar + precioLineas + precioDecos + precioExt + precioAdd;

    const hasHogarActive = !!hogar.idProducto;
    const hasMovilActive = lineas.length > 0;
    const totalLineas = lineas.length;

    let daDesc = 0;
    const hasCombo = hasHogarActive; // simplification: all hogar treated as combo
    if (daOption === 'si') {
      if (hasCombo && hasMovilActive) daDesc = 6000;
      else if (hasCombo) daDesc = 4000;
      else if (hasMovilActive) daDesc = 2000;
      daDesc += Math.max(0, totalLineas - 1) * 2000;
      daDesc = Math.min(daDesc, 12000);
    }

    let convDesc = 0;
    if ((unificada === 'si' || unificada === 'ya') && hasHogarActive && hasMovilActive) {
      convDesc = 4000 + Math.max(0, totalLineas - 1) * 2000;
      convDesc = Math.min(convDesc, 12000);
    }

    totalMensual = Math.max(0, totalMensual - daDesc - convDesc);

    const hogarDesc = hogar.idProducto ? parseHogarID(hogar.idProducto) : 'No seleccionado';
    const lineasDesc = lineas.map((l, i) => `Linea ${i + 1}: ${l.idProducto ? parseMovilID(l.idProducto) : 'Sin ID'} (Ciclo ${l.ciclo})`).join(', ');
    const addDesc = ADICIONALES_DEF.filter(a => adicionales[a.key]?.activo).map(a => a.label).join(', ');

    const speech = [
      `Buenos días/tardes! Le comento el detalle de su servicio:`,
      hogar.idProducto ? `• Servicio Hogar: ${hogarDesc} — Ciclo de facturación: ${hogar.ciclo}.` : '',
      lineasDesc ? `• Movil: ${lineasDesc}.` : '',
      addDesc ? `• Adicionales: ${addDesc}.` : '',
      decoCount > 0 ? `• ${decoCount} Deco(s) adicional(es) incluidos.` : '',
      daDesc > 0 ? `• Descuento por Debito Automatico: ${formatCurrency(daDesc)}/mes.` : '',
      convDesc > 0 ? `• Descuento por Convergencia (Factura Unificada): ${formatCurrency(convDesc)}/mes.` : '',
      `• Total mensual estimado: ${formatCurrency(totalMensual)}.`,
      ppay === 'si' ? `• Con Personal Pay Nivel ${ppayNivel} accede a reintegros adicionales en su factura.` : '',
      `Cualquier consulta estoy a disposicion.`,
    ].filter(Boolean).join('\n');

    setResultado({ totalMensual, speech });
  };

  const inputClass = 'w-full px-3 py-2.5 bg-gray-800/60 border border-gray-600 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#00ADEE] outline-none';
  const labelClass = 'block text-xs text-gray-400 mb-1.5 uppercase tracking-wider';

  return (
    <div className="space-y-6">
      {/* HOGAR */}
      <div className="p-5 bg-gray-800/30 rounded-2xl border border-gray-700/50 space-y-4">
        <h3 className="text-sm font-semibold text-[#00ADEE] uppercase tracking-wider flex items-center gap-2">
          <Home className="w-4 h-4" /> Hogar
        </h3>
        <IDAutocomplete
          ids={HOGAR_IDS}
          parseID={parseHogarID}
          value={hogar.idProducto}
          onChange={val => setHogar({ ...hogar, idProducto: val })}
          placeholder="Escribi el ID Hogar..."
          accentColor="#00ADEE"
          label="ID de Producto Hogar"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className={labelClass}>Precio Base ($)</label>
            <input type="number" value={hogar.precioBase} onChange={e => setHogar({ ...hogar, precioBase: e.target.value })} placeholder="0" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Ciclo</label>
            <select value={hogar.ciclo} onChange={e => setHogar({ ...hogar, ciclo: e.target.value })} className={inputClass}>
              {['7','14','21','28'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Dto Actual ($)</label>
            <input type="number" value={hogar.dtoActual} onChange={e => setHogar({ ...hogar, dtoActual: e.target.value })} placeholder="0" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Dto FAN (%)</label>
            <input type="number" value={hogar.dtoFan} onChange={e => setHogar({ ...hogar, dtoFan: e.target.value })} placeholder="0" className={inputClass} />
          </div>
        </div>

        {/* Adicionales */}
        <div className="space-y-3 pt-3 border-t border-gray-700/50">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Adicionales</p>
          {ADICIONALES_DEF.map(a => {
            const st = adicionales[a.key];
            return (
              <div key={a.key} className={`p-3 rounded-xl border transition-all ${st.activo ? 'border-[#00ADEE]/40 bg-[#00ADEE]/5' : 'border-gray-700/50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="text-sm text-gray-300 font-medium cursor-pointer" onClick={() => setAdicionales({ ...adicionales, [a.key]: { ...st, activo: !st.activo } })}>
                      {a.label}
                    </label>
                    {a.notaNuevo && <p className="text-xs text-amber-400 mt-0.5">{a.notaNuevo}</p>}
                  </div>
                  <button onClick={() => setAdicionales({ ...adicionales, [a.key]: { ...st, activo: !st.activo } })}
                    className={`w-12 h-6 rounded-full transition-all relative ${st.activo ? 'bg-[#00ADEE]' : 'bg-gray-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${st.activo ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
                {st.activo && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">Precio ($)</label>
                      <input type="number" value={st.precio} onChange={e => setAdicionales({ ...adicionales, [a.key]: { ...st, precio: parseFloat(e.target.value) || 0 } })}
                        className="w-full px-3 py-1.5 bg-gray-800/60 border border-gray-600 rounded-lg text-white text-xs outline-none focus:ring-1 focus:ring-[#00ADEE] mt-1" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Descuento (%)</label>
                      <input type="number" value={st.dto} onChange={e => setAdicionales({ ...adicionales, [a.key]: { ...st, dto: e.target.value } })}
                        className="w-full px-3 py-1.5 bg-gray-800/60 border border-gray-600 rounded-lg text-white text-xs outline-none focus:ring-1 focus:ring-[#00ADEE] mt-1" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Bocas, Decos, Extensores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Bocas Adicionales</label>
              <select value={bocas} onChange={e => setBocas(e.target.value)} className={inputClass}>
                {['0','1','2'].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Decos (0-4)</label>
              <div className="flex gap-2">
                <select value={decos} onChange={e => setDecos(e.target.value)} className={inputClass}>
                  {['0','1','2','3','4'].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              {parseInt(decos) > 0 && (
                <div className="mt-2 space-y-1.5">
                  <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={decoIsNew} onChange={e => setDecoIsNew(e.target.checked)} className="accent-[#00ADEE]" />
                    Usuario nuevo ($7.310 c/u)
                  </label>
                  <input type="number" value={decoDto} onChange={e => setDecoDto(e.target.value)} placeholder="Dto Deco %" className="w-full px-3 py-1.5 bg-gray-800/60 border border-gray-600 rounded-lg text-white text-xs outline-none focus:ring-1 focus:ring-[#00ADEE]" />
                </div>
              )}
            </div>
            <div>
              <label className={labelClass}>Extensores (0-5)</label>
              <select value={extensores} onChange={e => setExtensores(e.target.value)} className={inputClass}>
                {['0','1','2','3','4','5'].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              {parseInt(extensores) > 0 && (
                <input type="number" value={extDto} onChange={e => setExtDto(e.target.value)} placeholder="Dto Ext %" className="w-full px-3 py-1.5 bg-gray-800/60 border border-gray-600 rounded-lg text-white text-xs outline-none focus:ring-1 focus:ring-[#00ADEE] mt-2" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOVIL */}
      <div className="p-5 bg-gray-800/30 rounded-2xl border border-gray-700/50 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#00C9B7] uppercase tracking-wider flex items-center gap-2">
            <Smartphone className="w-4 h-4" /> Movil
          </h3>
          <button onClick={addLinea} className="flex items-center gap-2 px-4 py-2 bg-[#00C9B7]/20 hover:bg-[#00C9B7]/30 text-[#00C9B7] text-sm font-semibold rounded-lg transition-all">
            <Plus className="w-4 h-4" /> Agregar Linea
          </button>
        </div>
        {lineas.length === 0 && (
          <div className="text-center py-6 text-gray-500 text-sm border-2 border-dashed border-gray-700 rounded-xl">
            Presioná + Agregar Linea para añadir
          </div>
        )}
        {lineas.map((linea, idx) => (
          <div key={linea.id} className="p-4 bg-gray-900/50 rounded-xl border border-gray-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Linea {idx + 1}</span>
              <button onClick={() => removeLinea(linea.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
            </div>
            <IDAutocomplete
              ids={MOVIL_IDS}
              parseID={parseMovilID}
              value={linea.idProducto}
              onChange={val => updateLinea(linea.id, 'idProducto', val)}
              placeholder="Escribi el ID Movil..."
              accentColor="#00C9B7"
              label="ID Producto"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className={labelClass}>Precio Base ($)</label>
                <input type="number" value={linea.precioBase} onChange={e => updateLinea(linea.id, 'precioBase', e.target.value)} placeholder="0" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Ciclo</label>
                <select value={linea.ciclo} onChange={e => updateLinea(linea.id, 'ciclo', e.target.value)} className={inputClass}>
                  {['7','14','21','28'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Dto Actual ($)</label>
                <input type="number" value={linea.dtoActual} onChange={e => updateLinea(linea.id, 'dtoActual', e.target.value)} placeholder="0" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Dto FAN (%)</label>
                <input type="number" value={linea.dtoFan} onChange={e => updateLinea(linea.id, 'dtoFan', e.target.value)} placeholder="0" className={inputClass} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Opciones */}
      <div className="p-5 bg-gray-800/30 rounded-2xl border border-gray-700/50 space-y-4">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Opciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Debito Automatico</label>
            <select value={daOption} onChange={e => setDaOption(e.target.value as 'si' | 'no' | 'ya_tiene')} className={inputClass}>
              <option value="no">No acepta</option>
              <option value="si">Si acepta (nuevo)</option>
              <option value="ya_tiene">Ya tiene (mas de 6 meses)</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Factura Unificada</label>
            <select value={unificada} onChange={e => setUnificada(e.target.value as 'si' | 'no' | 'ya')} className={inputClass}>
              <option value="no">No acepta</option>
              <option value="si">Si acepta (nueva)</option>
              <option value="ya">Ya esta unificado</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Personal Pay</label>
            <select value={ppay} onChange={e => setPpay(e.target.value as 'si' | 'no')} className={inputClass}>
              <option value="no">No</option>
              <option value="si">Si</option>
            </select>
            {ppay === 'si' && (
              <select value={ppayNivel} onChange={e => setPpayNivel(e.target.value)} className={`${inputClass} mt-2`}>
                {['1','2','3','4'].map(n => <option key={n} value={n}>Nivel {n}</option>)}
              </select>
            )}
          </div>
        </div>
      </div>

      <button onClick={calcular}
        className="w-full py-4 bg-[#00C9B7] hover:bg-[#00B5A5] text-gray-900 font-bold text-base rounded-2xl transition-all shadow-lg shadow-[#00C9B7]/20">
        Ver Total a Pagar
      </button>

      {resultado && (
        <div className="space-y-4">
          <div className="p-6 bg-[#00C9B7]/10 border border-[#00C9B7]/30 rounded-2xl text-center">
            <p className="text-sm text-gray-400 mb-2">Total Mensual Estimado</p>
            <p className="text-4xl font-bold text-[#00C9B7]">{formatCurrency(resultado.totalMensual)}</p>
          </div>
          <div className="p-5 bg-gray-800/50 rounded-2xl border border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#00ADEE]" /> Speech sugerido para el cliente
              </p>
              <CopyButton text={resultado.speech} />
            </div>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">{resultado.speech}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

// Module Card Component
interface ModuleCardProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  color: string;
  disabled?: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, icon, isExpanded, onToggle, children, color, disabled }) => {
  if (disabled) {
    return (
      <div className="bg-gray-800/20 rounded-2xl border border-gray-700/20 overflow-hidden opacity-50 pointer-events-none select-none">
        <div className="w-full px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-600/30">
              <div className="text-gray-500">{icon}</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-500">{title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Ban className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Modulo desactivado - En mantenimiento</span>
              </div>
            </div>
          </div>
          <Lock className="w-5 h-5 text-gray-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden transition-all duration-300 hover:border-gray-600/50">
      <button onClick={onToggle} className="w-full px-6 py-5 flex items-center justify-between text-left group">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
            <div style={{ color }}>{icon}</div>
          </div>
          <h3 className="text-lg font-semibold text-white group-hover:text-[#00ADEE] transition-colors">{title}</h3>
        </div>
        <div className="text-gray-400">{isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}</div>
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6 pt-2 border-t border-gray-700/50">{children}</div>
      </div>
    </div>
  );
};

// Main App
type TabId = 'calculadoras' | 'beneficios' | 'ids' | 'contingencia';
function App() {
  const [activeTab, setActiveTab] = useState<TabId>('calculadoras');
  const [expandedModule, setExpandedModule] = useState<string | null>('a');
  const toggleModule = (module: string) => setExpandedModule(expandedModule === module ? null : module);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00ADEE]/5 via-transparent to-transparent z-0" />
      <div className="relative z-10">
        <header className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800 z-20">
          <div className="max-w-4xl mx-auto px-4 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 md:space-x-3">
                <Calculator className="w-6 h-6 md:w-8 md:h-8 text-[#00ADEE]" />
                <h1 className="text-base md:text-2xl font-bold text-white">Calculadora de Gestión (Emi Version)</h1>
              </div>
              <span className="font-sans text-xl md:text-2xl font-bold"><span className="text-[#00C9B7]">Personal</span> <span className="text-[#00ADEE]">Flow</span></span>
            </div>
            {/* Tabs */}
            <div className="flex space-x-1 flex-wrap gap-y-1">
              {([
                { id: 'calculadoras', label: 'Calculadoras', icon: <Calculator className="w-4 h-4" /> },
                { id: 'beneficios', label: 'Beneficios', icon: <Star className="w-4 h-4" /> },
                { id: 'ids', label: 'IDs', icon: <FileText className="w-4 h-4" /> },
                { id: 'contingencia', label: 'Contingencia', icon: <AlertTriangle className="w-4 h-4" /> },
              ] as { id: TabId; label: string; icon: React.ReactNode }[]).map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all ${activeTab === tab.id ? 'bg-gray-800 text-white border-t border-l border-r border-gray-700' : 'text-gray-500 hover:text-gray-300'}`}>
                  {tab.icon}<span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-4">
          {activeTab === 'calculadoras' && (
            <>
              <ModuleCard title="A. Calculadora de Cambio de Ciclo y Proporcionales" icon={<RefreshCw className="w-6 h-6" />} isExpanded={expandedModule === 'a'} onToggle={() => toggleModule('a')} color="#00ADEE">
                <CycleChangeCalculator />
              </ModuleCard>
              <ModuleCard title="B. Port Out (Retención 45/65/80%)" icon={<ArrowRightLeft className="w-6 h-6" />} isExpanded={expandedModule === 'b'} onToggle={() => toggleModule('b')} color="#00ADEE">
                <PortOutCalculator />
              </ModuleCard>
              <ModuleCard title="C. Nota de Crédito por Descuento Mal Aplicado" icon={<FileText className="w-6 h-6" />} isExpanded={expandedModule === 'c'} onToggle={() => toggleModule('c')} color="#00C9B7">
                <CreditNoteCalculator />
              </ModuleCard>
              <ModuleCard title="D. Reintegro de un Monto a Otro" icon={<CreditCard className="w-6 h-6" />} isExpanded={expandedModule === 'd'} onToggle={() => toggleModule('d')} color="#00ADEE">
                <RefundCalculator />
              </ModuleCard>
              <ModuleCard title="E. Simulador Personal Pay (Integrado)" icon={<Smartphone className="w-6 h-6" />} isExpanded={expandedModule === 'e'} onToggle={() => toggleModule('e')} color="#00ADEE">
                <PersonalPaySimulator />
              </ModuleCard>
              <ModuleCard title="F. Verificador de Logística y Portabilidad (Por CP)" icon={<Truck className="w-6 h-6" />} isExpanded={expandedModule === 'f'} onToggle={() => toggleModule('f')} color="#00ADEE">
                <LogisticsVerifier />
              </ModuleCard>
              <ModuleCard title="G. Ajuste por Cantidad de Días" icon={<CalendarDays className="w-6 h-6" />} isExpanded={expandedModule === 'g'} onToggle={() => toggleModule('g')} color="#00ADEE">
                <DaysAdjustmentCalculator />
              </ModuleCard>
              <ModuleCard title="H. Validador de Ciclos, Bajas y Movimientos Posdatados" icon={<ShieldCheck className="w-6 h-6" />} isExpanded={false} onToggle={() => {}} color="#00ADEE" disabled={true}>
                <CycleValidator />
              </ModuleCard>

              <div className="mt-8 p-4 bg-gray-800/30 rounded-xl border border-[#00C9B7]/30">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-[#00C9B7] flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-400">
                    <p className="font-medium text-[#00C9B7] mb-1">Info para Vos</p>
                    <p>Esta herramienta permite calcular rápidamente los valores necesarios para la gestión de clientes. Todos los cálculos incluyen plantillas listas para copiar al CRM.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'beneficios' && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#00ADEE]/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-[#00ADEE]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Consultor de Beneficios</h2>
                  <p className="text-sm text-gray-400">Seleccioná los productos del cliente para ver sus beneficios</p>
                </div>
              </div>
              <BeneficiosTab />
            </div>
          )}

          {activeTab === 'ids' && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#00ADEE]/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#00ADEE]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Consultor de IDs</h2>
                  <p className="text-sm text-gray-400">Buscá, decodificá y calculá precios por ID de producto</p>
                </div>
              </div>
              <IDsTab />
            </div>
          )}

          {activeTab === 'contingencia' && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Calculadora de Contingencia</h2>
                  <p className="text-sm text-gray-400">Para usar cuando se caiga la app de ventas/retencion</p>
                </div>
              </div>
              <ContingenciaTab />
            </div>
          )}
        </main>

        <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500 text-sm border-t border-gray-800 mt-8">
          <p>Herramienta de gestión interna - Personal Flow</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
