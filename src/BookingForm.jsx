import { useState } from "react";
import QR from "./assets/upi-qr.png";

function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    timeSlot: "",
    utr: "",
    paymentConfirmed: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const timeSlots = [
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
    "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM",
    "7:00 PM - 8:00 PM",
    "8:00 PM - 9:00 PM",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.paymentConfirmed || !formData.utr) {
      alert("Please confirm payment and enter UTR ID.");
      return;
    }

    const response = await fetch("https://formspree.io/f/mwkgygzk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setSubmitted(true);
      setFormData({
        name: "",
        phone: "",
        date: "",
        timeSlot: "",
        utr: "",
        paymentConfirmed: false,
      });
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  const resetForm = () => {
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="text-center mt-10 text-white">
        <h2 className="text-2xl font-bold mb-4">✅ Booking Confirmed!</h2>
        <p>Thank you for booking your slot at THE GAMER'S HUB.</p>
        <button
          onClick={resetForm}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Book Another Slot
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-gray-800 p-6 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">
        🎮 Book Your Gaming Slot
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 text-white">
        <input
          type="text"
          name="name"
          required
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
        />
        <input
          type="tel"
          name="phone"
          required
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
        />
        <input
          type="date"
          name="date"
          required
          min={today}
          value={formData.date}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
        />
        <select
          name="timeSlot"
          required
          value={formData.timeSlot}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
        >
          <option value="">Select Time Slot</option>
          {timeSlots.map((slot, index) => (
            <option key={index} value={slot}>
              {slot}
            </option>
          ))}
        </select>

        {/* QR PAYMENT SECTION */}
        <div className="text-center mt-4">
          <p className="mb-2 font-semibold">Scan and Pay via UPI:</p>
          <img src={QR} alt="UPI QR Code" className="mx-auto w-40 h-40" />
        </div>
        <input
          type="text"
          name="utr"
          required
          placeholder="Enter UPI Transaction ID (UTR)"
          value={formData.utr}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white mt-2"
        />
        <label className="flex items-center mt-2">
          <input
            type="checkbox"
            name="paymentConfirmed"
            checked={formData.paymentConfirmed}
            onChange={handleChange}
            className="mr-2"
          />
          I confirm that I have completed the UPI payment.
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mt-4"
        >
          Submit Booking
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
