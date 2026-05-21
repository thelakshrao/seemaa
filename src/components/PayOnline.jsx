import { useState, useEffect } from "react";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PayOnline = () => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", dob: "", amount: ""
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const res = await loadRazorpayScript();
    
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const options = {
      key: "rzp_live_SlWNuGVbsl0XQU", 
      amount: formData.amount * 100, 
      currency: "INR",
      name: "Acharya Seemaa Singh",
      description: "Direct Online Payment",
      handler: function (response) {
        alert("Payment Successful! ID: " + response.razorpay_payment_id);
        setOpen(false);
        setFormData({ name: "", email: "", phone: "", dob: "", amount: "" });
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        "Customer Name": formData.name,
        "Customer Email": formData.email,
        "Customer Phone": formData.phone,
        "Date of Birth": formData.dob,
        "Source": "Pay Online Button"
      },
      theme: { color: "#7A1E1E" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-3 top-3/4 -translate-y-1/2 rotate-90 origin-right bg-[#7A1E1E] text-white shadow-lg z-50 px-4 py-2 hover:bg-[#5a1616] transition-colors"
      >
        Pay Online
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-2xl">
            <button 
              onClick={() => setOpen(false)} 
              className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-400 hover:text-black md:text-xl text-lg"
            >
              ╳
            </button>
            
            <h2 className="font-serif text-[#7A1E1E] text-2xl mb-1 text-center font-bold">Pay Online</h2>
            <p className="text-gray-500 text-sm text-center mb-6">Enter details to proceed with payment</p>
            
            <form onSubmit={handlePayment} className="flex flex-col gap-4">
              <input 
                type="text" name="name" placeholder="Full Name" required 
                value={formData.name} onChange={handleInput}
                className="border-b-2 border-gray-200 p-2 outline-none focus:border-[#7A1E1E] transition-colors" 
              />
              
              <input 
                type="email" name="email" placeholder="Email Address" required 
                value={formData.email} onChange={handleInput}
                className="border-b-2 border-gray-200 p-2 outline-none focus:border-[#7A1E1E] transition-colors" 
              />
              
              <input 
                type="tel" name="phone" placeholder="Phone Number" required 
                value={formData.phone} onChange={handleInput}
                className="border-b-2 border-gray-200 p-2 outline-none focus:border-[#7A1E1E] transition-colors" 
              />
              
              <div className="flex flex-col">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 ml-1 font-bold">Date of Birth</label>
                <input 
                  type="date" name="dob" required 
                  value={formData.dob} onChange={handleInput}
                  className="border-b-2 border-gray-200 p-2 outline-none focus:border-[#7A1E1E] transition-colors" 
                />
              </div>

              <div className="mt-2">
                <label className="text-[10px] uppercase tracking-wider text-[#7A1E1E] ml-1 font-bold">Amount (₹)</label>
                <input 
                  type="number" name="amount" placeholder="0.00" required 
                  value={formData.amount} onChange={handleInput}
                  className="w-full border-2 border-[#7A1E1E] p-3 rounded-xl outline-none font-bold text-xl text-center text-[#7A1E1E]" 
                />
              </div>

              <button 
                type="submit" 
                className="bg-[#7A1E1E] text-white py-4 rounded-xl font-bold mt-2 shadow-lg hover:bg-[#5a1616] active:scale-95 transition-all"
              >
                PAY NOW
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PayOnline;