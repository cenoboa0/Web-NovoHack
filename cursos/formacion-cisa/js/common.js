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
