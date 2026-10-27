import { useOutletContext } from "react-router-dom";
import { LockKeyhole, LogOut, Mail, MessageCircle } from "lucide-react";
import type { DashboardOutletContext } from "../DashboardLayout";

function DashboardAccessDeniedPage() {
  const { onSignOut } = useOutletContext<DashboardOutletContext>();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#041627]/60 px-4 py-8 backdrop-blur-sm">
      <section
        aria-labelledby="access-denied-title"
        aria-modal="true"
        className="w-full max-w-lg rounded-2xl border border-[#e6e8ea] bg-white p-7 shadow-2xl sm:p-10"
        role="alertdialog"
      >
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#eaf3f8] text-[#006397]">
          <LockKeyhole aria-hidden="true" size={30} strokeWidth={1.8} />
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#006397]">Acesso restrito</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#041627] sm:text-3xl" id="access-denied-title">
            Sem acesso ao dashboard
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#596b7b]">
            A sua conta não tem permissão para consultar este dashboard. Contacte o suporte para obter ajuda com o
            acesso.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <a
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#087f5b] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#066b4d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f5b]"
            href="https://wa.me/351910399047"
            rel="noopener noreferrer"
            target="_blank"
          >
            <MessageCircle aria-hidden="true" size={18} />
            Contactar no WhatsApp
          </a>
          <a
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#d7e0e7] bg-white px-4 py-3 text-sm font-semibold text-[#164766] transition-colors hover:bg-[#f4f8fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006397]"
            href="mailto:arnaldotecadm@hotmail.com"
          >
            <Mail aria-hidden="true" size={18} />
            Enviar email
          </a>
        </div>

        <button
          className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#d7e0e7] bg-[#f4f8fa] px-4 py-3 text-sm font-semibold text-[#164766] transition-colors hover:bg-[#eaf3f8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006397]"
          onClick={onSignOut}
          type="button"
        >
          <LogOut aria-hidden="true" size={18} />
          Terminar sessão e voltar a entrar
        </button>

        <p className="mt-6 text-center text-xs text-[#8192a7]">
          Será encaminhado para iniciar sessão novamente. WhatsApp: +351 910 399 047{" "}
          <span aria-hidden="true">·</span> arnaldotecadm@hotmail.com
        </p>
      </section>
    </div>
  );
}

export default DashboardAccessDeniedPage;
