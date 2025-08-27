import { useState, useEffect } from "react";

const OtpModal = ({ isOpen, onClose, otp, setOtp, onVerify, onResend,otpError }) => {
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    let timer;
    if (isOpen) {
      startTimer();
      // Autofocus input when modal opens
      setTimeout(() => {
        document.getElementById("otp-input")?.focus();
      }, 100);
    }
    return () => clearInterval(timer);

    function startTimer() {
      setCanResend(false);
      setCountdown(30);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify();
    
  };

  const handleResend = async () => {
    const success = await onResend();
    if (success) {
      setCanResend(false);
      setCountdown(30);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-xl border border-gray-800">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          Enter OTP
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            id="otp-input"
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-center tracking-widest text-lg"
            placeholder="______"
          />
          {otpError && (
            <p className="text-red-500 text-sm text-center">{otpError}</p>
          )}
          <button
            type="submit"
            className="w-full cursor-pointer bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Verify OTP
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            className={`${
              canResend
                ? "text-green-400 cursor-pointer hover:underline"
                : "text-gray-500 cursor-not-allowed"
            }`}
          >
            {canResend ? "Resend OTP" : `Resend OTP in ${countdown}s`}
          </button>
        </div>

        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
