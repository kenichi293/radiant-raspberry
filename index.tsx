
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ParkingSimulator() {
  const [baseMinutes, setBaseMinutes] = useState(30);
  const [basePrice, setBasePrice] = useState(200);
  const [maxDayPrice, setMaxDayPrice] = useState(1200);
  const [maxNightPrice, setMaxNightPrice] = useState(500);
  const [taxRate, setTaxRate] = useState(10);

  const [usageTime, setUsageTime] = useState(90);
  const [cars, setCars] = useState(10);
  const [timeZone, setTimeZone] = useState("昼間");

  const [language, setLanguage] = useState("ja");

  const t = (jp, en) => (language === "ja" ? jp : en);

  const calculate = () => {
    const unitCount = Math.ceil(usageTime / baseMinutes);
    const unitPrice = basePrice * unitCount;
    const maxPrice = timeZone === "昼間" ? maxDayPrice : maxNightPrice;
    const totalEx = Math.min(unitPrice, maxPrice) * cars;
    const totalIn = totalEx * (1 + taxRate / 100);
    return { totalEx, totalIn };
  };

  const result = calculate();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <div className="flex justify-end">
        <select
          className="border p-2 rounded mb-2"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </div>

      <Card>
        <CardContent className="space-y-2 p-4">
          <h2 className="text-xl font-bold">{t("料金設定", "Rate Settings")}</h2>
          <div className="grid grid-cols-2 gap-2">
            <label>
              {t("基本時間（分）", "Base Time (minutes)")}
              <Input
                type="number"
                value={baseMinutes}
                onChange={(e) => setBaseMinutes(Number(e.target.value))}
              />
            </label>
            <label>
              {t("基本料金（税抜）", "Base Price (tax excluded)")}
              <Input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
              />
            </label>
            <label>
              {t("最大料金（昼間）", "Max Day Price")}
              <Input
                type="number"
                value={maxDayPrice}
                onChange={(e) => setMaxDayPrice(Number(e.target.value))}
              />
            </label>
            <label>
              {t("最大料金（夜間）", "Max Night Price")}
              <Input
                type="number"
                value={maxNightPrice}
                onChange={(e) => setMaxNightPrice(Number(e.target.value))}
              />
            </label>
            <label>
              {t("消費税率（%）", "Tax Rate (%)")}
              <Input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
              />
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 p-4">
          <h2 className="text-xl font-bold">{t("利用状況", "Usage Info")}</h2>
          <div className="grid grid-cols-2 gap-2">
            <label>
              {t("平均利用時間（分）", "Avg. Usage Time (minutes)")}
              <Input
                type="number"
                value={usageTime}
                onChange={(e) => setUsageTime(Number(e.target.value))}
              />
            </label>
            <label>
              {t("駐車台数", "Number of Cars")}
              <Input
                type="number"
                value={cars}
                onChange={(e) => setCars(Number(e.target.value))}
              />
            </label>
            <label>
              {t("時間帯", "Time Zone")}
              <select
                className="border p-2 rounded w-full"
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
              >
                <option value="昼間">{t("昼間", "Daytime")}</option>
                <option value="夜間">{t("夜間", "Nighttime")}</option>
              </select>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <h2 className="text-xl font-bold">{t("計算結果", "Result")}</h2>
          <p>{t("税抜収益", "Revenue (Tax Excl.)")}: ¥{result.totalEx.toLocaleString()}</p>
          <p>{t("税込収益", "Revenue (Tax Incl.)")}: ¥{result.totalIn.toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  );
}
