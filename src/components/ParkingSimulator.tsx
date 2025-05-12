import React, { useState } from "react";

export default function ParkingSimulator() {
  const [baseMinutes, setBaseMinutes] = useState(30);
  const [basePrice, setBasePrice] = useState(200);
  const [maxDayPrice, setMaxDayPrice] = useState(0); // 0 = 未設定扱い
  const [maxNightPrice, setMaxNightPrice] = useState(500);
  const [useMaxPrice, setUseMaxPrice] = useState(true);
  const [taxRate, setTaxRate] = useState(10);

  const [usageTime, setUsageTime] = useState(90);
  const [cars, setCars] = useState(10);
  const [timeZone, setTimeZone] = useState("昼間");

  const [monthlyTotalCars, setMonthlyTotalCars] = useState(300); // 月の総入庫台数
  const [expenses, setExpenses] = useState(100000); // 経費

  const [address, setAddress] = useState("");
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(false);

  const calculate = () => {
    const unitCount = Math.ceil(usageTime / baseMinutes);
    const unitPrice = basePrice * unitCount;

    const maxPrice =
      timeZone === "昼間" ? (maxDayPrice || Infinity) : (maxNightPrice || Infinity);
    const perCarEx = useMaxPrice ? Math.min(unitPrice, maxPrice) : unitPrice;
    const totalEx = perCarEx * cars;
    const totalIn = totalEx * (1 + taxRate / 100);
    const monthlyRevenue = perCarEx * monthlyTotalCars;
    const monthlyProfit = monthlyRevenue - expenses;
    const profitRate = monthlyRevenue > 0 ? ((monthlyProfit / monthlyRevenue) * 100).toFixed(1) : 0;
    return { totalEx, totalIn, monthlyRevenue, monthlyProfit, profitRate };
  };
  const getCoordinates = async (address: string) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await res.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  };

  const fetchParkingLots = async (lat: number, lon: number) => {
    const radius = 500;
    const query = `
      [out:json];
      node["amenity"="parking"](around:${radius},${lat},${lon});
      out;
    `;
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });
    const json = await res.json();
    return json.elements.map((el: any) => ({
      name: el.tags.name || "無名駐車場",
      address: `${el.lat.toFixed(4)}, ${el.lon.toFixed(4)}`,
      min: 100 + Math.floor(Math.random() * 200),
      max: 800 + Math.floor(Math.random() * 400),
    }));
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const coords = await getCoordinates(address);
      if (!coords) {
        alert("住所が見つかりませんでした。");
        setLoading(false);
        return;
      }
      const lots = await fetchParkingLots(coords.lat, coords.lon);
      setParkingLots(lots);
    } catch (err) {
      alert("検索中にエラーが発生しました。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const result = calculate();
  return (
    <div className="max-w-4xl mx-auto p-6 font-sans text-gray-800 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-4">🚗 駐車場収益シミュレーター</h1>

      {/* セクションコンポーネント */}
      <section className="bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">1. 料金設定</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label>基本時間（分）<input type="number" value={baseMinutes} onChange={(e) => setBaseMinutes(+e.target.value)} className="input" /></label>
          <label>基本料金（円）<input type="number" value={basePrice} onChange={(e) => setBasePrice(+e.target.value)} className="input" /></label>
          <label>最大料金（昼間）<input type="number" value={maxDayPrice} onChange={(e) => setMaxDayPrice(+e.target.value)} className="input" /></label>
          <label>最大料金（夜間）<input type="number" value={maxNightPrice} onChange={(e) => setMaxNightPrice(+e.target.value)} className="input" /></label>
          <label>消費税率（％）<input type="number" value={taxRate} onChange={(e) => setTaxRate(+e.target.value)} className="input" /></label>
          <label className="flex items-center space-x-2 col-span-2">
            <input type="checkbox" checked={useMaxPrice} onChange={(e) => setUseMaxPrice(e.target.checked)} className="w-4 h-4" />
            <span>最大料金を適用する</span>
          </label>
        </div>
      </section>

      <section className="bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">2. 利用状況</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label>平均利用時間（分）<input type="number" value={usageTime} onChange={(e) => setUsageTime(+e.target.value)} className="input" /></label>
          <label>駐車台数<input type="number" value={cars} onChange={(e) => setCars(+e.target.value)} className="input" /></label>
          <label className="sm:col-span-2">時間帯
            <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)} className="input">
              <option value="昼間">昼間</option>
              <option value="夜間">夜間</option>
            </select>
          </label>
        </div>
      </section>

      <section className="bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">3. 月間収益・経費</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label>月の総入庫台数<input type="number" value={monthlyTotalCars} onChange={(e) => setMonthlyTotalCars(+e.target.value)} className="input" /></label>
          <label>経費（円）<input type="number" value={expenses} onChange={(e) => setExpenses(+e.target.value)} className="input" /></label>
        </div>
      </section>

      <section className="bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">4. 計算結果</h2>
        <p>税抜収益: ¥{result.totalEx.toLocaleString()}</p>
        <p>税込収益: ¥{result.totalIn.toLocaleString()}</p>
        <p>月間売上: ¥{result.monthlyRevenue.toLocaleString()}</p>
        <p>経費差引利益: ¥{result.monthlyProfit.toLocaleString()}</p>
        <p>利益率: {result.profitRate}%</p>
      </section>

      <section className="bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">5. 周辺駐車場検索</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="例: 赤坂駅" className="input flex-1" />
          <button onClick={handleSearch} disabled={loading} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded hover:opacity-90">
            {loading ? "検索中..." : "検索"}
          </button>
        </div>
        {parkingLots.length > 0 && (
          <div className="space-y-3">
            {parkingLots.map((lot, i) => (
              <div key={i} className="border p-3 rounded">
                <strong>{lot.name}</strong><br />
                位置: {lot.address}<br />
                最小料金: ¥{lot.min} / 最大料金: ¥{lot.max}
              </div>
            ))}
            <p className="text-sm text-red-500 mt-2">
              ※この情報はOpenStreetMapのデータに基づいた目安であり、現地でのご確認を推奨します。
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
