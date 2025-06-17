import React, { useState } from "react";
import qrCode from "./upi-qr.png"; // Make sure this image is in the src folder

function App() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    utr: "",
    paymentConfirmed: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [view, setView] = useState("home");
  const [bookedSlots, setBookedSlots] = useState([]);

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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const today = new Date().toISOString().split("T")[0];

  const isPastTimeSlot = (slotTime) => {
    if (formData.date !== today) return false;
    const now = new Date();
    const [startHour, startMinutes, period] = slotTime
      .split(" ")[0]
      .split(/[:]/)
      .concat(slotTime.includes("PM") ? "PM" : "AM");
    let hour = parseInt(startHour, 10);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    return now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= parseInt(startMinutes, 10));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isAlreadyBooked = bookedSlots.some(
      (slot) => slot.date === formData.date && slot.time === formData.time
    );

    if (isAlreadyBooked) {
      alert("This slot is already booked!");
      return;
    }

    if (!formData.paymentConfirmed || !formData.utr.trim()) {
      alert("Please confirm payment and enter UTR ID.");
      return;
    }

    try {
      const response = await fetch("https://formspree.io/f/mzzgvekr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log("Booking sent:", formData);
        setBookedSlots([...bookedSlots, { date: formData.date, time: formData.time }]);
        setSubmitted(true);
      } else {
        console.error("Failed to send booking");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 p-4 shadow-lg flex justify-between items-center">
        <h1 className="text-2xl font-bold">THE GAMER'S HUB</h1>
        <nav className="space-x-4">
          <button onClick={() => setView("home")} className="hover:text-green-400">Home</button>
          <button onClick={() => setView("about")} className="hover:text-green-400">About</button>
          <button onClick={() => setView("contact")} className="hover:text-green-400">Contact</button>
        </nav>
      </header>

      <main className="p-6 flex justify-center">
        <section className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md">
          {view === "home" && !submitted && (
            <>
              <h2 className="text-2xl font-semibold text-center mb-4">Book Your Slot</h2>
              <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 outline-none"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 outline-none"
                  required
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                  className="p-3 rounded bg-gray-700 text-white outline-none"
                  required
                />
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="p-3 rounded bg-gray-700 text-white outline-none"
                  required
                >
                  <option value="">Select Time Slot</option>
                  {timeSlots.map((slot) => {
                    const isDisabled =
                      isPastTimeSlot(slot) ||
                      bookedSlots.some(
                        (b) => b.date === formData.date && b.time === slot
                      );
                    return (
                      <option key={slot} value={slot} disabled={isDisabled}>
                        {slot} {isDisabled ? "(Unavailable)" : ""}
                      </option>
                    );
                  })}
                </select>

                {/* QR and Payment Details */}
                <div className="text-center">
                  <p className="text-sm mb-2">📲 Scan the UPI QR to pay:</p>
                  <img src={qrCode} alt="UPI QR Code" className="mx-auto w-40 h-40 mb-2 border rounded" />
                  <p className="text-xs text-gray-400">UPI ID: Q541176484@ybl</p>
                </div>

                <input
                  type="text"
                  name="utr"
                  placeholder="Enter UPI Transaction ID (UTR)"
                  value={formData.utr}
                  onChange={handleChange}
                  className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 outline-none"
                  required
                />

                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    name="paymentConfirmed"
                    checked={formData.paymentConfirmed}
                    onChange={handleChange}
                    className="accent-green-500"
                    required
                  />
                  <span>I have completed the payment</span>
                </label>

                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 transition-all p-3 rounded font-bold"
                >
                  Book Now
                </button>
              </form>
            </>
          )}

          {view === "home" && submitted && (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Thank you, {formData.name}!</h2>
              <p>Your booking for {formData.time} on {formData.date} is received.</p>
              <button
                onClick={() => {
                  setFormData({
                    name: "",
                    phone: "",
                    date: "",
                    time: "",
                    utr: "",
                    paymentConfirmed: false
                  });
                  setSubmitted(false);
                }}
                className="mt-4 bg-blue-500 hover:bg-blue-600 p-2 rounded"
              >
                Book Another Slot
              </button>
            </div>
          )}

          {view === "about" && (
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-center mb-2">About Us</h2>
              <p>
                Welcome to THE GAMER'S HUB – your ultimate destination for immersive gaming experiences.
                We provide a premium gaming lounge with high-end systems and the latest games, perfect for friends and tournaments.
              </p>
            </div>
          )}

          {view === "contact" && (
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-center mb-2">Contact Us</h2>
              <p>📍 Location: Near XYZ Complex, YourCity</p>
              <p>📞 Phone: +91 98765 43210</p>
              <p>📧 Email: thegamershub@example.com</p>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-gray-800 text-center p-4 mt-auto text-sm">
        &copy; {new Date().getFullYear()} THE GAMER'S HUB. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
