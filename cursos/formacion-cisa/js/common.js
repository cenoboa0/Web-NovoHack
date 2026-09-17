/* =========================================================
   common.js — navegación, progreso y utilidades compartidas
   Plan de estudio: Formación CISA — Dominio 1
   ========================================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "cisa_study_progress_v1";

  // Catálogo de módulos: usado por la portada y por la barra de progreso
  // de cada página de módulo. El orden es el orden de estudio recomendado.
  const MODULES = [
    { id: "m1", file: "modulo-1-panorama-cisa.html", short: "1. Panorama CISA", title: "Panorama de la certificación CISA y del Dominio 1", minutes: 12 },
    { id: "m2", file: "modulo-2-estandares-planificacion.html", short: "2. Estándares y planificación", title: "Estándares, ética y planificación de la auditoría de SI", minutes: 20 },
    { id: "m3", file: "modulo-3-controles-internos.html", short: "3. Controles internos", title: "Controles internos y objetivos de control", minutes: 18 },
    { id: "m4", file: "modulo-4-auditoria-basada-riesgos.html", short: "4. Auditoría por riesgos", title: "Auditoría basada en riesgos", minutes: 15 },
    { id: "m5", file: "modulo-5-tipos-de-auditoria.html", short: "5. Tipos de auditoría", title: "Tipos de auditoría y auditoría continua", minutes: 18 },
    { id: "m6", file: "modulo-6-ejecucion-y-evidencia.html", short: "6. Ejecución y evidencia", title: "Ejecución de la auditoría: fases, evidencia y análisis de datos", minutes: 25 },
    { id: "m7", file: "modulo-7-informes-comunicacion.html", short: "7. Informes y seguimiento", title: "Informes, comunicación de resultados y seguimiento", minutes: 15 },
    { id: "m8", file: "modulo-8-egit-marcos-gobierno.html", short: "8. EGIT y marcos", title: "EGIT y marcos de gobierno de TI", minutes: 16 },
    { id: "m9", file: "modulo-9-normativa-ti.html", short: "9. Normativa TI", title: "Estándares, políticas y procedimientos de TI", minutes: 14 },
    { id: "m10", file: "modulo-10-estructura-organizacional.html", short: "10. Estructura y SoD", title: "Estructura organizacional, comités y segregación de funciones", minutes: 17 },
    { id: "m11", file: "modulo-11-riesgo-empresarial.html", short: "11. Riesgo empresarial", title: "Gestión de riesgos empresariales", minutes: 18 },
    { id: "m12", file: "modulo-12-madurez-recursos.html", short: "12. Madurez y recursos", title: "Modelos de madurez y gestión de recursos de TI", minutes: 16 },
    { id: "m13", file: "modulo-13-seguridad-terceros-nube.html", short: "13. Terceros y nube", title: "Seguridad de la información, terceros y gobierno en la nube", minutes: 18 },
    { id: "m14", file: "modulo-14-rendimiento-ti.html", short: "14. Rendimiento TI", title: "Supervisión, informes y optimización del rendimiento de TI", minutes: 18 },
    { id: "m15", file: "modulo-15-caso-negocio-factibilidad.html", short: "15. Caso de negocio", title: "Caso de negocio, estudio de factibilidad y SDLC", minutes: 16 },
    { id: "m16", file: "modulo-16-adquisicion-hardware-software.html", short: "16. Adquisición HW/SW", title: "Definición de requisitos y adquisición de hardware/software", minutes: 16 },
    { id: "m17", file: "modulo-17-metodologias-prueba.html", short: "17. Metodologías prueba", title: "Metodologías de prueba de sistemas", minutes: 18 },
    { id: "m18", file: "modulo-18-gestion-configuracion-cambios.html", short: "18. Config y cambios", title: "Gestión de configuración y cambios", minutes: 14 },
    { id: "m19", file: "modulo-19-migracion-datos-infraestructura.html", short: "19. Migración datos", title: "Migración de datos e implementación de infraestructura", minutes: 15 },
    { id: "m20", file: "modulo-20-implementacion-revision-cierre.html", short: "20. Implement. y cierre", title: "Revisión posterior a la implementación y cierre del proyecto", minutes: 15 },
    { id: "m21", file: "modulo-21-mantenimiento-rol-auditor.html", short: "21. Mantenimiento", title: "Mantenimiento del sistema y rol integral del auditor SI", minutes: 14 },
    { id: "m22", file: "modulo-22-hardware-activos-interfaces.html", short: "22. Hardware y activos", title: "Hardware, gestión de activos e interfaces del sistema", minutes: 13 },
    { id: "m23", file: "modulo-23-euc-rendimiento-sistemas.html", short: "23. EUC y rendimiento", title: "Computación de usuario final y rendimiento de sistemas", minutes: 14 },
    { id: "m24", file: "modulo-24-infraestructura-red-operaciones-si.html", short: "24. Red y operaciones SI", title: "Infraestructura de red y operaciones de SI", minutes: 13 },
    { id: "m25", file: "modulo-25-incidentes-problemas-soporte.html", short: "25. Incidentes y soporte", title: "Gestión de incidentes, problemas y soporte", minutes: 15 },
    { id: "m26", file: "modulo-26-cambios-configuracion-versiones-parches.html", short: "26. Cambios y versiones", title: "Gestión de cambios, versiones y esquemas de respaldo", minutes: 16 },
    { id: "m27", file: "modulo-27-gestion-nivel-servicio-ti.html", short: "27. Nivel de servicio TI", title: "Gestión del nivel de servicio de TI", minutes: 13 },
    { id: "m28", file: "modulo-28-analisis-impacto-negocio-clasificacion.html", short: "28. BIA y criticidad", title: "Análisis de impacto en el negocio y clasificación de operaciones", minutes: 13 },
    { id: "m29", file: "modulo-29-planificacion-continuidad-negocio.html", short: "29. BCP y desastres", title: "Planificación de la continuidad del negocio (BCP) y gestión de desastres", minutes: 20 },
    { id: "m30", file: "modulo-30-auditoria-continuidad-negocio.html", short: "30. Auditoría BCP", title: "Auditoría de la continuidad del negocio", minutes: 12 },
    { id: "m31", file: "modulo-31-recuperacion-desastres-rpo-rto.html", short: "31. DRP y RPO/RTO", title: "Recuperación de desastres, RPO/RTO y estrategias de recuperación", minutes: 14 },
    { id: "m32", file: "modulo-32-resiliencia-aplicaciones-almacenamiento.html", short: "32. Resiliencia sistemas", title: "Resiliencia de aplicaciones, almacenamiento y respaldo de datos", minutes: 15 },
    { id: "m33", file: "modulo-33-seguridad-privacidad-activos.html", short: "33. Seguridad y privacidad", title: "Seguridad, privacidad y protección de los activos de información", minutes: 12 },
    { id: "m34", file: "modulo-34-acceso-fisico-controles-ambientales.html", short: "34. Acceso físico", title: "Acceso físico y controles ambientales", minutes: 13 },
    { id: "m35", file: "modulo-35-gestion-identidades-acceso.html", short: "35. Identidades y acceso", title: "Gestión de identidades y acceso", minutes: 12 },
    { id: "m36", file: "modulo-36-control-acceso-logico.html", short: "36. Acceso lógico", title: "Control de acceso lógico", minutes: 14 },
    { id: "m37", file: "modulo-37-fuga-datos-virtualizacion-cliente-servidor.html", short: "37. DLP y virtualización", title: "Fuga de datos, virtualización y cliente/servidor", minutes: 12 },
    { id: "m38", file: "modulo-38-cortafuegos.html", short: "38. Cortafuegos", title: "Cortafuegos", minutes: 13 },
    { id: "m39", file: "modulo-39-ti-invisible-clasificacion-datos.html", short: "39. TI invisible y datos", title: "TI invisible y clasificación de datos", minutes: 11 },
    { id: "m40", file: "modulo-40-cifrado-pki.html", short: "40. Cifrado y PKI", title: "Cifrado y PKI", minutes: 13 },
    { id: "m41", file: "modulo-41-byod-movilidad-iot.html", short: "41. BYOD, móviles e IoT", title: "BYOD, movilidad e IoT", minutes: 12 },
    { id: "m42", file: "modulo-42-concienciacion-seguridad-ataques.html", short: "42. Concienciación y ataques", title: "Concienciación en seguridad y ataques", minutes: 13 },
    { id: "m43", file: "modulo-43-pruebas-monitoreo-seguridad.html", short: "43. Pruebas y monitoreo", title: "Pruebas de penetración y monitoreo de seguridad", minutes: 12 },
    { id: "m44", file: "modulo-44-respuesta-incidentes-forense.html", short: "44. Incidentes y forense", title: "Respuesta a incidentes y evidencia forense", minutes: 15 },
  ];

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { done: {}, quizzes: {} };
    } catch (e) {
      return { done: {}, quizzes: {} };
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* almacenamiento no disponible: se ignora silenciosamente */
    }
  }

  function setModuleDone(id, done) {
    const state = loadState();
    state.done[id] = !!done;
    saveState(state);
  }

  function isModuleDone(id) {
    return !!loadState().done[id];
  }

  function saveQuizScore(quizId, correct, total, topicScores, extra) {
    const state = loadState();
    const prev = state.quizzes[quizId];
    const attempt = { correct, total, topicScores: topicScores || null, date: new Date().toISOString() };
    if (extra) Object.assign(attempt, extra);
    const better =
      !prev ||
      (attempt.score !== undefined && prev.score !== undefined
        ? attempt.score > prev.score
        : correct > prev.correct);
    if (better) {
      state.quizzes[quizId] = attempt;
    } else {
      state.quizzes[quizId] = Object.assign({}, prev, { lastAttemptDate: attempt.date });
    }
    saveState(state);
  }

  function getQuizBest(quizId) {
    return loadState().quizzes[quizId] || null;
  }

  function completedCount() {
    const state = loadState();
    return MODULES.filter((m) => state.done[m.id]).length;
  }

  // ---------- UI: franja de progreso presente en cada página de módulo ----------
  function initProgressStrip(currentId) {
    const fill = document.querySelector("[data-progress-fill]");
    const label = document.querySelector("[data-progress-label]");
    if (!fill && !label) return;
    const done = completedCount();
    const total = MODULES.length;
    const pct = Math.round((done / total) * 100);
    if (fill) fill.style.width = pct + "%";
    if (label) {
      label.innerHTML =
        "<span>" + done + " de " + total + " módulos completados</span><span>" + pct + "%</span>";
    }
  }

  // ---------- UI: casilla "Marcar módulo como completado" ----------
  function initDoneToggle(id) {
    const box = document.getElementById("done-toggle-input");
    if (!box) return;
    box.checked = isModuleDone(id);
    box.addEventListener("change", function () {
      setModuleDone(id, box.checked);
      initProgressStrip(id);
    });
  }

  // ---------- UI: portada — tarjetas de módulos con estado ----------
  function initHomeModuleCards() {
    document.querySelectorAll("[data-module-card]").forEach(function (card) {
      const id = card.getAttribute("data-module-card");
      const statusEl = card.querySelector(".status");
      if (!statusEl) return;
      if (isModuleDone(id)) {
        statusEl.textContent = "Completado";
        statusEl.classList.add("done");
      } else {
        statusEl.textContent = "Pendiente";
      }
    });
    initProgressStrip();

    document.querySelectorAll("[data-final-best]").forEach(function (bestEl) {
      const quizId = bestEl.getAttribute("data-final-best") || "final";
      const best = getQuizBest(quizId);
      if (best) {
        const nota = (best.correct / best.total) * 10;
        bestEl.textContent = "Tu mejor resultado: " + best.correct + " / " + best.total +
          " aciertos (nota " + nota.toFixed(1) + " sobre 10)";
      } else {
        bestEl.textContent = "Aún no lo has realizado.";
      }
    });
  }

  window.CisaStudy = {
    MODULES,
    setModuleDone,
    isModuleDone,
    saveQuizScore,
    getQuizBest,
    initProgressStrip,
    initDoneToggle,
    initHomeModuleCards,
  };
})();
