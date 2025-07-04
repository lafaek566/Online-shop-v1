import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Editcheckout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checkout, setCheckout] = useState(null);

  useEffect(() => {
    const fetchCheckout = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/checkout/${id}`
      );
      setCheckout(res.data);
    };
    fetchCheckout();
  }, [id]);

  const handleCartChange = (index, field, value) => {
    const updatedCart = [...checkout.cart];
    updatedCart[index][field] =
      field === "qty" || field === "price" ? Number(value) : value;
    setCheckout({ ...checkout, cart: updatedCart });
  };

  const handleRemoveItem = (index) => {
    const updatedCart = checkout.cart.filter((_, i) => i !== index);
    setCheckout({ ...checkout, cart: updatedCart });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/checkout/${id}`,
        checkout
      );
      alert("✅ Berhasil update checkout!");
      navigate("/admin");
    } catch (err) {
      alert("❌ Gagal update data.");
      console.error(err);
    }
  };

  if (!checkout) return <p className="p-6">⏳ Memuat data...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">✏️ Edit Checkout</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">📧 Email</label>
          <input
            value={checkout.email}
            onChange={(e) =>
              setCheckout({ ...checkout, email: e.target.value })
            }
            className="border p-2 w-full rounded"
            type="email"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">🛒 Item di Keranjang</h3>
          {checkout.cart.map((item, i) => (
            <div
              key={i}
              className="border rounded p-3 mb-3 bg-gray-50 space-y-2"
            >
              <div>
                <label className="text-sm">📝 Nama Produk:</label>
                <input
                  value={item.title}
                  onChange={(e) => handleCartChange(i, "title", e.target.value)}
                  className="border p-1 w-full rounded"
                />
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="text-sm">Qty:</label>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => handleCartChange(i, "qty", e.target.value)}
                    className="border p-1 w-20 rounded"
                  />
                </div>
                <div>
                  <label className="text-sm">Harga:</label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      handleCartChange(i, "price", e.target.value)
                    }
                    className="border p-1 w-28 rounded"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveItem(i)}
                className="text-sm text-red-500 hover:underline mt-1"
              >
                ❌ Hapus Item Ini
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold"
        >
          💾 Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
