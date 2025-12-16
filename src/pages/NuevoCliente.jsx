import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, User, Phone, DollarSign, 
  MapPin, Send, ShieldCheck, CheckCircle, XCircle, 
  Calculator, Calendar, TrendingUp, CreditCard, Camera, Save
} from 'lucide-react';

const NuevoCliente = () => {
  const navigate = useNavigate();

  // --- CONFIGURACIÓN ---
  // ⚠️ REEMPLAZAR CON TU NÚMERO REAL (Código país + número)
  // Ej: Colombia "57300...", Perú "519..."
  const ADMIN_PHONE = "573122339294"; 

  // --- ESTADOS ---
  const [step, setStep] = useState(1);
  const [loadingGPS, setLoadingGPS] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Estado de carga al guardar
  const [searchDni, setSearchDni] = useState('');
  const [clientStatus, setClientStatus] = useState(null);
  
  // Validaciones del flujo WhatsApp
  const [whatsappOpened, setWhatsappOpened] = useState(false);
  const [evidenceConfirmed, setEvidenceConfirmed] = useState(false);
  
  const [form, setForm] = useState({
    nombre: '', dni: '', telefono: '', direccion: '',
    monto: '', interes: 20, dias: 24,
    gps: null 
  });

  const [calculo, setCalculo] = useState({ totalPagar: 0, cuotaDiaria: 0, ganancia: 0 });

  // --- MOCK DB (Simulación de Buro de Crédito) ---
  const mockDB = [
    { dni: '12345678', nombre: 'Juan "Mala Paga" Pérez', status: 'risk' },
    { dni: '87654321', nombre: 'María Gómez', status: 'clean' },
  ];

  // --- CÁLCULOS AUTOMÁTICOS ---
  useEffect(() => {
    const monto = parseFloat(form.monto) || 0;
    const interesPct = parseFloat(form.interes) / 100;
    const ganancia = monto * interesPct;
    const total = monto + ganancia;
    const cuota = form.dias > 0 ? total / form.dias : 0;
    setCalculo({ totalPagar: total, cuotaDiaria: cuota, ganancia });
  }, [form.monto, form.interes, form.dias]);

  // --- FUNCIONES ---

  // 1. Buscar Cliente (Paso 1)
  const handleSearch = () => {
    const found = mockDB.find(c => c.dni === searchDni);
    if (found) {
      setClientStatus(found.status);
      if (found.status === 'clean') setForm(prev => ({ ...prev, nombre: found.nombre, dni: found.dni }));
    } else {
      setClientStatus('new');
      setForm(prev => ({ ...prev, dni: searchDni }));
    }
  };

  // 2. Capturar GPS
  const capturarUbicacion = () => {
    if (!navigator.geolocation) return alert("GPS no soportado");
    setLoadingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(prev => ({ ...prev, gps: { lat: pos.coords.latitude, lng: pos.coords.longitude } }));
        setLoadingGPS(false);
      },
      () => { alert("Error GPS. Actívalo e intenta de nuevo."); setLoadingGPS(false); },
      { enableHighAccuracy: true }
    );
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // 3. Abrir WhatsApp con datos precargados
  const handleOpenWhatsApp = () => {
    if (!form.gps) return alert("Primero captura la ubicación GPS");

    const mapsLink = `http://googleusercontent.com/maps.google.com/?q=${form.gps.lat},${form.gps.lng}`;
    
    const text = `
🆕 *SOLICITUD DE CRÉDITO*
👤 *Cliente:* ${form.nombre}
🆔 *CÉDULA:* ${form.dni}
📞 *Tel:* ${form.telefono}
📍 *Ubicación GPS:* ${mapsLink}

💰 *DETALLE:*
💵 Presta: S/ ${form.monto}
🗓 Plazo: ${form.dias} días
✅ *Cuota:* S/ ${calculo.cuotaDiaria.toFixed(2)}

📷 *ADJUNTO AHORA:*
1. Foto Cédula (Ambos lados)
2. Foto Casa/Negocio
`.trim();

    const url = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setWhatsappOpened(true);
  };

  // 4. GUARDAR CRÉDITO (Persistencia en LocalStorage)
  const handleCrearCredito = () => {
    setIsSaving(true);

    setTimeout(() => {
      // A. Crear el objeto del nuevo cliente
      const nuevoCliente = {
        id: Date.now(), // ID único
        nombre: form.nombre,
        dni: form.dni,
        telefono: form.telefono,
        direccion: form.direccion,
        estado: 'active',
        deuda: calculo.totalPagar,
        cuota: calculo.cuotaDiaria,
        ultimoPago: 'Reciente',
        fechaInicio: new Date().toLocaleDateString()
      };

      // B. Guardar en memoria del navegador
      const clientesGuardados = JSON.parse(localStorage.getItem('nuevos_clientes') || '[]');
      clientesGuardados.push(nuevoCliente);
      localStorage.setItem('nuevos_clientes', JSON.stringify(clientesGuardados));
      
      console.log("Cliente guardado:", nuevoCliente);
      
      alert("✅ ¡CRÉDITO CREADO CON ÉXITO!\nEl cliente ha sido registrado correctamente.");
      
      setIsSaving(false);
      navigate('/listado-general'); // Redirigir al listado
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white pb-24 transition-colors">
      
      {/* HEADER */}
      <div className="sticky top-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center gap-4 z-20">
        <button onClick={() => step === 2 ? setStep(1) : navigate(-1)} className="p-2 bg-slate-100 dark:bg-zinc-800 rounded-full hover:bg-slate-200 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">{step === 1 ? 'Validar Cliente' : 'Nuevo Crédito'}</h1>
      </div>

      <div className="p-4 space-y-6">

        {/* --- PASO 1: VALIDACIÓN --- */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
              <label className="text-sm font-bold text-slate-500 uppercase">Número de Cédula</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <input 
                    type="tel" value={searchDni} onChange={(e) => setSearchDni(e.target.value)}
                    placeholder="Ej: 11223344"
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl py-3 pl-10 pr-4 font-bold text-lg outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <button onClick={handleSearch} className="bg-emerald-600 text-white px-4 rounded-xl font-bold hover:bg-emerald-700 transition-colors">Verificar</button>
              </div>

              {clientStatus === 'risk' && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 p-4 rounded-xl flex gap-3 text-red-600 dark:text-red-400">
                  <XCircle size={24} />
                  <div><h3 className="font-bold">¡RIESGO DETECTADO!</h3><p className="text-sm">Cliente con mal historial.</p></div>
                </div>
              )}

              {(clientStatus === 'clean' || clientStatus === 'new') && (
                <button onClick={() => setStep(2)} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-colors">
                  {clientStatus === 'new' ? 'Registrar Nuevo Cliente' : 'Continuar con Crédito'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* --- PASO 2: FORMULARIO --- */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* 1. DATOS PERSONALES */}
            <section className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-bold text-sm uppercase"><User size={18} /> Datos Personales</div>
              
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre Completo" className="input-base w-full bg-slate-50 dark:bg-zinc-950 p-3 rounded-lg border border-slate-200 dark:border-zinc-700 outline-none focus:border-emerald-500" />
              
              <div className="grid grid-cols-2 gap-3">
                {/* CAMPO DE CÉDULA DESTACADO */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase mb-1 block pl-1">Número de Cédula</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 text-emerald-500" size={18} />
                    <input 
                      type="tel" 
                      name="dni" 
                      value={form.dni} 
                      readOnly 
                      className="w-full bg-emerald-50 dark:bg-emerald-900/10 pl-10 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 font-bold cursor-not-allowed" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase mb-1 block pl-1">Teléfono</label>
                  <input type="tel" name="telefono" onChange={handleChange} placeholder="Teléfono" className="input-base w-full bg-slate-50 dark:bg-zinc-950 p-3 rounded-lg border border-slate-200 dark:border-zinc-700 outline-none focus:border-emerald-500" />
                </div>
              </div>

              <textarea name="direccion" onChange={handleChange} placeholder="Dirección exacta..." className="w-full bg-slate-50 dark:bg-zinc-950 p-3 rounded-lg border border-slate-200 dark:border-zinc-700 outline-none focus:border-emerald-500 resize-none h-20" />
            </section>

            {/* 2. SIMULADOR */}
            <section className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-5 shadow-sm">
               <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase">
                 <Calculator size={18} /> Simulador Financiero
               </div>

               <div>
                 <label className="text-xs text-slate-500 dark:text-zinc-400 mb-1 block font-semibold">Monto a Prestar</label>
                 <div className="relative">
                   <DollarSign className="absolute left-3 top-3.5 text-slate-400" size={20} />
                   <input type="number" name="monto" onChange={handleChange} placeholder="0.00" className="w-full bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white text-3xl font-bold border border-slate-200 dark:border-zinc-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-emerald-500 transition-colors" />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs text-slate-500 dark:text-zinc-400 mb-1 block flex items-center gap-1"><TrendingUp size={12} /> Interés (%)</label>
                   <input type="number" name="interes" value={form.interes} onChange={handleChange} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-lg p-3 font-semibold text-center outline-none focus:border-emerald-500" />
                 </div>
                 <div>
                   <label className="text-xs text-slate-500 dark:text-zinc-400 mb-1 block flex items-center gap-1"><Calendar size={12} /> Plazo (Días)</label>
                   <input type="number" name="dias" value={form.dias} onChange={handleChange} className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-lg p-3 font-semibold text-center outline-none focus:border-emerald-500" />
                 </div>
               </div>

               <div className="bg-slate-50 dark:bg-zinc-950 rounded-xl p-4 border border-slate-200 dark:border-zinc-800 space-y-3">
                 <div className="flex justify-between items-center border-b border-slate-200 dark:border-zinc-800 pb-3">
                   <span className="text-sm text-slate-500 dark:text-zinc-400">Total a Devolver:</span>
                   <span className="text-lg font-bold text-slate-800 dark:text-white">S/ {calculo.totalPagar.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-emerald-600 dark:text-emerald-500 font-bold">Valor Cuota Fija:</span>
                   <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-lg text-xl font-extrabold shadow-sm">
                     S/ {calculo.cuotaDiaria.toFixed(2)}
                   </div>
                 </div>
               </div>
            </section>

            {/* 3. EVIDENCIA OBLIGATORIA (GPS + WHATSAPP) */}
            <section className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase"><ShieldCheck size={18} /> Validación de Evidencia</div>
              
              {/* GPS */}
              <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-3 rounded-lg border border-slate-200 dark:border-zinc-700">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${form.gps ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}><MapPin size={20} /></div>
                  <div className="text-sm">
                    <p className="font-bold text-slate-700 dark:text-zinc-200">Ubicación GPS</p>
                    <p className="text-xs text-slate-500">{form.gps ? 'Capturada' : 'Requerida'}</p>
                  </div>
                </div>
                <button onClick={capturarUbicacion} disabled={form.gps || loadingGPS} className="text-xs bg-indigo-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
                  {loadingGPS ? '...' : form.gps ? 'OK' : 'CAPTURAR'}
                </button>
              </div>

              {/* INSTRUCCIONES CLARAS DE FOTOS */}
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-1">
                  <Camera size={14} /> FOTOS OBLIGATORIAS POR WHATSAPP:
                </p>
                <ul className="text-xs text-blue-700 dark:text-blue-400 list-disc pl-4 space-y-1">
                  <li>Foto clara de la <strong>CÉDULA</strong> (Ambos lados)</li>
                  <li>Foto de la <strong>CASA</strong> o Negocio (Fachada)</li>
                </ul>
              </div>

              {/* BOTÓN WHATSAPP */}
              <button 
                onClick={handleOpenWhatsApp}
                disabled={!form.gps}
                className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-md ${
                  !form.gps ? 'bg-slate-300 dark:bg-zinc-800 text-slate-500 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                <Send size={18} />
                {whatsappOpened ? 'REENVIAR EVIDENCIA' : 'ENVIAR FOTOS Y DATOS'}
              </button>
              
              {/* CONFIRMACIÓN MANUAL */}
              {whatsappOpened && (
                <div 
                  onClick={() => setEvidenceConfirmed(!evidenceConfirmed)}
                  className={`cursor-pointer p-3 rounded-lg border flex items-center gap-3 transition-colors ${
                    evidenceConfirmed ? 'bg-emerald-100 border-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-800' : 'bg-white border-slate-300 dark:bg-zinc-900 dark:border-zinc-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    evidenceConfirmed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-400'
                  }`}>
                    {evidenceConfirmed && <CheckCircle size={16} />}
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Confirmo que envié las <strong>FOTOS de Cédula y Casa</strong> al WhatsApp.
                  </p>
                </div>
              )}
            </section>

            {/* BOTÓN FINAL */}
            <button 
              onClick={handleCrearCredito}
              disabled={!evidenceConfirmed || isSaving}
              className={`w-full py-4 rounded-xl text-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                (!evidenceConfirmed || isSaving) 
                  ? 'bg-slate-300 dark:bg-zinc-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  PROCESANDO...
                </>
              ) : (
                <>
                  <Save size={20} />
                  CREAR CRÉDITO OFICIAL
                </>
              )}
            </button>

          </div>
        )}
      </div>
    </div>
  );
};

export default NuevoCliente;