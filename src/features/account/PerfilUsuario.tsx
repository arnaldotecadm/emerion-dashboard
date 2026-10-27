import { useState } from "react";
import type { FormEvent } from "react";
import {
  Building,
  Camera,
  Check,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Save,
  Share2,
  Smartphone,
  User,
  Briefcase,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../dashboard/DashboardLayout";
import "./PerfilUsuario.css";

type ProfileTab = "info" | "contato";
type Department = "Gestor" | "Vendedor" | "Analista" | "Suporte";

interface ProfileFormData {
  fullName: string;
  role: string;
  department: Department | "";
  bio: string;
  backupEmail: string;
  phone: string;
  mobile: string;
  city: string;
  state: string;
  linkedin: string;
  instagram: string;
  whatsapp: string;
}

const PROFILE_FIELDS: (keyof ProfileFormData)[] = [
  "fullName",
  "role",
  "department",
  "bio",
  "backupEmail",
  "phone",
  "mobile",
  "city",
  "state",
  "linkedin",
  "instagram",
  "whatsapp",
];

function initialsFor(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0] ?? "")
      .join("")
      .toLocaleUpperCase() || "US"
  );
}

function defaultsFor(name: string): ProfileFormData {
  return {
    fullName: name,
    role: "",
    department: "",
    bio: "",
    backupEmail: "",
    phone: "",
    mobile: "",
    city: "",
    state: "",
    linkedin: "",
    instagram: "",
    whatsapp: "",
  };
}

function isDepartment(value: string): value is Department | "" {
  return ["", "Gestor", "Vendedor", "Analista", "Suporte"].includes(value);
}

function normalizeWhatsApp(value: string) {
  return value.replace(/^(?:https?:\/\/)?(?:www\.)?wa\.me\//i, "");
}

function isProfileFormData(value: unknown): value is ProfileFormData {
  if (typeof value !== "object" || value === null) return false;
  const data = value as Record<string, unknown>;
  return PROFILE_FIELDS.every((field) => typeof data[field] === "string") &&
    typeof data.department === "string" &&
    isDepartment(data.department);
}

function loadProfile(key: string, defaults: ProfileFormData) {
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return { data: defaults, error: "" };

    const parsed: unknown = JSON.parse(stored);
    if (!isProfileFormData(parsed)) {
      return {
        data: defaults,
        error: "Os dados salvos do perfil estão inválidos. Descarte para recomeçar.",
      };
    }

    return {
      data: { ...parsed, whatsapp: normalizeWhatsApp(parsed.whatsapp) },
      error: "",
    };
  } catch {
    return {
      data: defaults,
      error: "Não foi possível carregar o perfil salvo neste navegador.",
    };
  }
}

