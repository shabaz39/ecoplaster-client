import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { auth } from "../../firebaseConfig";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";


declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [step, setStep] = useState(1); // Step 1: Enter number, Step 2: Verify OTP
 

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth, // First argument: Firebase auth instance
        "recaptcha-container", // Second argument: Container ID
        {
          size: "invisible", // Makes reCAPTCHA invisible
          callback: () => {
            console.log("reCAPTCHA verification successful!");
          },
        }
      );;
    }
  };

  const sendOTP = async () => {
    if (phoneNumber.length === 10) {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;

      try {
        const result = await signInWithPhoneNumber(auth, `+91${phoneNumber}`, appVerifier);
        setConfirmationResult(result);
        setStep(2); // Move to OTP step
      } catch (error) {
        console.error("Error sending OTP:", error);
      }
    }
  };

  const verifyOTP = async () => {
    try {
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();

      console.log("Logged in user:", result.user);
      console.log("ID Token:", idToken);
      alert("Login successful!");

      // Send the ID Token to your backend here via GraphQL mutation
      // await loginWithOTP({ variables: { idToken } });

      setStep(1); // Reset modal state
      onClose(); // Close modal
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed lg:text-md text-sm inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-white rounded-lg shadow-lg w-full lg:max-w-3xl lg:h-2/4 z-50"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 bg-newgreensecond text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">{step === 1 ? "Login/Signup" : "Verify OTP"}</h2>
          <button onClick={onClose} className="text-white hover:text-newbeige">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col items-center p-6">
          {step === 1 ? (
            <>
              <h3 className="font-semibold text-lg text-gray-800 mb-4">Enter mobile number</h3>
              <div className="flex items-center border rounded-lg overflow-hidden w-full md:w-2/3">
                <span className="px-3 bg-gray-200 text-gray-900">+91</span>
                <input
                  type="text"
                  placeholder="Mobile Number"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 text-gray-900 focus:outline-none"
                />
              </div>
              <button
                onClick={sendOTP}
                className="w-full md:w-2/3 mt-4 py-2 font-semibold bg-newgreen text-white rounded-lg hover:bg-newgreensecond"
              >
                Get OTP
              </button>
            </>
          ) : (
            <>
              <h3 className="font-semibold text-lg text-gray-800 mb-4">Enter OTP</h3>
              <input
                type="text"
                placeholder="OTP"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full md:w-2/3 px-3 py-2 text-gray-900 border rounded-lg focus:outline-none"
              />
              <button
                onClick={verifyOTP}
                className="w-full md:w-2/3 mt-4 py-2 font-semibold bg-newgreen text-white rounded-lg hover:bg-newgreensecond"
              >
                Verify OTP
              </button>
            </>
          )}
          {/* reCAPTCHA Container */}
          <div id="recaptcha-container"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupModal;
