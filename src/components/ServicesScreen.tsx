import React, { useState } from 'react';
import { ServiceRequest, UserProfile } from '../types';

interface ServicesScreenProps {
  user: UserProfile;
  requests: ServiceRequest[];
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({ user, requests: initialRequests }) => {
  const [requests, setRequests] = useState<ServiceRequest[]>(initialRequests);
  const [selectedService, setSelectedService] = useState<'constancia' | 'biblioteca' | 'carne'>('constancia');
  const [roomTime, setRoomTime] = useState('14:00 - 16:00');
  const [roomDate, setRoomDate] = useState('2025-09-15');
  const [roomNum, setRoomNum] = useState('Cubículo 3B (Piso 2 - Silencioso)');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleBookRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: ServiceRequest = {
      id: `req-${Date.now()}`,
      type: 'Reserva de Cubículo Biblioteca',
      date: 'Hoy',
      status: 'Aprobado',
      trackingCode: `BIB-RES-${Math.floor(1000 + Math.random() * 9000)}`,
      documentName: `${roomNum} (${roomTime})`
    };
    setRequests([newReq, ...requests]);
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 4000);
  };

  const handleGenerateCertificate = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
          Trámites Académicos y Servicios del Campus
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
          Gestión digital de constancias, reservas de instalaciones y solicitudes estudiantiles
        </p>
      </div>

      {/* Services Tabs / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setSelectedService('constancia')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedService === 'constancia'
              ? 'bg-[#EFF6FF] border-[#2563EB] shadow-xs'
              : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">description</span>
            </div>
            <span className="text-xs font-bold text-on-surface">Constancia de Matrícula</span>
          </div>
          <p className="text-[11px] text-on-surface-variant">
            Emisión instantánea con firma digital y código de verificación QR oficial.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedService('biblioteca')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedService === 'biblioteca'
              ? 'bg-[#EFF6FF] border-[#2563EB] shadow-xs'
              : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">meeting_room</span>
            </div>
            <span className="text-xs font-bold text-on-surface">Reserva de Cubículos</span>
          </div>
          <p className="text-[11px] text-on-surface-variant">
            Espacios de estudio individual y grupal en la Biblioteca Central.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedService('carne')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            selectedService === 'carne'
              ? 'bg-[#EFF6FF] border-[#2563EB] shadow-xs'
              : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">badge</span>
            </div>
            <span className="text-xs font-bold text-on-surface">Carné Universitario Digital</span>
          </div>
          <p className="text-[11px] text-on-surface-variant">
            Identificación universitaria en tiempo real para biblioteca y transporte.
          </p>
        </button>
      </div>

      {/* Service Detail Panel */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-2xs">
        {selectedService === 'constancia' && (
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Constancia de Matrícula Digital Oficial</h3>
                <p className="text-xs text-on-surface-variant">Período Académico 2025-I</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Habilitado para descarga
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-[#E2E8F0] space-y-2 text-xs">
              <p><span className="text-outline">Estudiante:</span> <span className="font-bold text-on-surface">{user.name}</span></p>
              <p><span className="text-outline">Código Universitario:</span> <span className="font-mono font-bold text-on-surface">{user.studentCode || '20210452'}</span></p>
              <p><span className="text-outline">Facultad:</span> <span className="font-semibold text-on-surface">{user.faculty}</span></p>
              <p><span className="text-outline">Créditos Registrados:</span> <span className="font-semibold text-primary">21 Créditos (5 Asignaturas)</span></p>
              <p><span className="text-outline">Validez:</span> <span>Semestre 2025-I • Cifrado con certificado raíz PKI</span></p>
            </div>

            {downloadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Constancia generada con éxito con firma digital del Secretario General.</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleGenerateCertificate}
              className="px-5 py-2.5 rounded-lg bg-primary-container hover:bg-secondary text-white font-semibold text-xs flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Generar y Descargar Documento Oficial (PDF)</span>
            </button>
          </div>
        )}

        {selectedService === 'biblioteca' && (
          <form onSubmit={handleBookRoom} className="space-y-4 max-w-xl">
            <div className="border-b border-[#E2E8F0] pb-3">
              <h3 className="text-sm font-bold text-on-surface">Reservar Cubículo de Estudio</h3>
              <p className="text-xs text-on-surface-variant">Biblioteca Central - Campus Universitario</p>
            </div>

            {bookingSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>¡Reserva confirmada! Presenta tu carné al ingresar a la biblioteca.</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-on-surface block mb-1">Fecha de la Reserva</label>
                <input
                  type="date"
                  value={roomDate}
                  onChange={(e) => setRoomDate(e.target.value)}
                  className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">Turno de Estudio</label>
                <select
                  value={roomTime}
                  onChange={(e) => setRoomTime(e.target.value)}
                  className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="09:00 - 11:00">09:00 - 11:00 (Mañana)</option>
                  <option value="11:30 - 13:30">11:30 - 13:30 (Mediodía)</option>
                  <option value="14:00 - 16:00">14:00 - 16:00 (Tarde)</option>
                  <option value="16:30 - 18:30">16:30 - 18:30 (Tarde)</option>
                  <option value="19:00 - 21:00">19:00 - 21:00 (Noche)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">Ubicación y Sala</label>
                <select
                  value={roomNum}
                  onChange={(e) => setRoomNum(e.target.value)}
                  className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="Cubículo 1A (Piso 1 - Equipos de Computación)">Cubículo 1A (Piso 1 - Equipos de Computación)</option>
                  <option value="Cubículo 3B (Piso 2 - Silencioso)">Cubículo 3B (Piso 2 - Silencioso)</option>
                  <option value="Sala Grupal 5 (Piso 3 - Pizarra Interactiva)">Sala Grupal 5 (Piso 3 - Pizarra Interactiva)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-primary-container hover:bg-secondary text-white font-semibold text-xs flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">bookmark_added</span>
              <span>Confirmar Reserva de Sala</span>
            </button>
          </form>
        )}

        {selectedService === 'carne' && (
          <div className="space-y-4 max-w-sm">
            <div className="border-b border-[#E2E8F0] pb-3">
              <h3 className="text-sm font-bold text-on-surface">Carné Universitario Digital</h3>
              <p className="text-xs text-on-surface-variant">Válido en red nacional y campus</p>
            </div>

            {/* Realistic Digital University Card Badge */}
            <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-900 via-primary to-blue-900 text-white shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px] text-white">school</span>
                  </div>
                  <span className="text-xs font-bold tracking-wider">EDUCORE UNIVERSITY</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-400 text-slate-950">
                  ACTIVO
                </span>
              </div>

              <div className="flex gap-3 items-center">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/50"
                />
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-sm leading-tight">{user.name}</p>
                  <p className="text-[11px] text-blue-200">{user.program}</p>
                  <p className="text-[11px] font-mono text-blue-300">Cód: {user.studentCode || '20210452'}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[10px] text-blue-200">
                <span>Válido hasta: Dic 2025</span>
                <span>SUNEDU / REGISTRO NACIONAL</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Historic Requests Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Historial de Solicitudes y Trámites
          </h3>
          <span className="text-xs text-outline">{requests.length} Registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-surface-container-low text-[#64748B]">
                <th className="py-2.5 px-4 font-semibold">Código de Trámite</th>
                <th className="py-2.5 px-4 font-semibold">Tipo de Solicitud</th>
                <th className="py-2.5 px-4 font-semibold">Detalle / Documento</th>
                <th className="py-2.5 px-4 font-semibold">Fecha</th>
                <th className="py-2.5 px-4 font-semibold text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-[#F8FAFC]">
                  <td className="py-3 px-4 font-mono font-bold text-primary">{r.trackingCode}</td>
                  <td className="py-3 px-4 font-semibold text-on-surface">{r.type}</td>
                  <td className="py-3 px-4 text-on-surface-variant">{r.documentName || '—'}</td>
                  <td className="py-3 px-4 text-outline">{r.date}</td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'Aprobado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