function PerfilUsuario() {
  const {
    userName,
    userEmail,
    userGroups,
    userId,
    userPhone,
    userEmailVerified,
  } = useOutletContext<DashboardOutletContext>();
  const displayName = userName === "there" ? "" : userName;
  const profileKey = `emerion-user-profile:${userId || userEmail || displayName || "user"}`;
  const defaults = {
    ...defaultsFor(displayName),
    mobile: userPhone || "",
  };
  const [initialProfile] = useState(() =>
    loadProfile(profileKey, defaults),
  );
  const [formData, setFormData] = useState(initialProfile.data);
  const [activeTab, setActiveTab] = useState<ProfileTab>("info");
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [storageError, setStorageError] = useState(initialProfile.error);

  const inputClass = "profile-page__control";
  const iconInputClass = "profile-page__control profile-page__control--icon";
  const labelClass = "mb-1.5 block text-xs font-semibold text-slate-700";
  const inputIconClass = "profile-page__icon text-slate-400";
  const profileName = formData.fullName.trim() || "Nome não informado";

  function updateField<Field extends keyof ProfileFormData>(
    field: Field,
    value: ProfileFormData[Field],
  ) {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setSavedFeedback(false);
    setStorageError("");
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      window.localStorage.setItem(profileKey, JSON.stringify(formData));
      setStorageError("");
      setSavedFeedback(true);
    } catch {
      setSavedFeedback(false);
      setStorageError("Não foi possível salvar o perfil neste navegador.");
    }
  }

  function handleReset() {
    try {
      window.localStorage.removeItem(profileKey);
      setFormData(defaults);
      setSavedFeedback(false);
      setStorageError("");
    } catch {
      setStorageError("Não foi possível descartar os dados salvos do perfil.");
    }
  }

  return (
    <div className="profile-page space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Perfil do Usuário
        </h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Gerencie suas informações pessoais, contatos e redes sociais
        </p>
      </div>

      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-card p-6 shadow-sm">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="group relative shrink-0">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-3xl font-bold text-white shadow-md ring-4 ring-slate-100">
              {initialsFor(profileName)}
            </div>
            <button
              type="button"
              title="Alterar foto de perfil"
              aria-label="Alterar foto de perfil"
              disabled
              className="absolute bottom-2 right-3 flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full border-2 border-card bg-ink-solid p-0 text-white shadow-md"
            >
              <Camera aria-hidden="true" className="block h-4 w-4 shrink-0" />
            </button>
          </div>

          <div className="flex-1 space-y-1.5 text-center sm:text-left">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <h3 className="text-xl font-bold text-slate-900">{profileName}</h3>
              <span className="mx-auto inline-flex w-fit items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 sm:mx-0">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Conta Ativa
              </span>
            </div>

            {(formData.role || formData.department || (userGroups?.length ?? 0) > 0) && (
              <p className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-slate-600 sm:justify-start">
                {formData.role && <span>{formData.role}</span>}
                {formData.role && formData.department && (
                  <span className="text-slate-300">•</span>
                )}
                {formData.department && (
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    Setor: {formData.department}
                  </span>
                )}
                {userGroups?.map((group) => (
                  <span
                    key={group}
                    className="rounded bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-800"
                  >
                    {group}
                  </span>
                ))}
              </p>
            )}

            {formData.bio && (
              <p className="max-w-xl pt-1 text-xs leading-relaxed text-slate-500">
                {formData.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-500 sm:justify-start">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                {userEmail || "E-mail não informado"}
              </span>
              {formData.mobile && (
                <span className="flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5 text-slate-400" />
                  {formData.mobile}
                </span>
              )}
              {(formData.city || formData.state) && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {[formData.city, formData.state].filter(Boolean).join(", ")}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="flex gap-6 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("info")}
          className={`-mb-px flex cursor-pointer items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition ${
            activeTab === "info"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <User className="h-4 w-4" />
          <span>Informações Pessoais</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("contato")}
          className={`-mb-px flex cursor-pointer items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition ${
            activeTab === "contato"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Phone className="h-4 w-4" />
          <span>Contatos & Redes Sociais</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === "info" ? (
          <section className="space-y-5 rounded-2xl border border-slate-200 bg-card p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <User className="h-4 w-4 text-emerald-500" />
              <span>Dados Cadastrais</span>
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="profile-full-name">
                  Nome Completo
                </label>
                <input
                  id="profile-full-name"
                  type="text"
                  value={formData.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  placeholder="Ex: João da Silva"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="profile-role">
                  Cargo / Função
                </label>
                <div className="relative">
                  <span className={inputIconClass}>
                    <Briefcase aria-hidden="true" />
                  </span>
                  <input
                    id="profile-role"
                    type="text"
                    value={formData.role}
                    onChange={(event) => updateField("role", event.target.value)}
                    placeholder="Ex: Diretor Geral"
                    className={iconInputClass}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="profile-department">
                  Departamento / Setor
                </label>
                <div className="relative">
                  <span className={inputIconClass}>
                    <Building aria-hidden="true" />
                  </span>
                  <select
                    id="profile-department"
                    value={formData.department}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (isDepartment(value)) updateField("department", value);
                    }}
                    className={`${iconInputClass} cursor-pointer font-medium`}
                  >
                    <option value="">Selecione o departamento</option>
                    <option value="Gestor">Gestor</option>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Analista">Analista</option>
                    <option value="Suporte">Suporte</option>
                  </select>
                </div>
                <span className="mt-1 block text-[11px] text-slate-400">
                  Selecione sua categoria de atuação na organização.
                </span>
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="profile-bio">
                Sobre Você / Biografia Curta
              </label>
              <textarea
                id="profile-bio"
                rows={3}
                value={formData.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                placeholder="Uma breve descrição sobre suas responsabilidades profissionais..."
                className={`${inputClass} profile-page__control--textarea`}
              />
              <span className="mt-1 block text-[11px] text-slate-400">
                Aparece no cabeçalho do perfil e em identificações do sistema.
              </span>
            </div>
          </section>
        ) : (
          <section className="space-y-6 rounded-2xl border border-slate-200 bg-card p-6 shadow-sm">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Phone className="h-4 w-4 text-emerald-500" />
                <span>Canais de Comunicação Direta</span>
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="profile-email">
                    E-mail Corporativo (Principal)
                  </label>
                  <div className="relative">
                    <span className={inputIconClass}>
                      <Mail aria-hidden="true" />
                    </span>
                    <input
                      id="profile-email"
                      type="email"
                      value={userEmail ?? ""}
                      placeholder="usuario@empresa.com.br"
                      readOnly
                      className={iconInputClass}
                    />
                  </div>
                  {userEmailVerified !== undefined && (
                    <span className="mt-1 block text-[11px] text-slate-400">
                      {userEmailVerified ? "E-mail verificado" : "E-mail não verificado"}
                    </span>
                  )}
                </div>
                <div>
                  <label className={labelClass} htmlFor="profile-backup-email">
                    E-mail Secundário / Recuperação
                  </label>
                  <div className="relative">
                    <span className={inputIconClass}>
                      <Mail aria-hidden="true" />
                    </span>
                    <input
                      id="profile-backup-email"
                      type="email"
                      value={formData.backupEmail}
                      onChange={(event) =>
                        updateField("backupEmail", event.target.value)
                      }
                      placeholder="pessoal@email.com"
                      className={iconInputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="profile-mobile">
                    Celular
                  </label>
                  <div className="relative">
                    <span className={inputIconClass}>
                      <Smartphone aria-hidden="true" />
                    </span>
                    <input
                      id="profile-mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={(event) => updateField("mobile", event.target.value)}
                      placeholder="(11) 98765-4321"
                      className={iconInputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="profile-phone">
                    Telefone Fixo & Ramal
                  </label>
                  <div className="relative">
                    <span className={inputIconClass}>
                      <Phone aria-hidden="true" />
                    </span>
                    <input
                      id="profile-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                      placeholder="(11) 3244-8900 R. 101"
                      className={iconInputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="profile-city">
                    Cidade / Município
                  </label>
                  <div className="relative">
                    <span className={inputIconClass}>
                      <MapPin aria-hidden="true" />
                    </span>
                    <input
                      id="profile-city"
                      type="text"
                      value={formData.city}
                      onChange={(event) => updateField("city", event.target.value)}
                      placeholder="São Paulo"
                      className={iconInputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="profile-state">
                    Estado (UF)
                  </label>
                  <input
                    id="profile-state"
                    type="text"
                    value={formData.state}
                    onChange={(event) =>
                      updateField("state", event.target.value.toUpperCase())
                    }
                    placeholder="SP"
                    maxLength={2}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-200 pt-4">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Share2 className="h-4 w-4 text-emerald-500" />
                  <span>Redes Sociais & Perfis Online</span>
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Conecte seus perfis profissionais para facilitar o contato com a equipe e parceiros
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="profile-linkedin">
                    LinkedIn (Perfil Profissional)
                  </label>
                  <div className="relative">
                    <span className="profile-page__icon text-xs font-bold text-[#0A66C2]">in</span>
                    <input
                      id="profile-linkedin"
                      type="text"
                      value={formData.linkedin}
                      onChange={(event) => updateField("linkedin", event.target.value)}
                      placeholder="linkedin.com/in/seunome"
                      className={iconInputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="profile-whatsapp">
                    WhatsApp Comercial / Link Direto
                  </label>
                  <div className="relative">
                      <span className="profile-page__prefix">
                        <svg
                          aria-hidden="true"
                          className="h-5 w-5 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle cx="12" cy="12" r="11" fill="#25D366" />
                          <path
                            d="M7.1 17.4 7.8 14.9a6.1 6.1 0 1 1 2.2 2.1l-2.9.4Z"
                            fill="white"
                          />
                          <path
                            d="M10.1 9.1c.2-.4.4-.4.7-.4h.3c.1 0 .3 0 .4.3l.6 1.4c.1.2 0 .4-.1.5l-.4.5c-.1.1-.2.2-.1.4.2.4.5.8.9 1.1.4.4.9.6 1.3.8.2.1.3.1.4-.1l.6-.7c.1-.2.3-.2.5-.1l1.3.6c.2.1.3.2.3.4 0 .2-.1.8-.5 1.1-.4.4-.9.5-1.3.5-.4 0-1-.1-1.7-.4-.8-.3-1.5-.8-2.1-1.4-.6-.6-1.1-1.3-1.4-2-.3-.6-.4-1.2-.4-1.6 0-.4.2-.8.7-1.1Z"
                            fill="#25D366"
                          />
                        </svg>
                        <span className="profile-page__prefix-text">wa.me/</span>
                      </span>
                    <input
                      id="profile-whatsapp"
                      type="text"
                      value={formData.whatsapp}
                      onChange={(event) =>
                        updateField("whatsapp", normalizeWhatsApp(event.target.value))
                      }
                      placeholder="5511999999999"
                      className="profile-page__control profile-page__control--prefix"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="profile-instagram">
                    Instagram (Perfil Comercial / Pessoal)
                  </label>
                  <div className="relative">
                    <span className="profile-page__icon text-xs font-bold text-pink-500">@</span>
                    <input
                      id="profile-instagram"
                      type="text"
                      value={formData.instagram}
                      onChange={(event) => updateField("instagram", event.target.value)}
                      placeholder="@seu_perfil ou instagram.com/perfil"
                      className={iconInputClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
          <div aria-live="polite" className="flex items-center gap-1.5 text-xs">
            {savedFeedback && (
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <Check className="h-4 w-4" />
                Informações salvas neste navegador.
              </span>
            )}
            {storageError && (
              <span role="alert" className="text-red-700">
                {storageError}
              </span>
            )}
          </div>

          <div className="flex w-full items-center gap-3 sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 sm:flex-none sm:text-sm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Descartar</span>
            </button>
            <button
              type="submit"
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:bg-emerald-400 sm:flex-none sm:text-sm"
            >
              <Save className="h-4 w-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>
        <p className="text-right text-[11px] text-slate-400">
          As alterações ficam salvas neste navegador e não alteram os dados da conta Cognito.
        </p>
      </form>
    </div>
  );
}

export default PerfilUsuario;
