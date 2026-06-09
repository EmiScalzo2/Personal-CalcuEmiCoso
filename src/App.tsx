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

// Module F: Logistics Verifier
const LogisticsVerifier: React.FC = () => {
  const [postalCode, setPostalCode] = useState<string>('');
  const [saleDate, setSaleDate] = useState<string>('');
  const [result, setResult] = useState<{
    estimatedDays: string; zone: string; portabilityWindow: string; comment: string;
  } | null>(null);

  const calculate = () => {
    const cp = postalCode.toString();
    const saleDateVal = saleDate ? new Date(saleDate) : new Date();
    let zone = ''; let estimatedDays = '';
    if (cp.startsWith('1') && cp.length === 4) { zone = 'CABA'; estimatedDays = '48 horas'; }
    else if (cp.startsWith('16') || cp.startsWith('17') || cp.startsWith('18') || cp.startsWith('19') || cp.startsWith('B') || cp.startsWith('b')) { zone = 'GBA'; estimatedDays = '2-3 días'; }
    else { zone = 'Resto del País'; estimatedDays = '4 días'; }
    const minPortDate = new Date(saleDateVal); minPortDate.setDate(minPortDate.getDate() + 7);
    const maxPortDate = new Date(saleDateVal); maxPortDate.setDate(maxPortDate.getDate() + 10);
    const portWindow = `${formatDate(minPortDate)} - ${formatDate(maxPortDate)}`;
    const comment = `Logística CP ${cp}. Zona: ${zone}. Entrega: ${estimatedDays}. Venta: ${formatDate(saleDateVal)}. Ventana Portabilidad: ${portWindow}.`;
    setResult({ estimatedDays, zone, portabilityWindow: portWindow, comment });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Código Postal</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all" placeholder="Ej: 1425" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Fecha de Venta</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all" />
          </div>
        </div>
      </div>
      <button onClick={calculate}
        className="w-full py-3 bg-gradient-to-r from-[#00ADEE] to-[#0095D0] text-white font-semibold rounded-xl hover:from-[#0095D0] hover:to-[#00ADEE] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
        Verificar Logística
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-gray-700/30 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center"><span className="text-gray-400">Zona:</span><span className="text-white font-medium">{result.zone}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">Tiempo de Entrega:</span><span className="text-lg text-[#00ADEE] font-bold">{result.estimatedDays}</span></div>
            <div className="border-t border-gray-600 pt-3">
              <div className="flex items-center space-x-2 mb-2"><Clock className="w-4 h-4 text-[#00C9B7]" /><span className="text-gray-300 font-medium">Ventana de Portabilidad:</span></div>
              <p className="text-center text-xl text-[#00C9B7] font-bold">{result.portabilityWindow}</p>
              <p className="text-center text-sm text-gray-400 mt-1">(7 a 10 días desde la venta)</p>
            </div>
          </div>
          <SpeechTip>
            <p>«Tu pedido llega en {result.estimatedDays}. La portabilidad se concreta entre el {result.portabilityWindow}.»</p>
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
const CycleValidator: React.FC = () => {
  const [gestionDate, setGestionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [cycle, setCycle] = useState<string>('7');
  const [tramite, setTramite] = useState<string>('baja_posdatada');
  const [invoiceStatus, setInvoiceStatus] = useState<string>('no_emitida');
  const [planAmount, setPlanAmount] = useState<string>('');
  const [result, setResult] = useState<{
    cycleCloseDate: Date;
    cycleCloseDateStr: string;
    disconnectionDate: string;
    mustPay: boolean;
    mustPayMsg: string;
    creditAmount: number | null;
    creditMsg: string;
    isPrepago: boolean;
    prepagoAlerts: string[];
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

    // Calculate cycle close date
    const closeDate = new Date(today.getFullYear(), today.getMonth(), closeDay);
    if (currentDay > closeDay) {
      closeDate.setMonth(closeDate.getMonth() + 1);
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

    // Speech
    let speech = '';
    if (tramite === 'baja_inmediata') {
      speech = `«Se procesa la baja inmediata de la línea. La desconexión se realiza en este momento. ${mustPay ? `La factura pendiente de ${formatCurrency(plan)} debe abonarse para evitar mora en el DNI.` : ''}»`;
    } else if (tramite === 'pase_prepago') {
      speech = `«El pase a Prepago se efectiviza el ${formatDate(closeDate)}. ${mustPay ? mustPayMsg : ''} ${creditMsg ? creditMsg : ''} Tenga en cuenta que en Prepago no tiene WhatsApp gratis sin datos, y el costo por GB es más alto. Si lo que le preocupa es la deuda, le recomiendo Abono Control que no genera deuda acumulativa.»`;
    } else if (tramite === 'unificacion') {
      speech = `«La unificación se procesa con cierre de ciclo el ${formatDate(closeDate)}. ${creditMsg ? creditMsg : ''} El ciclo destino se adopta automáticamente si la cuenta ya existe, o se asigna el más próximo si es nueva.»`;
    } else {
      speech = `«La baja posdatada se efectiviza el ${formatDate(closeDate)}. ${mustPay ? mustPayMsg : ''} ${creditMsg ? creditMsg : ''} El cliente deja de tener abono ese día.»`;
    }

    const comment = `Validación Ciclo ${cycleDay}. Trámite: ${tramite}. Cierre: ${formatDate(closeDate)}. Desconexión: ${disconnectionDate}. Factura: ${invoiceStatus}. ${mustPay ? 'DEBE ABONAR.' : ''} ${creditAmount ? `NCL ${formatCurrency(creditAmount)} S/IVA.` : ''} ${isPrepago ? 'ALERTA PREPAGO.' : ''}`;

    setResult({
      cycleCloseDate: closeDate,
      cycleCloseDateStr: formatDate(closeDate),
      disconnectionDate,
      mustPay,
      mustPayMsg,
      creditAmount,
      creditMsg,
      isPrepago,
      prepagoAlerts,
      speech,
      comment,
    });
  };

  return (
    <div className="space-y-4">
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
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Monto del Plan Actual</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="number" value={planAmount} onChange={(e) => setPlanAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00ADEE] focus:border-transparent transition-all" placeholder="0.00" />
          </div>
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
          </div>

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

          <SpeechTip><p>{result.speech}</p></SpeechTip>
          <CrmBlock comment={result.comment} />
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
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, icon, isExpanded, onToggle, children, color }) => (
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

// Main App
function App() {
  const [expandedModule, setExpandedModule] = useState<string | null>('a');
  const toggleModule = (module: string) => setExpandedModule(expandedModule === module ? null : module);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00ADEE]/5 via-transparent to-transparent z-0" />
      <div className="relative z-10">
        <header className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800 z-20">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <Calculator className="w-6 h-6 md:w-8 md:h-8 text-[#00ADEE]" />
              <h1 className="text-base md:text-2xl font-bold text-white">Calculadora de Gestión (Emi Version)</h1>
            </div>
            <span className="font-sans text-xl md:text-2xl font-bold"><span className="text-[#00C9B7]">Personal</span> <span className="text-[#00ADEE]">Flow</span></span>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-4">
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
          <ModuleCard title="F. Verificador de Logística (Por CP)" icon={<Truck className="w-6 h-6" />} isExpanded={expandedModule === 'f'} onToggle={() => toggleModule('f')} color="#00ADEE">
            <LogisticsVerifier />
          </ModuleCard>
          <ModuleCard title="G. Ajuste por Cantidad de Días" icon={<CalendarDays className="w-6 h-6" />} isExpanded={expandedModule === 'g'} onToggle={() => toggleModule('g')} color="#00ADEE">
            <DaysAdjustmentCalculator />
          </ModuleCard>
          <ModuleCard title="H. Validador de Ciclos, Bajas y Movimientos Posdatados" icon={<ShieldCheck className="w-6 h-6" />} isExpanded={expandedModule === 'h'} onToggle={() => toggleModule('h')} color="#00ADEE">
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
        </main>

        <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500 text-sm border-t border-gray-800 mt-8">
          <p>Herramienta de gestión interna - Personal Flow</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
