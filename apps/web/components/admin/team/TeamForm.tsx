import { useState, useEffect } from "react";
import { Card, Button, Input } from "@perception-mapper/ui";
import { useTranslation } from "../../../hooks/useTranslation";

export default function TeamForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    description: "",
    leadId: "",
    tier: "FREE",
    maxMembers: 5,
    status: "ACTIVE",
  });
  const [users, setUsers] = useState<Array<{ id: string; email: string }>>([]);

  useEffect(() => {
    // fetch available users for lead selector – using existing admin/users endpoint
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then(setUsers)
      .catch(() => console.error("Failed to load admin users"));
  }, []);

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch("/api/admin/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    // TODO: refresh list / show toast
    setForm({
      name: "",
      description: "",
      leadId: "",
      tier: "FREE",
      maxMembers: 5,
      status: "ACTIVE",
    });
  };

  return (
    <Card className="glassmorphism p-4">
      <h3 className="text-sm font-semibold text-slate-200 mb-3">{t("team.form.create")}</h3>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <Input name="name" placeholder={t("team.form.namePlaceholder")} value={form.name} onChange={handleChange} required />
        <Input name="description" placeholder={t("team.form.descPlaceholder")} value={form.description} onChange={handleChange} />
        <select
          name="leadId"
          value={form.leadId}
          onChange={handleChange}
          className="rounded-md border border-slate-700 bg-slate-800 p-2 text-slate-200"
        >
          <option value="">{t("team.form.leadPlaceholder")}</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.email}
            </option>
          ))}
        </select>
        <select
          name="tier"
          value={form.tier}
          onChange={handleChange}
          className="rounded-md border border-slate-700 bg-slate-800 p-2 text-slate-200"
        >
          <option value="FREE">FREE</option>
          <option value="PRO">PRO</option>
          <option value="ENTERPRISE">ENTERPRISE</option>
        </select>
        <Input name="maxMembers" type="number" min={1} placeholder={t("team.form.maxPlaceholder")} value={form.maxMembers} onChange={handleChange} />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="rounded-md border border-slate-700 bg-slate-800 p-2 text-slate-200"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="SUSPENDED">SUSPENDED</option>
        </select>
        <div className="flex space-x-2 mt-2">
          <Button type="submit" variant="primary" size="sm">
            {t("team.form.submit")}
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => setForm({ name: "", description: "", leadId: "", tier: "FREE", maxMembers: 5, status: "ACTIVE" })}>
            {t("team.form.reset")}
          </Button>
        </div>
      </form>
    </Card>
  );
}
